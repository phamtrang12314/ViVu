package com.vivugo.backend.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class PaymentCodeUtils {

    private static final Pattern BOOKING_ID_PATTERN = Pattern.compile(
            "(?i)(tbbk)[\\s._:-]?([a-f0-9]{8})[\\s._:-]?([a-f0-9]{4})[\\s._:-]?([a-f0-9]{4})[\\s._:-]?([a-f0-9]{4})[\\s._:-]?([a-f0-9]{12})"
    );
    private static final Pattern BOOKING_ID_PREFIX_PATTERN = Pattern.compile("(?i)tbbk");

    private PaymentCodeUtils() {
    }

    public static String firstMatchingBookingId(String... values) {
        for (String value : values) {
            String bookingId = normalizeBookingId(value);
            if (bookingId != null) {
                return bookingId;
            }
        }
        return null;
    }

    public static String normalizeBookingId(String value) {
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

    private static String extractCompactBookingId(String value) {
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

    private static boolean isHexDigit(char value) {
        return (value >= '0' && value <= '9')
                || (value >= 'a' && value <= 'f')
                || (value >= 'A' && value <= 'F');
    }

    private static String formatBookingId(String prefix, String group1, String group2, String group3, String group4, String group5) {
        return String.format("%s-%s-%s-%s-%s-%s",
                prefix.toLowerCase(),
                group1.toLowerCase(),
                group2.toLowerCase(),
                group3.toLowerCase(),
                group4.toLowerCase(),
                group5.toLowerCase()
        );
    }
}
