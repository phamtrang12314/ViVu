package com.vivugo.backend.service;

import com.vivugo.backend.dto.DestinationResponse;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.Destination;
import com.vivugo.backend.model.Image;
import com.vivugo.backend.repository.DestinationRepository;
import com.vivugo.backend.repository.TourRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final TourRepository tourRepository;

    @Autowired
    public DestinationService(DestinationRepository destinationRepository, TourRepository tourRepository) {
        this.destinationRepository = destinationRepository;
        this.tourRepository = tourRepository;
    }

    @Cacheable(cacheNames = "destination:popular")
    public List<DestinationResponse> getPopularDestinations() {
        // Lấy 6 điểm đến, có thể thay đổi logic sau
        return destinationRepository.findAll().stream()
                .limit(6)
                .map(this::convertToDestinationResponse)
                .collect(Collectors.toList());
    }

    // (SỬA LỖI 1) Phương thức này cho trường hợp không có region
    @Cacheable(cacheNames = "destination:all")
    public List<DestinationResponse> getAllDestinations() {
        return destinationRepository.findAll().stream()
                .map(this::convertToDestinationResponse)
                .collect(Collectors.toList());
    }

    // (SỬA LỖI 1) Thêm phương thức mới này để xử lý khi có region
    @Cacheable(cacheNames = "destination:region", key = "#region")
    public List<DestinationResponse> getAllDestinations(String region) {
        // Dùng phương thức mới của repository để lọc
        return destinationRepository.findAllByRegion(region).stream()
                .map(this::convertToDestinationResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(cacheNames = "destination:detail", key = "#id")
    public DestinationResponse getDestinationById(String id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
        return convertToDestinationResponse(destination);
    }

    private DestinationResponse convertToDestinationResponse(Destination destination) {
        DestinationResponse response = new DestinationResponse();
        response.setDestinationID(destination.getDestinationID());
        response.setNameDes(destination.getNameDes());
        response.setLocation(destination.getLocation());
        response.setCountry(destination.getCountry());
        response.setRegion(destination.getRegion()); // Đã có từ lần sửa trước

        response.setImageURLs(destination.getImages().stream()
                .map(Image::getUrl)
                .collect(Collectors.toList()));

        long tourCount = tourRepository.countByTourDestinationsDestination(destination);
        response.setTourCount(tourCount);

        return response;
    }
}
