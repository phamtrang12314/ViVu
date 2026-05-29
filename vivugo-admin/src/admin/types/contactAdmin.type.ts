// src/admin/types/contactAdmin.type.ts

export type ContactMessage = {
  contactMessId: string; // Map từ database: contact_messid
  email: string;         // Map từ database: email
  message: string;       // Map từ database: message
  phone: string;         // Map từ database: phone
  sentAt: string;        // Map từ database: sent_at
  userId: string | null; // Map từ database: user_id (có thể null)
};

export type ContactMessageListParams = {
  page: number;
  size: number;
  search?: string;
};

export type ContactMessageListResponse = {
  content: ContactMessage[];
  totalPages: number;
  number: number;
  totalElements: number;
};
