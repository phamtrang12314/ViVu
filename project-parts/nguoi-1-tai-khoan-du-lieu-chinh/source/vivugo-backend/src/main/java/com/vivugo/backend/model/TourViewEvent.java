package com.vivugo.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "tour_view_events")
public class TourViewEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "session_id", length = 120)
    private String sessionId;

    @Column(name = "viewed_region", length = 80)
    private String viewedRegion;

    @Column(name = "viewed_price")
    private Double viewedPrice;

    @CreationTimestamp
    @Column(name = "viewed_at", nullable = false, updatable = false)
    private LocalDateTime viewedAt;

    public String getId() {
        return id;
    }

    public Tour getTour() {
        return tour;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getViewedRegion() {
        return viewedRegion;
    }

    public void setViewedRegion(String viewedRegion) {
        this.viewedRegion = viewedRegion;
    }

    public Double getViewedPrice() {
        return viewedPrice;
    }

    public void setViewedPrice(Double viewedPrice) {
        this.viewedPrice = viewedPrice;
    }

    public LocalDateTime getViewedAt() {
        return viewedAt;
    }
}
