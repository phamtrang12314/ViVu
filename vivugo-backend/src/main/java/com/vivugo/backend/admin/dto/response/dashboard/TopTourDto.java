package com.vivugo.backend.admin.dto.response.dashboard;

public class TopTourDto {

    private final String tourTitle;
    private final Long bookingCount;
    private final Double revenue;

    public TopTourDto(String tourTitle, Long bookingCount, Double revenue) {
        this.tourTitle = tourTitle;
        this.bookingCount = bookingCount;
        this.revenue = revenue;
    }

    public String getTourTitle() {
        return tourTitle;
    }

    public Long getBookingCount() {
        return bookingCount;
    }

    public Double getRevenue() {
        return revenue;
    }
}
