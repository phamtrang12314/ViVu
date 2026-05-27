package com.vivugo.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessageRequest {


    private String name;


    private String email;


    private String phone;


    private String subject;


    private String message;
}