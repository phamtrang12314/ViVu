package com.vivugo.backend.repository;

import com.vivugo.backend.model.Favorite;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // (1) THÊM IMPORT
import org.springframework.data.repository.query.Param; // (2) THÊM IMPORT
import org.springframework.stereotype.Repository;

import java.util.List; // (3) THÊM IMPORT
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, String> {

    boolean existsByUserAndTour(User user, Tour tour);

    Optional<Favorite> findByUserAndTour(User user, Tour tour);

    // (4) THÊM PHƯƠNG THỨC MỚI
    /**
     * Truy vấn tất cả ID của các Tour mà một User đã yêu thích.
     */
    @Query("SELECT f.tour.tourID FROM Favorite f WHERE f.user.userID = :userId")
    List<String> findTourIdsByUserId(@Param("userId") String userId);
}