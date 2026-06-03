package com.vivugo.backend.repository;

import com.vivugo.backend.model.TourViewEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourViewEventRepository extends JpaRepository<TourViewEvent, String> {
    List<TourViewEvent> findTop50ByUser_UserIDOrderByViewedAtDesc(String userId);

    List<TourViewEvent> findTop50BySessionIdOrderByViewedAtDesc(String sessionId);
}
