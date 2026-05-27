package com.vivugo.backend.dto;

public class ReviewRequest {
    private String tourId;
    private int rating; // 1-5 sao
    private String comment;

    public ReviewRequest() {}
    public ReviewRequest(String tourId, int rating, String comment) {
        this.tourId = tourId;
        this.rating = rating;
        this.comment = comment;
    }

    public String getTourId() { return tourId; }
    public void setTourId(String tourId) { this.tourId = tourId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}