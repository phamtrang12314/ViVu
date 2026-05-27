package com.vivugo.backend.dto;

import com.vivugo.backend.model.enums.Gender;
import com.vivugo.backend.model.enums.ParticipantType;
import lombok.Data;
import java.util.List;

// DTO để nhận dữ liệu đặt tour từ client
@Data
public class BookingRequest {
    private String tourID;
    private int numAdults;
    private int numChildren;
    private String promotionCode; // Mã khuyến mãi (nếu có)

    // [NEW] Danh sách người tham gia
    private List<ParticipantDto> participants;

    // Thông tin cơ bản của người đặt (có thể lấy từ token)
    // Trường hợp này, ta sẽ lấy userID từ JWT Token

    // Getter/Setter thủ công cho các trường cũ (giữ nguyên style của bạn)
    public String getTourID() {
        return tourID;
    }

    public void setTourID(String tourID) {
        this.tourID = tourID;
    }

    public int getNumAdults() {
        return numAdults;
    }

    public void setNumAdults(int numAdults) {
        this.numAdults = numAdults;
    }

    public int getNumChildren() {
        return numChildren;
    }

    public void setNumChildren(int numChildren) {
        this.numChildren = numChildren;
    }

    public String getPromotionCode() {
        return promotionCode;
    }

    public void setPromotionCode(String promotionCode) {
        this.promotionCode = promotionCode;
    }

    public List<ParticipantDto> getParticipants() {
        return participants;
    }

    public void setParticipants(List<ParticipantDto> participants) {
        this.participants = participants;
    }

    // [NEW] Inner class DTO cho từng người tham gia
    @Data
    public static class ParticipantDto {
        private String customerName;
        private String customerPhone;
        private String identification;
        private Gender gender;             // Enum: MALE, FEMALE, OTHER
        private ParticipantType participantType; // Enum: ADULT, CHILD
    }
}