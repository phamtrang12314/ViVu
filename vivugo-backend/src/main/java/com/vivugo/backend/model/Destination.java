package com.vivugo.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "destinations")
public class Destination {
    @Id
    @Column(length = 50)
    private String destinationID;

    @Column(nullable = false)
    private String nameDes;

    private String location;
    private String country;

    @Column(name = "region")
    private String region; // Đã thêm cột region

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    @OneToMany(mappedBy = "destination")
    private List<TourDestination> tourDestinations;

    // --- Constructors ---

    // Constructor không tham số (bắt buộc cho JPA)
    public Destination() {
    }

    // Constructor đầy đủ tham số (để thay thế @Builder/@AllArgsConstructor)
    public Destination(String destinationID, String nameDes, String location, String country, String region, List<Image> images, List<TourDestination> tourDestinations) {
        this.destinationID = destinationID;
        this.nameDes = nameDes;
        this.location = location;
        this.country = country;
        this.region = region;
        this.images = images;
        this.tourDestinations = tourDestinations;
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

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<TourDestination> getTourDestinations() {
        return tourDestinations;
    }

    public void setTourDestinations(List<TourDestination> tourDestinations) {
        this.tourDestinations = tourDestinations;
    }
}