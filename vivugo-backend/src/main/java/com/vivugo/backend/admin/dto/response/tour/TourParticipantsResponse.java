package com.vivugo.backend.admin.dto.response.tour;

import com.vivugo.backend.model.enums.BookingStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class TourParticipantsResponse {

    private String tourId;
    private String tourName;
    private String destinationName;    // tên điểm đến (nếu có)
    private LocalDate startDate;   // ngày khởi hành
    private LocalDate endDate;     // ngày kết thúc


    private List<ParticipantInfo> participants;

    // từng khách tham gia tour
    public static class ParticipantInfo {
        private String participantId;
        private String fullName;
        private String phone;
        private String identification;
        private String gender;          // MALE/FEMALE/...
        private String participantType; // ADULT/CHILD/...

        private String bookingId;
        private LocalDateTime bookingDate;
        private BookingStatus bookingStatus;

        public String getParticipantId() {
            return participantId;
        }

        public void setParticipantId(String participantId) {
            this.participantId = participantId;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getIdentification() {
            return identification;
        }

        public void setIdentification(String identification) {
            this.identification = identification;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getParticipantType() {
            return participantType;
        }

        public void setParticipantType(String participantType) {
            this.participantType = participantType;
        }

        public String getBookingId() {
            return bookingId;
        }

        public void setBookingId(String bookingId) {
            this.bookingId = bookingId;
        }

        public LocalDateTime getBookingDate() {
            return bookingDate;
        }

        public void setBookingDate(LocalDateTime bookingDate) {
            this.bookingDate = bookingDate;
        }

        public BookingStatus getBookingStatus() {
            return bookingStatus;
        }

        public void setBookingStatus(BookingStatus bookingStatus) {
            this.bookingStatus = bookingStatus;
        }
    }
}
