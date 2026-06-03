package com.vivugo.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tour_images")
public class TourImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String tourImageID;

    @Column(nullable = false)
    private String url;

    private String caption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    public String getTourImageID() {
        return tourImageID;
    }

    public void setTourImageID(String tourImageID) {
        this.tourImageID = tourImageID;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Tour getTour() {
        return tour;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }
}