package com.vivugo.backend.dto;

import com.vivugo.backend.model.Destination; // Thêm import

public class DestinationDto {
    private String destinationID;
    private String nameDes;
    private String region;

    // --- Constructors ---

    public DestinationDto() {
    }

    // SỬA LỖI: Thêm constructor này
    // Hàm khởi tạo này nhận Entity và trích xuất dữ liệu
    public DestinationDto(Destination destination) {
        this.destinationID = destination.getDestinationID();
        this.nameDes = destination.getNameDes();
        this.region = destination.getRegion();
    }

    // Constructor cũ của bạn (vẫn giữ lại nếu cần)
    public DestinationDto(String destinationID, String nameDes, String region) {
        this.destinationID = destinationID;
        this.nameDes = nameDes;
        this.region = region;
    }

    // --- Getters and Setters ---

    public String getDestinationID() {
        return destinationID;
    }
    public void setDestinationID(String destinationID) {
        this.destinationID = destinationID;
    }
    public String getNameDes() {
        return nameDes;
    }
    public void setNameDes(String nameDes) {
        this.nameDes = nameDes;
    }
    public String getRegion() {
        return region;
    }
    public void setRegion(String region) {
        this.region = region;
    }
}