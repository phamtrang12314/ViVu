package com.vivugo.backend.repository;

import com.vivugo.backend.model.TourDestination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourDestinationRepository extends JpaRepository<TourDestination, String> {
}
