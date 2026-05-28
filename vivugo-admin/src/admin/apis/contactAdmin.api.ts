import http from '../../utils/http'
import type {
  ContactMessageListParams,
  ContactMessageListResponse,
  SupportConversationListResponse,
  SupportMessage
} from '../types/contactAdmin.type'

const URL = '/admin/contact-messages'

export const contactAdminApi = {
  getAllMessages: (params: ContactMessageListParams) => {
    return http.get<ContactMessageListResponse>(URL, {
      params: {
        page: params.page,
        size: params.size,
        search: params.search || undefined
      }
    })
  },

  replyMessage: (messageId: string, message: string) => {
    return http.post<SupportMessage>(`${URL}/${messageId}/reply`, { message })
  },

  getConversations: (params: { page: number; size: number; search?: string }) => {
    return http.get<SupportConversationListResponse>(`${URL}/conversations`, { params })
  },

  getConversationMessages: (conversationId: string) => {
    return http.get<SupportMessage[]>(`${URL}/conversations/${conversationId}/messages`)
  },

  replyConversation: (conversationId: string, message: string) => {
    return http.post<SupportMessage>(`${URL}/conversations/${conversationId}/reply`, { message })
  }
}

