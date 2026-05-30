package com.vivugo.backend.controller;

import com.vivugo.backend.dto.SeePayWebhookRequest;
import com.vivugo.backend.service.BookingService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private static final Pattern BOOKING_ID_PATTERN = Pattern.compile(
            "(?i)(tbbk)[\\s._:-]?([a-f0-9]{8})[\\s._:-]?([a-f0-9]{4})[\\s._:-]?([a-f0-9]{4})[\\s._:-]?([a-f0-9]{4})[\\s._:-]?([a-f0-9]{12})"
    );
    private static final Pattern BOOKING_ID_PREFIX_PATTERN = Pattern.compile("(?i)tbbk");

    private final BookingService bookingService;

    public WebhookController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping(
            value = {"/seepay", "/sepay"},
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> handleSeepayJsonWebhook(@RequestBody SeePayWebhookRequest webhookData) {
        return processSeepayWebhook(webhookData);
    }

    @PostMapping(
            value = {"/seepay", "/sepay"},
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE
    )
    public ResponseEntity<Map<String, Object>> handleSeepayFormWebhook(@RequestParam MultiValueMap<String, String> formData) {
        return processSeepayWebhook(fromFormData(formData));
    }

    @PostMapping(
            value = {"/seepay", "/sepay"},
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, Object>> handleSeepayMultipartWebhook(@ModelAttribute SeePayWebhookRequest webhookData) {
        return processSeepayWebhook(webhookData);
    }

    private ResponseEntity<Map<String, Object>> processSeepayWebhook(SeePayWebhookRequest webhookData) {
        try {
            if (!"in".equalsIgnoreCase(webhookData.getTransferType())) {
                return successResponse();
            }

            String bookingId = extractBookingId(webhookData);
            if (bookingId == null) {
                System.out.println("SePay webhook ignored. Booking ID not found. content="
                        + webhookData.getContent() + ", code=" + webhookData.getCode()
                        + ", description=" + webhookData.getDescription());
                return successResponse();
            }

            String transactionCode = firstNonBlank(
                    webhookData.getReferenceCode(),
                    webhookData.getId() != null ? String.valueOf(webhookData.getId()) : null
            );

            System.out.println("Processing SePay payment for booking " + bookingId
                    + ", amount=" + webhookData.getTransferAmount()
                    + ", reference=" + transactionCode);

            bookingService.processPaymentWebhook(
                    bookingId,
                    webhookData.getTransferAmount(),
                    transactionCode
            );

            return successResponse();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false));
        }
    }

    private SeePayWebhookRequest fromFormData(MultiValueMap<String, String> formData) {
        SeePayWebhookRequest request = new SeePayWebhookRequest();
        request.setId(parseLong(firstNonBlank(formData.getFirst("id"))));
        request.setGateway(firstNonBlank(formData.getFirst("gateway")));
        request.setTransactionDate(firstNonBlank(formData.getFirst("transactionDate"), formData.getFirst("transaction_date")));
        request.setAccountNumber(firstNonBlank(formData.getFirst("accountNumber"), formData.getFirst("account_number")));
        request.setSubAccount(firstNonBlank(formData.getFirst("subAccount"), formData.getFirst("sub_account")));
        request.setCode(firstNonBlank(formData.getFirst("code")));
        request.setContent(firstNonBlank(formData.getFirst("content")));
        request.setTransferType(firstNonBlank(formData.getFirst("transferType"), formData.getFirst("transfer_type")));
        request.setTransferAmount(parseBigDecimal(firstNonBlank(
                formData.getFirst("transferAmount"),
                formData.getFirst("transfer_amount"),
                formData.getFirst("amountIn"),
                formData.getFirst("amount_in")
        )));
        request.setReferenceCode(firstNonBlank(formData.getFirst("referenceCode"), formData.getFirst("reference_code")));
        request.setDescription(firstNonBlank(formData.getFirst("description")));
        return request;
    }

    private Long parseLong(String value) {
        if (value == null) {
            return null;
        }
        try {
            return Long.valueOf(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private BigDecimal parseBigDecimal(String value) {
        if (value == null) {
            return null;
        }
        try {
            return new BigDecimal(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private ResponseEntity<Map<String, Object>> successResponse() {
        return ResponseEntity.ok(Map.of("success", true));
    }

    private String extractBookingId(SeePayWebhookRequest webhookData) {
        return firstMatchingBookingId(
                webhookData.getCode(),
                webhookData.getContent(),
                webhookData.getDescription(),
                webhookData.getSubAccount()
        );
    }

    private String firstMatchingBookingId(String... values) {
        for (String value : values) {
            String bookingId = normalizeBookingId(value);
            if (bookingId != null) {
                return bookingId;
            }
        }
        return null;
    }

    private String normalizeBookingId(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        Matcher matcher = BOOKING_ID_PATTERN.matcher(value);
        if (matcher.find()) {
            return formatBookingId(
                    matcher.group(1),
                    matcher.group(2),
                    matcher.group(3),
                    matcher.group(4),
                    matcher.group(5),
                    matcher.group(6)
            );
        }

        String compactBookingId = extractCompactBookingId(value);
        if (compactBookingId == null) {
            return null;
        }

        return formatBookingId(
                compactBookingId.substring(0, 4),
                compactBookingId.substring(4, 12),
                compactBookingId.substring(12, 16),
                compactBookingId.substring(16, 20),
                compactBookingId.substring(20, 24),
                compactBookingId.substring(24)
        );
    }

    private String extractCompactBookingId(String value) {
        Matcher prefixMatcher = BOOKING_ID_PREFIX_PATTERN.matcher(value);
        while (prefixMatcher.find()) {
            StringBuilder hexDigits = new StringBuilder(32);
            for (int i = prefixMatcher.end(); i < value.length() && hexDigits.length() < 32; i++) {
                char current = value.charAt(i);
                if (isHexDigit(current)) {
                    hexDigits.append(Character.toLowerCase(current));
                    continue;
                }
                if (Character.isLetterOrDigit(current)) {
                    break;
                }
            }

            if (hexDigits.length() == 32) {
                return "tbbk" + hexDigits;
            }
        }
        return null;
    }

    private boolean isHexDigit(char value) {
        return (value >= '0' && value <= '9')
                || (value >= 'a' && value <= 'f')
                || (value >= 'A' && value <= 'F');
    }

    private String formatBookingId(String prefix, String group1, String group2, String group3, String group4, String group5) {
        return String.format("%s-%s-%s-%s-%s-%s",
                prefix.toLowerCase(),
                group1.toLowerCase(),
                group2.toLowerCase(),
                group3.toLowerCase(),
                group4.toLowerCase(),
                group5.toLowerCase()
        );
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
