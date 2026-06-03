package com.vivugo.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "tour_types")
public class TourType {

    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
    private String tourTypeID;

    @Column(nullable = false, unique = true)
    private String nameType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updateDate;

    public String getTourTypeID() {
        return tourTypeID;
    }

    public void setTourTypeID(String tourTypeID) {
        this.tourTypeID = tourTypeID;
    }

    public String getNameType() {
        return nameType;
    }

    public void setNameType(String nameType) {
        this.nameType = nameType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }

    public Set<Tour> getTours() {
        return tours;
    }

    public void setTours(Set<Tour> tours) {
        this.tours = tours;
    }

    // --- Mối quan hệ ---

    // Sửa lỗi: 1 TourType có nhiều Tour
    @OneToMany(mappedBy = "tourType")
    private Set<Tour> tours;
}