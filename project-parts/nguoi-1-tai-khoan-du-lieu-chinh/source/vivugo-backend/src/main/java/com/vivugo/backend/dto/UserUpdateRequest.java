package com.vivugo.backend.dto;

import com.vivugo.backend.model.enums.Gender;
import java.time.LocalDate;

public class UserUpdateRequest {
    private String name;
    private String phoneNumber;
    private String address;
    private String avatarUrl;

    public UserUpdateRequest() {}

    public UserUpdateRequest(String name, String phoneNumber, String address, String avatarUrl) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.avatarUrl = avatarUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}