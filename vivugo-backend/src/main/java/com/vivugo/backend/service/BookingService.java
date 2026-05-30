package com.vivugo.backend.service;

import com.vivugo.backend.dto.BookingHistoryResponse;
import com.vivugo.backend.dto.BookingRequest;
import com.vivugo.backend.exception.ResourceNotFoundException;
import com.vivugo.backend.model.*;
import com.vivugo.backend.service.EmailService.PaymentSuccessEmailData;
import com.vivugo.backend.model.enums.BookingStatus;
import com.vivugo.backend.model.enums.PaymentStatus;
import com.vivugo.backend.repository.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashSet;
import java.util.UUID;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final long PAYMENT_TIMEOUT_MINUTES = 30;

    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final EmailService emailService;

    public BookingService(TourRepository tourRepository,
                          BookingRepository bookingRepository,
                          UserRepository userRepository,
                          PaymentRepository paymentRepository,
                          InvoiceRepository invoiceRepository,
                          EmailService emailService) {
        this.tourRepository = tourRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.emailService = emailService;
    }

    // 1. Logic tạo Booking mới
    @Transactional
    public Booking processBooking(BookingRequest request, Account account) {
        // Tìm Tour
        Tour tour = tourRepository.findById(request.getTourID())
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        // Tìm User
        User user = userRepository.findById(account.getUser().getUserID())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tính giá
        double totalPrice = (tour.getPriceAdult() * request.getNumAdults())
                + (tour.getPriceChild() * request.getNumChildren());

        // Tạo Booking
        Booking booking = new Booking();
        String customID = "tbbk-" + UUID.randomUUID().toString();
        booking.setBookingID(customID);
        booking.setTour(tour);
        booking.setUser(user);
        booking.setNumAdults(request.getNumAdults());
        booking.setNumChildren(request.getNumChildren());
        booking.setTotalPrice(totalPrice);
        booking.setFinalAmount(totalPrice); 
        booking.setStatus(BookingStatus.PROCESSING); 

        // [NEW LOGIC] Xử lý danh sách người tham gia (Participants)
        if (request.getParticipants() != null && !request.getParticipants().isEmpty()) {
            Set<Participant> participantSet = new HashSet<>();

            for (BookingRequest.ParticipantDto dto : request.getParticipants()) {
                Participant p = new Participant();
                p.setCustomerName(dto.getCustomerName());
                p.setCustomerPhone(dto.getCustomerPhone());
                p.setIdentification(dto.getIdentification());
                p.setGender(dto.getGender());
                p.setParticipantType(dto.getParticipantType());

                // Quan trọng: Gán Booking cho Participant để tạo khóa ngoại đúng
                p.setBooking(booking);

                participantSet.add(p);
            }

            booking.setParticipants(participantSet);
        }

        // Tạo Invoice (Hóa đơn) rỗng đi kèm
        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setTotalAmount(totalPrice);

        // [UPDATED] Chỉ set ngày tạo, không set PaymentStatus cho Invoice nữa
        invoice.setCreatedAt(LocalDateTime.now());

        booking.setInvoice(invoice);

        // Lưu Booking (Cascade sẽ tự lưu Invoice và Participants)
        return bookingRepository.save(booking);
    }

    // Helper: Lấy Booking theo ID
    public Booking getBookingById(String bookingID) {
        return bookingRepository.findById(bookingID)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // 2. Logic Xử lý Webhook Thanh toán
    @Transactional
    public void processPaymentWebhook(String bookingId, BigDecimal amount, String transactionInfo) {
        // Tìm Booking theo ID nhận được từ nội dung chuyển khoản
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking ID from webhook not found: " + bookingId));

        // Kiểm tra xem đã thanh toán chưa để tránh xử lý trùng
        BigDecimal paidAmount = amount == null ? BigDecimal.ZERO : amount;
        BigDecimal expectedAmount = BigDecimal.valueOf(booking.getFinalAmount() == null ? 0.0 : booking.getFinalAmount());

        if (paidAmount.compareTo(expectedAmount) < 0) {
            throw new IllegalArgumentException("So tien chuyen khoan chua du cho booking " + bookingId);
        }

        if (transactionInfo != null && !transactionInfo.isBlank()
                && paymentRepository.existsByTransactionCode(transactionInfo)) {
            System.out.println("Duplicate bank transaction ignored: " + transactionInfo);
            return;
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED
                || resolvePaymentStatus(booking) == PaymentStatus.SUCCESS) {
            System.out.println("Booking " + bookingId + " is already paid.");
            return;
        }

        // 1. Cập nhật trạng thái Booking -> CONFIRMED (Đã xác nhận)
        booking.setStatus(BookingStatus.CONFIRMED);

        // 2. Tạo bản ghi Payment và gắn vào Invoice
        Invoice invoice = booking.getInvoice();
        if (invoice == null) {
            invoice = new Invoice();
            invoice.setBooking(booking);
            invoice.setTotalAmount(booking.getFinalAmount());
            invoice.setCreatedAt(LocalDateTime.now());
            booking.setInvoice(invoice);
            invoice = invoiceRepository.save(invoice);
        }

        if (invoice != null) {
            // [UPDATED] Không set PaymentStatus cho Invoice ở đây nữa

            // Tạo Payment mới
            Payment payment = new Payment();
            payment.setInvoice(invoice);
            payment.setAmountPaid(paidAmount.doubleValue());
            payment.setPaymentDate(LocalDateTime.now());
            payment.setPaymentMethod("BANK_TRANSFER_QR");
            payment.setTransactionCode(transactionInfo); // Mã tham chiếu từ ngân hàng

            // Set trạng thái cho Payment (Giao dịch thành công)
            payment.setStatus(PaymentStatus.SUCCESS);

            // Lưu Payment
            paymentRepository.save(payment);
            // Invoice có thể không cần save lại nếu không thay đổi field nào,
            // nhưng cứ để save để đảm bảo tính nhất quán nếu có trigger cập nhật ngày sửa đổi
            invoiceRepository.save(invoice);
        }

        Booking savedBooking = bookingRepository.save(booking);
        System.out.println("Successfully updated Booking " + bookingId + " to CONFIRMED.");

        try {
            String customerEmail = savedBooking.getUser().getEmail();
            String customerName = savedBooking.getUser().getName();

            if (customerEmail != null && !customerEmail.isEmpty()) {
                // [FIX] Lấy dữ liệu cần thiết ngay trong Transaction để tránh LazyInitializationException
                PaymentSuccessEmailData emailData = PaymentSuccessEmailData.builder()
                        .toEmail(customerEmail)
                        .customerName(customerName)
                        .bookingId(savedBooking.getBookingID())
                        .tourTitle(savedBooking.getTour().getTitle())      // Hibernate sẽ query Tour tại đây
                        .startDate(savedBooking.getTour().getStartDate())  // Hibernate sẽ query Tour tại đây
                        .numAdults(savedBooking.getNumAdults())
                        .numChildren(savedBooking.getNumChildren())
                        .finalAmount(savedBooking.getFinalAmount())
                        .build();

                // Gọi hàm Async với DTO
                emailService.sendPaymentSuccessEmail(emailData);
            } else {
                System.out.println("User email is empty, skipping email notification.");
            }
        } catch (Exception e) {
            // Log lỗi email nhưng KHÔNG throw exception để tránh rollback giao dịch thanh toán
            System.err.println("Error triggering payment email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional(readOnly = true)
    public List<BookingHistoryResponse> getUserBookingHistory(Account currentUser) {
        String userID = currentUser.getUser().getUserID();

        List<Booking> bookings = bookingRepository.findAllByUser_userID(userID);

        return bookings.stream()
                .map(BookingHistoryResponse::new)
                .collect(Collectors.toList());
    }

    public PaymentStatus resolvePaymentStatus(Booking booking) {
        if (booking == null || booking.getInvoice() == null
                || booking.getInvoice().getPayments() == null
                || booking.getInvoice().getPayments().isEmpty()) {
            return PaymentStatus.PENDING;
        }

        return booking.getInvoice().getPayments().stream()
                .max(Comparator.comparing(Payment::getPaymentDate))
                .map(Payment::getStatus)
                .orElse(PaymentStatus.PENDING);
    }

    public long getPaymentSecondsRemaining(Booking booking) {
        if (booking == null || resolvePaymentStatus(booking) == PaymentStatus.SUCCESS) {
            return 0;
        }

        if (booking.getBookingDate() == null) {
            return PAYMENT_TIMEOUT_MINUTES * 60;
        }

        LocalDateTime expiresAt = booking.getBookingDate().plusMinutes(PAYMENT_TIMEOUT_MINUTES);
        long remaining = Duration.between(LocalDateTime.now(), expiresAt).getSeconds();
        return Math.max(0, remaining);
    }

    @Transactional
    public void requestCancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Kiểm tra logic: Chỉ cho hủy nếu tour chưa diễn ra hoặc logic nghiệp vụ của bạn
        if (booking.getStatus() == BookingStatus.PROCESSING || booking.getStatus() == BookingStatus.CONFIRMED) {
            booking.setStatus(BookingStatus.CANCELLATION_REQUESTED);
            bookingRepository.save(booking);
        } else {
            throw new IllegalStateException("Không thể yêu cầu hủy tour này");
        }
    }

    @Scheduled(fixedRate = 60000) // Chạy mỗi 60 giây (1 phút)
    @Transactional // Đảm bảo tính toàn vẹn dữ liệu khi xóa
    public void deleteExpiredBookings() {
        // Mốc thời gian là 3 phút trước so với hiện tại
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(PAYMENT_TIMEOUT_MINUTES);

        // Tìm các booking trạng thái PENDING (chưa thanh toán) và được tạo trước mốc 3 phút
        List<Booking> expiredBookings = bookingRepository.findByStatusAndBookingDateBefore(BookingStatus.PROCESSING, cutoffTime);

        if (!expiredBookings.isEmpty()) {
            bookingRepository.deleteAll(expiredBookings);
            System.out.println("Đã xóa " + expiredBookings.size() + " booking hết hạn thanh toán.");
        }
    }
}
