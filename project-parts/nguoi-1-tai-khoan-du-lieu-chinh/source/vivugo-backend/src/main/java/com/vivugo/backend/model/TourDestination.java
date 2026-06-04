package com.vivugo.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tour_destinations")
public class TourDestination {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String tourDestinationID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    public String getTourDestinationID() {
        return tourDestinationID;
    }

    public void setTourDestinationID(String tourDestinationID) {
        this.tourDestinationID = tourDestinationID;
    }

    public Tour getTour() {
        return tour;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }

    public Destination getDestination() {
        return destination;
    }

    public void setDestination(Destination destination) {
        this.destination = destination;
    }
}