package com.vivugo.backend.dto;

import com.vivugo.backend.model.TourImage;

public class TourImageDto {
    private String url;
    private String caption;

    // Constructor
    public TourImageDto(TourImage tourImage) {
        this.url = tourImage.getUrl();
        this.caption = tourImage.getCaption();
    }
    public TourImageDto() {
    }

    // Getters
    public String getUrl() { return url; }
    public String getCaption() { return caption; }
}