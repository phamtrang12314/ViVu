package com.vivugo.backend.controller;

import com.vivugo.backend.dto.SeePayWebhookRequest;
import com.vivugo.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final BookingService bookingService;

    public WebhookController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping({"/seepay", "/sepay"})
    public ResponseEntity<Map<String, Object>> handleSeepayWebhook(@RequestBody SeePayWebhookRequest webhookData) {
        try {
            // 1. Kiểm tra tiền vào
            if (!"in".equalsIgnoreCase(webhookData.getTransferType())) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Ignored: Not an incoming transfer"));
            }

            String content = webhookData.getContent();
            String bookingId = null;

            // 2. [CẬP NHẬT REGEX] Tìm chuỗi có tiền tố 'tbbk'
            // Cấu trúc: tbbk (có thể viết hoa/thường) + tùy chọn dấu cách/gạch ngang + chuỗi Hex UUID
            // Ví dụ khớp: "tbbkc494...", "TBBK-c494...", "tbbk c494..."
            if (content != null) {
                // Regex này chia thành các nhóm (groups) để dễ dàng tái tạo lại định dạng chuẩn
                // Group 1: tbbk
                // Group 2-6: Các phần của UUID
                String regex = "(?i)(tbbk)[\\s-]?([a-f0-9]{8})[\\s-]?([a-f0-9]{4})[\\s-]?([a-f0-9]{4})[\\s-]?([a-f0-9]{4})[\\s-]?([a-f0-9]{12})";
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(content);

                if (matcher.find()) {
                    // Tái tạo lại chuỗi theo định dạng chuẩn của Database: tbbk-xxxxxxxx-xxxx-...
                    bookingId = String.format("%s-%s-%s-%s-%s-%s",
                            matcher.group(1).toLowerCase(), // tbbk (ép về chữ thường cho chuẩn)
                            matcher.group(2),
                            matcher.group(3),
                            matcher.group(4),
                            matcher.group(5),
                            matcher.group(6)
                    );
                }
            }

            if (bookingId == null) {
                System.out.println("Regex mismatch. Content: " + content);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Ignored: Booking ID (tbbk-...) pattern not found in content"
                ));
            }

            System.out.println("Final Processing Booking ID: " + bookingId);
            System.out.println("content: " + content);

            // 3. Gọi Service xử lý
            bookingService.processPaymentWebhook(
                    bookingId,
                    webhookData.getTransferAmount(),
                    webhookData.getReferenceCode()
            );

            return ResponseEntity.ok(Map.of("success", true, "message", "Webhook processed successfully"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("success", true, "message", "Error processing webhook: " + e.getMessage()));
        }
    }
}
