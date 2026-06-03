package com.vivugo.backend.dto;

import java.util.List;
import java.util.Map;

public class PreferenceProfileDto {
    private boolean hasBehavior;
    private Map<String, Long> regionCounts;
    private Map<String, Long> tourTypeCounts;
    private Double minViewedPrice;
    private Double maxViewedPrice;
    private Double averageViewedPrice;
    private List<String> viewedTourIds;

    public boolean isHasBehavior() {
        return hasBehavior;
    }

    public void setHasBehavior(boolean hasBehavior) {
        this.hasBehavior = hasBehavior;
    }

    public Map<String, Long> getRegionCounts() {
        return regionCounts;
    }

    public void setRegionCounts(Map<String, Long> regionCounts) {
        this.regionCounts = regionCounts;
    }

    public Map<String, Long> getTourTypeCounts() {
        return tourTypeCounts;
    }

    public void setTourTypeCounts(Map<String, Long> tourTypeCounts) {
        this.tourTypeCounts = tourTypeCounts;
    }

    public Double getMinViewedPrice() {
        return minViewedPrice;
    }

    public void setMinViewedPrice(Double minViewedPrice) {
        this.minViewedPrice = minViewedPrice;
    }

    public Double getMaxViewedPrice() {
        return maxViewedPrice;
    }

    public void setMaxViewedPrice(Double maxViewedPrice) {
        this.maxViewedPrice = maxViewedPrice;
    }

    public Double getAverageViewedPrice() {
        return averageViewedPrice;
    }

    public void setAverageViewedPrice(Double averageViewedPrice) {
        this.averageViewedPrice = averageViewedPrice;
    }

    public List<String> getViewedTourIds() {
        return viewedTourIds;
    }

    public void setViewedTourIds(List<String> viewedTourIds) {
        this.viewedTourIds = viewedTourIds;
    }
}
