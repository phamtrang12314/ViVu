package com.vivugo.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class SeePayWebhookRequest {

    private Long id; // ID giao dịch trên hệ thống SePay

    private String gateway; // Cổng thanh toán (VD: MB, VCB)

    private String transactionDate; // Thời gian giao dịch

    private String accountNumber; // Số tài khoản nhận tiền

    private String content; // Nội dung chuyển khoản (QUAN TRỌNG: Chứa BookingID)

    private String transferType; // Loại giao dịch ("in" hoặc "out")

    private BigDecimal transferAmount; // Số tiền giao dịch

    private String referenceCode; // Mã tham chiếu ngân hàng
}