package com.vivugo.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vivugo.backend.model.Booking;
import com.vivugo.backend.model.enums.PaymentStatus;
import com.vivugo.backend.util.PaymentCodeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
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

@Service
public class SePayTransactionSyncService {

    private static final DateTimeFormatter SEPAY_DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final BookingService bookingService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiToken;
    private final String accountNumber;

    public SePayTransactionSyncService(
            BookingService bookingService,
            ObjectMapper objectMapper,
            @Value("${sepay.api-token:${SEPAY_API_TOKEN:}}") String apiToken,
            @Value("${sepay.account-number:${SEPAY_ACCOUNT_NUMBER:}}") String accountNumber
    ) {
        this.bookingService = bookingService;
        this.objectMapper = objectMapper;
        this.apiToken = apiToken;
        this.accountNumber = accountNumber;
        this.httpClient = HttpClient.newHttpClient();
    }

    public boolean isEnabled() {
        return apiToken != null && !apiToken.isBlank();
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
            HttpRequest request = HttpRequest.newBuilder(uri)
                    .header("Accept", "application/json")
                    .header("Authorization", "Bearer " + apiToken.trim())
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8)
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                System.err.println("SePay transaction sync failed with HTTP " + response.statusCode() + ": " + response.body());
                return false;
            }

            JsonNode transactions = objectMapper.readTree(response.body()).path("transactions");
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
            return new BigDecimal(value.trim());
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
    }
}
