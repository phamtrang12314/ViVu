package com.vivugo.backend.dto;

import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.User;

public class UserProfileResponse {

    private String userID;
    private String username;
    private String name;
    private String email;
    private String role;
    private String avatarURL;
    private String phoneNumber;
    private String address;

    public UserProfileResponse(Account account) {
        User user = account.getUser();

        this.userID = user.getUserID();
        this.username = account.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = account.getRole().name();
        this.avatarURL = user.getAvatarURL();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
    }

    public String getUserID() { return userID; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getAvatarURL() { return avatarURL; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getAddress() { return address; }
}