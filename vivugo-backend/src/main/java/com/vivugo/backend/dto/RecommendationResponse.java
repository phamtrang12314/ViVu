package com.vivugo.backend.dto;

import java.util.List;

public class RecommendationResponse {
    private String reason;
    private PreferenceProfileDto profile;
    private List<TourSummaryResponse> tours;

    public RecommendationResponse() {
    }

    public RecommendationResponse(String reason, PreferenceProfileDto profile, List<TourSummaryResponse> tours) {
        this.reason = reason;
        this.profile = profile;
        this.tours = tours;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public PreferenceProfileDto getProfile() {
        return profile;
    }

    public void setProfile(PreferenceProfileDto profile) {
        this.profile = profile;
    }

    public List<TourSummaryResponse> getTours() {
        return tours;
    }

    public void setTours(List<TourSummaryResponse> tours) {
        this.tours = tours;
    }
}
