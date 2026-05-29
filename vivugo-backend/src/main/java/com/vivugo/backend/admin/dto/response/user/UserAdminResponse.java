package com.vivugo.backend.admin.dto.response.user;

import com.vivugo.backend.model.Account;
import com.vivugo.backend.model.User;
import lombok.Data;

@Data
public class UserAdminResponse {
    private String userID;
    private String name;
    private String email;
    private String phoneNumber;
    private String role;
    private boolean isLocked; // Từ bảng Account

    public UserAdminResponse(Account account) {
        User user = account.getUser();
        this.userID = user.getUserID();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.role = account.getRole().name();
        this.isLocked = account.isLocked();
    }

    // Các getters/setters khác (đã được tạo bởi @Data)
    public String getUserID() { return userID; }
    public void setUserID(String userID) { this.userID = userID; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isLocked() { return isLocked; }
    public void setLocked(boolean locked) { isLocked = locked; }
}