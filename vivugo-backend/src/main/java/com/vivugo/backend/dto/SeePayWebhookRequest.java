package com.vivugo.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class SeePayWebhookRequest {

    private Long id;

    private String gateway;

    @JsonAlias("transaction_date")
    private String transactionDate;

    @JsonAlias("account_number")
    private String accountNumber;

    @JsonAlias("sub_account")
    private String subAccount;

    private String code;

    private String content;

    @JsonAlias("transfer_type")
    private String transferType;

    @JsonAlias({"transfer_amount", "amountIn", "amount_in"})
    private BigDecimal transferAmount;

    @JsonAlias("reference_code")
    private String referenceCode;

    private String description;
}
