package com.vivugo.backend.controller;

import com.vivugo.backend.dto.SeePayWebhookRequest;
import com.vivugo.backend.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

class WebhookControllerTest {

    @Test
    void handlesCompactBookingIdWithBankPrefix() {
        BookingService bookingService = mock(BookingService.class);
        WebhookController controller = new WebhookController(bookingService);
        SeePayWebhookRequest request = incomingRequest();
        request.setContent("131273790555-tbbk45915d45c4ec4f98abcd123456789abc");

        ResponseEntity<Map<String, Object>> response = controller.handleSeepayJsonWebhook(request);

        assertEquals(Boolean.TRUE, response.getBody().get("success"));
        verify(bookingService).processPaymentWebhook(
                "tbbk-45915d45-c4ec-4f98-abcd-123456789abc",
                new BigDecimal("200000"),
                "FT26150208529883"
        );
    }

    @Test
    void handlesHyphenatedBookingId() {
        BookingService bookingService = mock(BookingService.class);
        WebhookController controller = new WebhookController(bookingService);
        SeePayWebhookRequest request = incomingRequest();
        request.setContent("tbbk-45915d45-c4ec-4f98-abcd-123456789abc");

        ResponseEntity<Map<String, Object>> response = controller.handleSeepayJsonWebhook(request);

        assertEquals(Boolean.TRUE, response.getBody().get("success"));
        verify(bookingService).processPaymentWebhook(
                "tbbk-45915d45-c4ec-4f98-abcd-123456789abc",
                new BigDecimal("200000"),
                "FT26150208529883"
        );
    }

    @Test
    void ignoresOutgoingTransfers() {
        BookingService bookingService = mock(BookingService.class);
        WebhookController controller = new WebhookController(bookingService);
        SeePayWebhookRequest request = incomingRequest();
        request.setTransferType("out");
        request.setContent("tbbk45915d45c4ec4f98abcd123456789abc");

        ResponseEntity<Map<String, Object>> response = controller.handleSeepayJsonWebhook(request);

        assertEquals(Boolean.TRUE, response.getBody().get("success"));
        verifyNoInteractions(bookingService);
    }

    @Test
    void handlesFormUrlEncodedWebhookPayload() {
        BookingService bookingService = mock(BookingService.class);
        WebhookController controller = new WebhookController(bookingService);
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("transferType", "in");
        formData.add("transferAmount", "5000");
        formData.add("referenceCode", "FT26150927045540");
        formData.add("content", "131274761669-tbbke963f7f8e21147e682390f5fb8a36c5a");

        ResponseEntity<Map<String, Object>> response = controller.handleSeepayFormWebhook(formData);

        assertEquals(Boolean.TRUE, response.getBody().get("success"));
        verify(bookingService).processPaymentWebhook(
                "tbbk-e963f7f8-e211-47e6-8239-0f5fb8a36c5a",
                new BigDecimal("5000"),
                "FT26150927045540"
        );
    }

    private SeePayWebhookRequest incomingRequest() {
        SeePayWebhookRequest request = new SeePayWebhookRequest();
        request.setTransferType("in");
        request.setTransferAmount(new BigDecimal("200000"));
        request.setReferenceCode("FT26150208529883");
        return request;
    }
}
