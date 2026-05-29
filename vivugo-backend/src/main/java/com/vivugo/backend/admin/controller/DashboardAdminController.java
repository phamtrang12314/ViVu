package com.vivugo.backend.admin.controller;

import com.vivugo.backend.admin.dto.response.dashboard.DashboardStatsResponse;
import com.vivugo.backend.admin.service.DashboardAdminService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardAdminController {

    private final DashboardAdminService dashboardAdminService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer months
    ) {
        return ResponseEntity.ok(dashboardAdminService.getDashboardStats(year, months));
    }

    // API mới: Xuất báo cáo Booking ra file CSV
    @GetMapping("/export")
    public void exportBookings(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv; charset=UTF-8");
        response.setCharacterEncoding("UTF-8"); // Hỗ trợ tiếng Việt
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=bookings_report_" + System.currentTimeMillis() + ".csv";
        response.setHeader(headerKey, headerValue);

        // Thêm BOM cho Excel đọc được tiếng Việt UTF-8
        response.getWriter().write('\uFEFF');

        dashboardAdminService.exportBookingsToCsv(response.getWriter());
    }
}
