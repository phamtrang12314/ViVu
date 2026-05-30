package com.vivugo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vivugo.backend.dto.SeePayWebhookRequest;
import com.vivugo.backend.service.BookingService;
import com.vivugo.backend.util.PaymentCodeUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final BookingService bookingService;
    private final ObjectMapper objectMapper;

    public WebhookController(BookingService bookingService, ObjectMapper objectMapper) {
        this.bookingService = bookingService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(value = {"/seepay", "/sepay"}, consumes = MediaType.ALL_VALUE)
    public ResponseEntity<Map<String, Object>> handleSeepayWebhook(
            HttpServletRequest request,
            @RequestBody(required = false) byte[] body
    ) {
        return processSeepayWebhook(fromRequest(request, body));
    }

    private ResponseEntity<Map<String, Object>> processSeepayWebhook(SeePayWebhookRequest webhookData) {
        try {
            if (webhookData == null) {
                return successResponse();
            }

            String transferType = firstNonBlank(webhookData.getTransferType());
            if (transferType != null && !"in".equalsIgnoreCase(transferType)) {
                return successResponse();
            }
            if (transferType == null
                    && (webhookData.getTransferAmount() == null
                    || webhookData.getTransferAmount().compareTo(BigDecimal.ZERO) <= 0)) {
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

    private SeePayWebhookRequest fromRequest(HttpServletRequest request, byte[] body) {
        SeePayWebhookRequest fromParameters = fromRequestParameters(request);
        if (hasAnyPayloadValue(fromParameters)) {
            return fromParameters;
        }

        String raw = body == null ? "" : new String(body, StandardCharsets.UTF_8).trim();
        if (raw.isBlank()) {
            return new SeePayWebhookRequest();
        }

        try {
            if (raw.startsWith("{")) {
                return objectMapper.readValue(raw, SeePayWebhookRequest.class);
            }
        } catch (Exception e) {
            System.out.println("SePay raw JSON parse failed: " + e.getMessage());
        }

        return fromQueryString(raw);
    }

    private SeePayWebhookRequest fromRequestParameters(HttpServletRequest request) {
        SeePayWebhookRequest data = new SeePayWebhookRequest();
        if (request == null || request.getParameterMap().isEmpty()) {
            return data;
        }

        data.setId(parseLong(firstNonBlank(request.getParameter("id"))));
        data.setGateway(firstNonBlank(request.getParameter("gateway")));
        data.setTransactionDate(firstNonBlank(request.getParameter("transactionDate"), request.getParameter("transaction_date")));
        data.setAccountNumber(firstNonBlank(request.getParameter("accountNumber"), request.getParameter("account_number")));
        data.setSubAccount(firstNonBlank(request.getParameter("subAccount"), request.getParameter("sub_account")));
        data.setCode(firstNonBlank(request.getParameter("code")));
        data.setContent(firstNonBlank(request.getParameter("content"), request.getParameter("transaction_content")));
        data.setTransferType(firstNonBlank(request.getParameter("transferType"), request.getParameter("transfer_type")));
        data.setTransferAmount(parseBigDecimal(firstNonBlank(
                request.getParameter("transferAmount"),
                request.getParameter("transfer_amount"),
                request.getParameter("amountIn"),
                request.getParameter("amount_in")
        )));
        data.setReferenceCode(firstNonBlank(
                request.getParameter("referenceCode"),
                request.getParameter("reference_code"),
                request.getParameter("reference_number")
        ));
        data.setDescription(firstNonBlank(request.getParameter("description")));
        return data;
    }

    private SeePayWebhookRequest fromQueryString(String raw) {
        SeePayWebhookRequest data = new SeePayWebhookRequest();
        Map<String, String> params = UriComponentsBuilder
                .fromUriString("?" + raw)
                .build()
                .getQueryParams()
                .toSingleValueMap();

        data.setId(parseLong(firstNonBlank(params.get("id"))));
        data.setGateway(firstNonBlank(params.get("gateway"), params.get("bank_brand_name")));
        data.setTransactionDate(firstNonBlank(params.get("transactionDate"), params.get("transaction_date")));
        data.setAccountNumber(firstNonBlank(params.get("accountNumber"), params.get("account_number")));
        data.setSubAccount(firstNonBlank(params.get("subAccount"), params.get("sub_account")));
        data.setCode(firstNonBlank(params.get("code")));
        data.setContent(firstNonBlank(params.get("content"), params.get("transaction_content")));
        data.setTransferType(firstNonBlank(params.get("transferType"), params.get("transfer_type")));
        data.setTransferAmount(parseBigDecimal(firstNonBlank(
                params.get("transferAmount"),
                params.get("transfer_amount"),
                params.get("amountIn"),
                params.get("amount_in")
        )));
        data.setReferenceCode(firstNonBlank(
                params.get("referenceCode"),
                params.get("reference_code"),
                params.get("reference_number")
        ));
        data.setDescription(firstNonBlank(params.get("description")));
        return data;
    }

    private boolean hasAnyPayloadValue(SeePayWebhookRequest data) {
        return data != null && firstNonBlank(
                data.getGateway(),
                data.getTransactionDate(),
                data.getAccountNumber(),
                data.getSubAccount(),
                data.getCode(),
                data.getContent(),
                data.getTransferType(),
                data.getReferenceCode(),
                data.getDescription(),
                data.getId() == null ? null : String.valueOf(data.getId()),
                data.getTransferAmount() == null ? null : data.getTransferAmount().toPlainString()
        ) != null;
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
            return new BigDecimal(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private ResponseEntity<Map<String, Object>> successResponse() {
        return ResponseEntity.ok(Map.of("success", true));
    }

    private String extractBookingId(SeePayWebhookRequest webhookData) {
        return PaymentCodeUtils.firstMatchingBookingId(
                webhookData.getCode(),
                webhookData.getContent(),
                webhookData.getDescription(),
                webhookData.getSubAccount()
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
