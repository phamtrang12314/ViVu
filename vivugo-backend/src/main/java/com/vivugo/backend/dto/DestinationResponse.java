package com.vivugo.backend.dto;

import java.util.List;

public class DestinationResponse {
    private String destinationID;
    private String nameDes;
    private String location;
    private String country;
    private String region; // Đã thêm
    private List<String> imageURLs;
    private long tourCount;

    // --- Constructors ---

    public DestinationResponse() {
    }

    public DestinationResponse(String destinationID, String nameDes, String location, String country, String region, List<String> imageURLs, long tourCount) {
        this.destinationID = destinationID;
        this.nameDes = nameDes;
        this.location = location;
        this.country = country;
        this.region = region;
        this.imageURLs = imageURLs;
        this.tourCount = tourCount;
    }

    // --- Getters and Setters ---

    public String getDestinationID() {
        return destinationID;
    }

    public void setDestinationID(String destinationID) {
        this.destinationID = destinationID;
    }

    public String getNameDes() {
        return nameDes;
    }

    public void setNameDes(String nameDes) {
        this.nameDes = nameDes;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public List<String> getImageURLs() {
        return imageURLs;
    }

    public void setImageURLs(List<String> imageURLs) {
        this.imageURLs = imageURLs;
    }

    public long getTourCount() {
        return tourCount;
    }

    public void setTourCount(long tourCount) {
        this.tourCount = tourCount;
    }
}