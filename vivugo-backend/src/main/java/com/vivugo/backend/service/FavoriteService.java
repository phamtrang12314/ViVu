package com.vivugo.backend.service;

import com.vivugo.backend.exception.ConflictException;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.Favorite;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.User;
import com.vivugo.backend.repository.FavoriteRepository;
import com.vivugo.backend.repository.TourRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List; // (1) THÊM IMPORT

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final TourRepository tourRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, TourRepository tourRepository) {
        this.favoriteRepository = favoriteRepository;
        this.tourRepository = tourRepository;
    }

    // (Code cũ của addFavorite giữ nguyên)
    @Transactional
    public void addFavorite(String tourId, Account currentUser) {
        // ... code cũ
        User user = currentUser.getUser();
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));
        if (favoriteRepository.existsByUserAndTour(user, tour)) {
            throw new ConflictException("You have already favorited this tour.");
        }
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setTour(tour);
        favoriteRepository.save(favorite);
    }

    // (Code cũ của removeFavorite giữ nguyên)
    @Transactional
    public void removeFavorite(String tourId, Account currentUser) {
        // ... code cũ
        User user = currentUser.getUser();
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));
        Favorite favorite = favoriteRepository.findByUserAndTour(user, tour)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found to delete."));
        favoriteRepository.delete(favorite);
    }

    // (2) THÊM PHƯƠNG THỨC MỚI
    /**
     * Lấy danh sách ID của các tour đã yêu thích
     */
    @Transactional(readOnly = true)
    public List<String> getFavoriteTourIds(Account currentUser) {
        User user = currentUser.getUser();
        return favoriteRepository.findTourIdsByUserId(user.getUserID());
    }
}