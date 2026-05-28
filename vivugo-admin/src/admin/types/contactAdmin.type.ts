export type ContactMessage = {
  id: string
  contactMessId?: string
  name?: string
  email: string
  message: string
  phone: string
  sentAt: string
  subject?: string | null
  userID?: string | null
  userName?: string | null
  responded?: boolean
  respondedAt?: string | null
  respondedBy?: string | null
  conversationId?: string | null
}

export type ContactMessageListParams = {
  page: number
  size: number
  search?: string
  fromDate?: string
  toDate?: string
}

export type ContactMessageListResponse = {
  content: ContactMessage[]
  totalPages: number
  number: number
  totalElements: number
}

export type SupportConversation = {
  conversationId: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  avatarURL?: string | null
  replied: boolean
  lastMessageAt?: string | null
  lastMessagePreview?: string | null
}

export type SupportConversationListResponse = {
  content: SupportConversation[]
  totalPages: number
  number: number
  totalElements: number
}

export type SupportMessage = {
  messageId: string
  conversationId: string
  senderType: 'CUSTOMER' | 'ADMIN'
  senderName: string
  content: string
  createdAt: string
}
