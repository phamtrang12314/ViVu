package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.response.booking.BookingAdminResponse;
import com.vivugo.backend.admin.dto.response.booking.BookingDetailResponse;
import com.vivugo.backend.admin.dto.response.booking.BookingStatsResponse;
import com.vivugo.backend.admin.dto.response.tour.TourParticipantsResponse;
import com.vivugo.backend.admin.service.BookingAdminService;
import com.vivugo.backend.model.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/bookings")
public class BookingAdminController {

    private final BookingAdminService bookingAdminService;

    public BookingAdminController(BookingAdminService bookingAdminService) {
        this.bookingAdminService = bookingAdminService;
    }

    // Dùng cho màn Manage Booking
    @GetMapping
    public ResponseEntity<Page<BookingAdminResponse>> searchBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        Page<BookingAdminResponse> result =
                bookingAdminService.getAllBookings(page, size, search, status, sort, fromDate, toDate);
        return ResponseEntity.ok(result);
    }

    // Thống kê cho 4 card trên đầu
    @GetMapping("/stats")
    public ResponseEntity<BookingStatsResponse> getStats(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ResponseEntity.ok(bookingAdminService.getStats(fromDate, toDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDetailResponse> getBookingDetail(@PathVariable String id) {
        BookingDetailResponse detail = bookingAdminService.getBookingDetail(id);
        return ResponseEntity.ok(detail);
    }

    @GetMapping("/participants-by-tour")
    public ResponseEntity<TourParticipantsResponse> getParticipantsByTour(
            @RequestParam String tourId
    ) {
        return ResponseEntity.ok(bookingAdminService.getParticipantsByTour(tourId));
    }

    // xuất file
    @GetMapping("/tours/{tourId}/participants/export")
    public ResponseEntity<byte[]> exportParticipantsByTour(@PathVariable String tourId) {
        try {
            byte[] pdfBytes = bookingAdminService.exportParticipantsByTour(tourId);

            String filename = "danh-sach-khach-tour-" + tourId + ".pdf";

            return ResponseEntity
                    .ok()
                    .header("Content-Type", "application/pdf")
                    .header(
                            "Content-Disposition",
                            "attachment; filename=\"" + filename + "\""
                    )
                    .body(pdfBytes);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Danh sách booking ở trạng thái CANCELLATION_REQUESTED
    @GetMapping("/canceled")
    public ResponseEntity<Page<BookingAdminResponse>> getCanceledBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(bookingAdminService.getCanceledBookings(page, size));
    }

    // Duyệt hủy một booking (từ CANCELLATION_REQUESTED -> CANCELED)
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> approveCancelBooking(@PathVariable String id) {
        bookingAdminService.approveCancelBooking(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/approve-cancel")
    public ResponseEntity<?> approveCancel(@PathVariable Long id) {
        bookingAdminService.approveCancel(id);
        return ResponseEntity.ok("Đã duyệt hủy tour");
    }

    // Không duyệt hủy booking: từ CANCELLATION_REQUESTED -> CONFIRMED
    @PutMapping("/{id}/keep")
    public ResponseEntity<Void> keepBooking(@PathVariable String id) {
        bookingAdminService.keepBooking(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<Void> markRefunded(@PathVariable String id) {
        bookingAdminService.markRefunded(id);
        return ResponseEntity.ok().build();
    }

}
