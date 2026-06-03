package com.vivugo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vivugo.backend.dto.SeePayWebhookRequest;
import com.vivugo.backend.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

class WebhookControllerTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void handlesCompactBookingIdWithBankPrefix() throws Exception {
        BookingService bookingService = mock(BookingService.class);
        WebhookController controller = controller(bookingService);
        SeePayWebhookRequest request = incomingRequest();
        request.setContent("131273790555-tbbk45915d45c4ec4f98abcd123456789abc");

        ResponseEntity<Map<String, Object>> response = postJson(controller, request);

        assertEquals(Boolean.TRUE, response.getBody().get("success"));
        verify(bookingService).processPaymentWebhook(
                "tbbk-45915d45-c4ec-4f98-abcd-123456789abc",
                new BigDecimal("200000"),
                "FT26150208529883"
        );
    }

    @Test
    void handlesHyphenatedBookingId() throws Exception {
        BookingService bookingService = mock(BookingService.class);
        WebhookController controller = controller(bookingService);
        SeePayWebhookRequest request = incomingRequest();
        request.setContent("tbbk-45915d45-c4ec-4f98-abcd-123456789abc");

        ResponseEntity<Map<String, Object>> response = postJson(controller, request);

        assertEquals(Boolean.TRUE, response.getBody().get("success"));
        verify(bookingService).processPaymentWebhook(
                "tbbk-45915d45-c4ec-4f98-abcd-123456789abc",
                new BigDecimal("200000"),
                "FT26150208529883"
        );
    }

    @Test
    void ignoresOutgoingTransfers() throws Exception {
        BookingService bookingService = mock(BookingService.class);
        WebhookController controller = controller(bookingService);
        SeePayWebhookRequest request = incomingRequest();
        request.setTransferType("out");
        request.setContent("tbbk45915d45c4ec4f98abcd123456789abc");

        ResponseEntity<Map<String, Object>> response = postJson(controller, request);

        assertEquals(Boolean.TRUE, response.getBody().get("success"));
        verifyNoInteractions(bookingService);
    }

    @Test
    void handlesFormUrlEncodedWebhookPayload() {
        BookingService bookingService = mock(BookingService.class);
        WebhookController controller = controller(bookingService);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addParameter("transferType", "in");
        request.addParameter("transferAmount", "5000");
        request.addParameter("referenceCode", "FT26150927045540");
        request.addParameter("content", "131274761669-tbbke963f7f8e21147e682390f5fb8a36c5a");

        ResponseEntity<Map<String, Object>> response = controller.handleSeepayWebhook(request, null);

        assertEquals(Boolean.TRUE, response.getBody().get("success"));
        verify(bookingService).processPaymentWebhook(
                "tbbk-e963f7f8-e211-47e6-8239-0f5fb8a36c5a",
                new BigDecimal("5000"),
                "FT26150927045540"
        );
    }

    @Test
    void handlesRawJsonWebhookPayloadWithoutTransferType() {
        BookingService bookingService = mock(BookingService.class);
        WebhookController controller = controller(bookingService);
        String rawJson = """
                {
                  "transferAmount": 15000,
                  "referenceCode": "FT26150800723505",
                  "content": "131279430640-tbbk227dcfbdb97241078568725e09f42b04"
                }
                """;

        ResponseEntity<Map<String, Object>> response = controller.handleSeepayWebhook(
                new MockHttpServletRequest(),
                rawJson.getBytes()
        );

        assertEquals(Boolean.TRUE, response.getBody().get("success"));
        verify(bookingService).processPaymentWebhook(
                "tbbk-227dcfbd-b972-4107-8568-725e09f42b04",
                new BigDecimal("15000"),
                "FT26150800723505"
        );
    }

    private SeePayWebhookRequest incomingRequest() {
        SeePayWebhookRequest request = new SeePayWebhookRequest();
        request.setTransferType("in");
        request.setTransferAmount(new BigDecimal("200000"));
        request.setReferenceCode("FT26150208529883");
        return request;
    }

    private WebhookController controller(BookingService bookingService) {
        return new WebhookController(bookingService, objectMapper);
    }

    private ResponseEntity<Map<String, Object>> postJson(WebhookController controller, SeePayWebhookRequest request) throws Exception {
        return controller.handleSeepayWebhook(
                new MockHttpServletRequest(),
                objectMapper.writeValueAsBytes(request)
        );
    }
}
