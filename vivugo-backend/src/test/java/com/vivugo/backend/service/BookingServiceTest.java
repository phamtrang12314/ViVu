package com.vivugo.backend.service;

import com.vivugo.backend.model.Booking;
import com.vivugo.backend.model.Invoice;
import com.vivugo.backend.model.Payment;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.User;
import com.vivugo.backend.model.enums.BookingStatus;
import com.vivugo.backend.model.enums.PaymentStatus;
import com.vivugo.backend.model.enums.RefundStatus;
import com.vivugo.backend.repository.BookingRepository;
import com.vivugo.backend.repository.InvoiceRepository;
import com.vivugo.backend.repository.PaymentRepository;
import com.vivugo.backend.repository.TourRepository;
import com.vivugo.backend.repository.UserRepository;
import com.vivugo.backend.realtime.RealtimePublisher;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class BookingServiceTest {

    private final TourRepository tourRepository = mock(TourRepository.class);
    private final BookingRepository bookingRepository = mock(BookingRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final PaymentRepository paymentRepository = mock(PaymentRepository.class);
    private final InvoiceRepository invoiceRepository = mock(InvoiceRepository.class);
    private final EmailService emailService = mock(EmailService.class);
    private final RealtimePublisher realtimePublisher = mock(RealtimePublisher.class);
    private final BookingService service = new BookingService(
            tourRepository,
            bookingRepository,
            userRepository,
            paymentRepository,
            invoiceRepository,
            emailService,
            realtimePublisher
    );

    @Test
    void resolvePaymentStatusUsesLatestPaymentDate() {
        Booking booking = bookingWithPayments(
                payment(PaymentStatus.SUCCESS, LocalDateTime.now().minusDays(1)),
                payment(PaymentStatus.PENDING, LocalDateTime.now())
        );

        assertEquals(PaymentStatus.PENDING, service.resolvePaymentStatus(booking));
    }

    @Test
    void paymentTimeoutReturnsZeroForExpiredUnpaidBooking() {
        Booking booking = new Booking();
        booking.setBookingDate(LocalDateTime.now().minusMinutes(31));

        assertEquals(0, service.getPaymentSecondsRemaining(booking));
    }

    @Test
    void refundIsFullWithinOneHourAfterPayment() {
        Booking booking = paidBooking(LocalDateTime.now().minusMinutes(30), LocalDate.now().plusDays(1));

        assertEquals(100, service.calculateRefundPercent(booking));
    }

    @Test
    void refundIsUnavailableWithinFourHoursBeforeDeparture() {
        Booking booking = paidBooking(LocalDateTime.now().minusDays(2), LocalDate.now());

        assertEquals(0, service.calculateRefundPercent(booking));
    }

    @Test
    void processPaymentWebhookConfirmsBookingAndSavesPayment() {
        Booking booking = unpaidBooking("tbbk-45915d45-c4ec-4f98-abcd-123456789abc", 200000d);
        when(bookingRepository.findById(booking.getBookingID())).thenReturn(Optional.of(booking));
        when(paymentRepository.existsByTransactionCode("FT123")).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.processPaymentWebhook(booking.getBookingID(), new BigDecimal("200000"), "FT123");

        assertEquals(BookingStatus.CONFIRMED, booking.getStatus());
        ArgumentCaptor<Payment> paymentCaptor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(paymentCaptor.capture());
        Payment savedPayment = paymentCaptor.getValue();
        assertEquals(PaymentStatus.SUCCESS, savedPayment.getStatus());
        assertEquals(200000d, savedPayment.getAmountPaid());
        assertEquals("BANK_TRANSFER_QR", savedPayment.getPaymentMethod());
        assertEquals("FT123", savedPayment.getTransactionCode());
        verify(emailService).sendPaymentSuccessEmail(any(EmailService.PaymentSuccessEmailData.class));
    }

    @Test
    void processPaymentWebhookRejectsUnderpayment() {
        Booking booking = unpaidBooking("tbbk-45915d45-c4ec-4f98-abcd-123456789abc", 200000d);
        when(bookingRepository.findById(booking.getBookingID())).thenReturn(Optional.of(booking));

        assertThrows(
                IllegalArgumentException.class,
                () -> service.processPaymentWebhook(booking.getBookingID(), new BigDecimal("199999"), "FT123")
        );
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void processPaymentWebhookIgnoresDuplicateTransaction() {
        Booking booking = unpaidBooking("tbbk-45915d45-c4ec-4f98-abcd-123456789abc", 200000d);
        when(bookingRepository.findById(booking.getBookingID())).thenReturn(Optional.of(booking));
        when(paymentRepository.existsByTransactionCode("FT123")).thenReturn(true);

        service.processPaymentWebhook(booking.getBookingID(), new BigDecimal("200000"), "FT123");

        assertEquals(BookingStatus.PROCESSING, booking.getStatus());
        verify(paymentRepository, never()).save(any(Payment.class));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void requestCancelBookingCancelsUnpaidBookingImmediately() {
        Booking booking = unpaidBooking("booking-1", 100000d);
        when(bookingRepository.findById("booking-1")).thenReturn(Optional.of(booking));

        service.requestCancelBooking("booking-1", "Doi lich trinh");

        assertEquals(BookingStatus.CANCELED, booking.getStatus());
        verify(bookingRepository).save(booking);
    }

    @Test
    void requestCancelBookingCreatesRefundRequestForPaidBooking() {
        Booking booking = paidBooking(LocalDateTime.now().minusHours(2), LocalDate.now().plusDays(2));
        booking.setBookingID("booking-1");
        booking.setStatus(BookingStatus.CONFIRMED);
        when(bookingRepository.findById("booking-1")).thenReturn(Optional.of(booking));

        service.requestCancelBooking("booking-1", "Khong sap xep duoc thoi gian");

        assertEquals(BookingStatus.CANCELLATION_REQUESTED, booking.getStatus());
        assertEquals(RefundStatus.PENDING, booking.getRefundStatus());
        verify(bookingRepository).save(booking);
    }

    @Test
    void requestCancelBookingRejectsShortReason() {
        Booking booking = unpaidBooking("booking-1", 100000d);
        when(bookingRepository.findById("booking-1")).thenReturn(Optional.of(booking));

        assertThrows(IllegalStateException.class, () -> service.requestCancelBooking("booking-1", "abc"));
        verifyNoInteractions(paymentRepository);
    }

    @Test
    void deleteExpiredBookingsCancelsOnlyUnpaidProcessingBookings() {
        Booking unpaid = unpaidBooking("unpaid", 100000d);
        Booking paid = paidBooking(LocalDateTime.now().minusMinutes(40), LocalDate.now().plusDays(1));
        paid.setBookingID("paid");
        paid.setStatus(BookingStatus.PROCESSING);
        when(bookingRepository.findByStatusAndBookingDateBefore(any(BookingStatus.class), any(LocalDateTime.class)))
                .thenReturn(List.of(unpaid, paid));

        service.deleteExpiredBookings();

        assertEquals(BookingStatus.CANCELED, unpaid.getStatus());
        assertEquals(BookingStatus.PROCESSING, paid.getStatus());
        ArgumentCaptor<List<Booking>> captor = ArgumentCaptor.forClass(List.class);
        verify(bookingRepository).saveAll(captor.capture());
        assertEquals(List.of(unpaid), captor.getValue());
    }

    private Booking unpaidBooking(String id, double finalAmount) {
        Booking booking = new Booking();
        booking.setBookingID(id);
        booking.setStatus(BookingStatus.PROCESSING);
        booking.setFinalAmount(finalAmount);
        booking.setBookingDate(LocalDateTime.now().minusMinutes(5));
        booking.setUser(user());
        booking.setTour(tour(LocalDate.now().plusDays(2)));

        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setPayments(new HashSet<>());
        booking.setInvoice(invoice);
        return booking;
    }

    private Booking paidBooking(LocalDateTime paidAt, LocalDate startDate) {
        Booking booking = unpaidBooking("booking-paid", 300000d);
        booking.setInvoice(invoiceWithPayments(payment(PaymentStatus.SUCCESS, paidAt)));
        booking.setTour(tour(startDate));
        return booking;
    }

    private Booking bookingWithPayments(Payment... payments) {
        Booking booking = new Booking();
        booking.setInvoice(invoiceWithPayments(payments));
        return booking;
    }

    private Invoice invoiceWithPayments(Payment... payments) {
        Invoice invoice = new Invoice();
        invoice.setPayments(Set.of(payments));
        return invoice;
    }

    private Payment payment(PaymentStatus status, LocalDateTime paymentDate) {
        Payment payment = new Payment();
        payment.setStatus(status);
        payment.setPaymentDate(paymentDate);
        return payment;
    }

    private User user() {
        User user = new User();
        user.setEmail("customer@example.com");
        user.setName("Customer");
        return user;
    }

    private Tour tour(LocalDate startDate) {
        Tour tour = new Tour();
        tour.setTitle("Ha Noi Tour");
        tour.setStartDate(startDate);
        return tour;
    }
}
