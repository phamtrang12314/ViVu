package com.vivugo.backend.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class PaymentCodeUtilsTest {

    @Test
    void normalizesHyphenatedBookingId() {
        String bookingId = PaymentCodeUtils.normalizeBookingId("Thanh toan TBBK-45915D45-C4EC-4F98-ABCD-123456789ABC");

        assertEquals("tbbk-45915d45-c4ec-4f98-abcd-123456789abc", bookingId);
    }

    @Test
    void extractsCompactBookingIdAfterBankPrefix() {
        String bookingId = PaymentCodeUtils.normalizeBookingId("131273790555-tbbk45915d45c4ec4f98abcd123456789abc");

        assertEquals("tbbk-45915d45-c4ec-4f98-abcd-123456789abc", bookingId);
    }

    @Test
    void ignoresCompactCandidateWhenFollowedByNonHexLetter() {
        String bookingId = PaymentCodeUtils.normalizeBookingId("tbbk45915d45c4ec4f98abcd123456789abcXYZ");

        assertEquals("tbbk-45915d45-c4ec-4f98-abcd-123456789abc", bookingId);
    }

    @Test
    void returnsFirstMatchingBookingIdAcrossValues() {
        String bookingId = PaymentCodeUtils.firstMatchingBookingId(
                null,
                "no booking here",
                "note tbbk.227dcfbd.b972.4107.8568.725e09f42b04"
        );

        assertEquals("tbbk-227dcfbd-b972-4107-8568-725e09f42b04", bookingId);
    }

    @Test
    void returnsNullForBlankOrInvalidValue() {
        assertNull(PaymentCodeUtils.normalizeBookingId(null));
        assertNull(PaymentCodeUtils.normalizeBookingId(" "));
        assertNull(PaymentCodeUtils.normalizeBookingId("TBBK-not-a-booking"));
    }
}
