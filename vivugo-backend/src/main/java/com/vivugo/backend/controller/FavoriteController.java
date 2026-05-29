package com.vivugo.backend.controller;

import com.vivugo.backend.dto.FavoriteRequest;
import com.vivugo.backend.model.Account;
import com.vivugo.backend.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping; // (1) THÊM IMPORT
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List; // (2) THÊM IMPORT

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    // (Code cũ của addFavorite giữ nguyên)
    @PostMapping
    public ResponseEntity<?> addFavorite(
            @AuthenticationPrincipal Account currentUser,
            @RequestBody FavoriteRequest request
    ) {
        favoriteService.addFavorite(request.getTourId(), currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // (Code cũ của removeFavorite giữ nguyên)
    @DeleteMapping("/tour/{tourId}")
    public ResponseEntity<?> removeFavorite(
            @AuthenticationPrincipal Account currentUser,
            @PathVariable String tourId
    ) {
        favoriteService.removeFavorite(tourId, currentUser);
        return ResponseEntity.ok().build();
    }

    // (3) THÊM ENDPOINT MỚI
    /**
     * API để lấy danh sách (chỉ ID) các tour đã yêu thích của user.
     */
    @GetMapping("/my-ids")
    public ResponseEntity<List<String>> getMyFavoriteIds(
            @AuthenticationPrincipal Account currentUser
    ) {
        List<String> ids = favoriteService.getFavoriteTourIds(currentUser);
        return ResponseEntity.ok(ids);
    }
}