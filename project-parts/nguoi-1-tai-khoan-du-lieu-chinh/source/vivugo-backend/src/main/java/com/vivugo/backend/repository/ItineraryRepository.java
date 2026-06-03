package com.vivugo.backend.repository;

import com.vivugo.backend.model.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItineraryRepository extends JpaRepository<Itinerary, String> { }