import http from '../utils/http'

export interface ContactMessagePayload {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface ContactSuccessResponse {
  message: string
  contactMessId: string
  conversationId?: string | null
}

export interface SupportChatStartPayload {
  conversationId?: string
  name?: string
  email?: string
  phone?: string
  message?: string
}

export interface SupportConversation {
  conversationId: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  replied: boolean
  lastMessageAt?: string | null
  lastMessagePreview?: string | null
}

export interface SupportMessage {
  messageId: string
  conversationId: string
  senderType: 'CUSTOMER' | 'ADMIN'
  senderName: string
  content: string
  createdAt: string
}

const URL = 'contact-messages'

export const contactApi = {
  submitMessage: (body: ContactMessagePayload) => {
    return http.post<ContactSuccessResponse>(URL, body)
  },

  startSupportChat: (body: SupportChatStartPayload) => {
    return http.post<SupportConversation>(`${URL}/chat/start`, body)
  },

  getSupportMessages: (conversationId: string) => {
    return http.get<SupportMessage[]>(`${URL}/chat/${conversationId}/messages`)
  },

  sendSupportMessage: (conversationId: string, message: string) => {
    return http.post<SupportMessage>(`${URL}/chat/${conversationId}/messages`, { message })
  }
}

