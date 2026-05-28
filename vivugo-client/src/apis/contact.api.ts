// src/apis/contact.api.ts

import http from "../utils/http";

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone: string;
  subject: string; // Chủ đề từ select box
  message: string;
}

export interface ContactSuccessResponse {
  message: string;
  contactMessId: string;
}

const URL = "contact-messages"; // Endpoint công khai: /api/contact-messages

export const contactApi = {
  /**
   * Gửi tin nhắn liên hệ từ khách hàng lên server
   */
  submitMessage: (body: ContactMessagePayload) => {
    return http.post<ContactSuccessResponse>(URL, body);
  },
};

