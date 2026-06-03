package com.vivugo.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vivugo.backend.model.Booking;
import com.vivugo.backend.model.enums.BookingStatus;
import com.vivugo.backend.model.enums.PaymentStatus;
import com.vivugo.backend.repository.BookingRepository;
import com.vivugo.backend.util.PaymentCodeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SePayTransactionSyncService {

    private static final DateTimeFormatter SEPAY_DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final int MAX_ATTEMPTS = 3;

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiToken;
    private final String accountNumber;

    public SePayTransactionSyncService(
            BookingService bookingService,
            BookingRepository bookingRepository,
            ObjectMapper objectMapper,
            @Value("${sepay.api-token:${SEPAY_API_TOKEN:}}") String apiToken,
            @Value("${sepay.account-number:${SEPAY_ACCOUNT_NUMBER:}}") String accountNumber
    ) {
        this.bookingService = bookingService;
        this.bookingRepository = bookingRepository;
        this.objectMapper = objectMapper;
        this.apiToken = apiToken;
        this.accountNumber = accountNumber;
        this.httpClient = HttpClient.newHttpClient();
    }

    public boolean isEnabled() {
        return apiToken != null && !apiToken.isBlank();
    }

    @Scheduled(
            fixedDelayString = "${sepay.sync.fixed-delay-ms:${SEPAY_SYNC_FIXED_DELAY_MS:30000}}",
            initialDelayString = "${sepay.sync.initial-delay-ms:${SEPAY_SYNC_INITIAL_DELAY_MS:10000}}"
    )
    @Transactional
    public void reconcileProcessingBookings() {
        if (!isEnabled()) {
            return;
        }

        List<Booking> processingBookings = bookingRepository.findByStatus(BookingStatus.PROCESSING);
        for (Booking booking : processingBookings) {
            try {
                reconcileBooking(booking);
            } catch (Exception e) {
                System.err.println("SePay scheduled reconciliation failed for booking "
                        + booking.getBookingID() + ": " + e.getMessage());
            }
        }
    }

    public boolean reconcileBooking(Booking booking) {
        if (!isEnabled() || booking == null || booking.getBookingID() == null
                || bookingService.resolvePaymentStatus(booking) == PaymentStatus.SUCCESS) {
            return false;
        }

        BigDecimal expectedAmount = BigDecimal.valueOf(booking.getFinalAmount() == null ? 0.0 : booking.getFinalAmount())
                .setScale(0, RoundingMode.HALF_UP);
        if (expectedAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        try {
            URI uri = buildTransactionsUri(booking, expectedAmount);
            JsonNode transactions = fetchTransactionsWithRetry(uri);
            if (!transactions.isArray()) {
                return false;
            }

            for (JsonNode transaction : transactions) {
                if (matchesAndProcess(booking, expectedAmount, transaction)) {
                    return true;
                }
            }
        } catch (Exception e) {
            System.err.println("SePay transaction sync failed: " + e.getMessage());
        }

        return false;
    }

    private JsonNode fetchTransactionsWithRetry(URI uri) throws Exception {
        Exception lastException = null;

        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                HttpRequest request = HttpRequest.newBuilder(uri)
                        .header("Accept", "application/json")
                        .header("Authorization", "Bearer " + apiToken.trim())
                        .GET()
                        .build();

                HttpResponse<String> response = httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8)
                );

                if (response.statusCode() >= 200 && response.statusCode() < 300) {
                    return objectMapper.readTree(response.body()).path("transactions");
                }

                lastException = new IllegalStateException(
                        "SePay transaction sync failed with HTTP " + response.statusCode() + ": " + response.body()
                );
            } catch (Exception e) {
                lastException = e;
            }

            if (attempt < MAX_ATTEMPTS) {
                sleepBeforeRetry(attempt);
            }
        }

        if (lastException != null) {
            throw lastException;
        }
        throw new IllegalStateException("SePay transaction sync failed without details.");
    }

    private URI buildTransactionsUri(Booking booking, BigDecimal expectedAmount) {
        LocalDateTime minTime = booking.getBookingDate() == null
                ? LocalDateTime.now().minusDays(1)
                : booking.getBookingDate().minusHours(2);

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString("https://my.sepay.vn/userapi/transactions/list")
                .queryParam("limit", "50")
                .queryParam("amount_in", expectedAmount.toPlainString())
                .queryParam("transaction_date_min", minTime.format(SEPAY_DATE_TIME));

        if (accountNumber != null && !accountNumber.isBlank()) {
            builder.queryParam("account_number", accountNumber.trim());
        }

        return builder.build().encode().toUri();
    }

    private boolean matchesAndProcess(Booking booking, BigDecimal expectedAmount, JsonNode transaction) {
        String matchedBookingId = PaymentCodeUtils.firstMatchingBookingId(
                text(transaction, "code"),
                text(transaction, "transaction_content"),
                text(transaction, "sub_account")
        );
        if (!booking.getBookingID().equalsIgnoreCase(matchedBookingId)) {
            return false;
        }

        BigDecimal amountIn = decimal(transaction, "amount_in");
        if (amountIn.compareTo(expectedAmount) < 0) {
            return false;
        }

        String transactionCode = firstNonBlank(
                text(transaction, "reference_number"),
                text(transaction, "id")
        );

        bookingService.processPaymentWebhook(booking.getBookingID(), amountIn, transactionCode);
        return true;
    }

    private String text(JsonNode node, String fieldName) {
        JsonNode value = node == null ? null : node.get(fieldName);
        if (value == null || value.isNull()) {
            return null;
        }
        return value.asText();
    }

    private BigDecimal decimal(JsonNode node, String fieldName) {
        String value = text(node, fieldName);
        if (value == null || value.isBlank()) {
            return BigDecimal.ZERO;
        }
        try {
            return new BigDecimal(normalizeMoney(value));
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }

    private String normalizeMoney(String value) {
        String normalized = value.trim().replace(",", "").replace(" ", "");
        if (normalized.matches("\\d{1,3}(\\.\\d{3})+")) {
            return normalized.replace(".", "");
        }
        return normalized;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
    }

    private void sleepBeforeRetry(int attempt) {
        long delayMs = 1000L + (attempt - 1) * 1000L;
        try {
            Thread.sleep(delayMs);
        } catch (InterruptedException interruptedException) {
            Thread.currentThread().interrupt();
        }
    }
}
