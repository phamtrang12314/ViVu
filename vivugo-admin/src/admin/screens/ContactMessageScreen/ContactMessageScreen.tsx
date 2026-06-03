import { useMemo, useState } from 'react'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Calendar, Mail, MessageSquareReply, MoreVertical, Phone, Search, Send, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { contactAdminApi } from '../../apis/contactAdmin.api'
import type { ContactMessage, ContactMessageListParams, SupportConversation, SupportMessage } from '../../types/contactAdmin.type'
import { resolveAssetUrl } from '../../../utils/utils'

const MIN_ITEMS_PER_SECTION = 5
const PAGE_SIZE = 10

const getMessageId = (message: ContactMessage) => message.contactMessId || message.id

const formatDate = (value?: string | null) => {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleDateString('vi-VN')
}

const formatTime = (value?: string | null) => {
  if (!value) return '--:--'
  const date = new Date(value)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const hasZaloIntent = (message: ContactMessage) => {
  const blob = `${message.subject || ''} ${message.message || ''} ${message.email || ''}`.toLowerCase()
  return blob.includes('zalo')
}

const withMinimumItems = <T,>(items: T[], minCount: number): T[] => {
  if (items.length === 0) return []
  if (items.length >= minCount) return items

  const cloned = [...items]
  let index = 0
  while (cloned.length < minCount) {
    cloned.push(items[index % items.length])
    index += 1
  }
  return cloned
}

const initialsFromName = (value?: string) => {
  if (!value) return 'KH'
  const words = value.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0] || ''}${words[words.length - 1][0] || ''}`.toUpperCase()
}

const buildAvatarUrl = (name?: string) => {
  const safeName = (name || 'Khách hàng').trim()
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=e5edff&color=1d4ed8&size=128&bold=true`
}

export default function ContactMessageScreen() {
  const [searchTerm, setSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [page, setPage] = useState(0)
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [messageStatusFilter, setMessageStatusFilter] = useState<'ALL' | 'WAITING' | 'RESPONDED'>('ALL')
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [conversationReply, setConversationReply] = useState('')

  const queryParams: ContactMessageListParams = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      search: searchTerm || undefined
    }),
    [page, searchTerm]
  )

  const { data, refetch } = useQuery({
    queryKey: ['admin-contact-messages', queryParams],
    queryFn: () => contactAdminApi.getAllMessages(queryParams).then((res) => res.data),
    placeholderData: keepPreviousData,
    refetchInterval: 5000
  })

  const { data: conversationsData, isLoading: isConversationsLoading, refetch: refetchConversations } = useQuery({
    queryKey: ['admin-support-conversations', page, searchTerm],
    queryFn: () =>
      contactAdminApi
        .getConversations({ page, size: PAGE_SIZE, search: searchTerm || undefined })
        .then((res) => res.data),
    refetchInterval: 5000
  })

  const { data: conversationMessages, refetch: refetchConversationMessages } = useQuery({
    queryKey: ['admin-support-conversation-messages', activeConversationId],
    queryFn: () => contactAdminApi.getConversationMessages(activeConversationId as string).then((res) => res.data),
    enabled: Boolean(activeConversationId),
    refetchInterval: activeConversationId ? 3000 : false
  })

  const replyConversationMutation = useMutation({
    mutationFn: (payload: { conversationId: string; message: string }) =>
      contactAdminApi.replyConversation(payload.conversationId, payload.message),
    onSuccess: async () => {
      toast.success('Đã gửi phản hồi hội thoại')
      setConversationReply('')
      setReplyingMessageId(null)
      await Promise.all([refetchConversations(), refetchConversationMessages(), refetch()])
    },
    onError: () => toast.error('Không gửi được phản hồi hội thoại')
  })

  const rawMessages: ContactMessage[] = data?.content || []
  const activeMessages: SupportMessage[] = conversationMessages || []

  const summary = useMemo(() => {
    const total = rawMessages.length
    const responded = rawMessages.filter((item) => item.responded).length
    const waiting = total - responded
    return { total, responded, waiting }
  }, [rawMessages])

  const conversationRows = useMemo(() => {
    const base: SupportConversation[] = conversationsData?.content || []
    if (messageStatusFilter === 'WAITING') return base.filter((item) => !item.replied)
    if (messageStatusFilter === 'RESPONDED') return base.filter((item) => item.replied)
    return base
  }, [conversationsData?.content, messageStatusFilter])

  const phoneContacts = useMemo(() => {
    const base = rawMessages.filter((item) => (item.phone || '').trim().length > 0)
    return withMinimumItems(base, MIN_ITEMS_PER_SECTION).slice(0, Math.max(MIN_ITEMS_PER_SECTION, base.length))
  }, [rawMessages])

  const zaloContacts = useMemo(() => {
    const direct = rawMessages.filter(hasZaloIntent)
    const fallback = rawMessages.filter((item) => (item.phone || '').trim().length > 0)
    const source = direct.length > 0 ? direct : fallback
    return withMinimumItems(source, MIN_ITEMS_PER_SECTION).slice(0, Math.max(MIN_ITEMS_PER_SECTION, source.length))
  }, [rawMessages])

  const activeConversation = useMemo(
    () => (conversationsData?.content || []).find((item) => item.conversationId === activeConversationId) || null,
    [conversationsData?.content, activeConversationId]
  )

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Tin nhắn liên hệ</h1>
        <p className='text-gray-500'>Khu trung tâm là hội thoại hỗ trợ và xử lý phản hồi khách hàng.</p>
      </div>

      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
        <button
          onClick={() => setMessageStatusFilter('ALL')}
          className={`rounded-2xl border bg-white px-4 py-3 text-left shadow-sm ${
            messageStatusFilter === 'ALL' ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'
          }`}
        >
          <div className='text-2xl font-black text-slate-900'>{summary.total}</div>
          <div className='text-xs text-gray-500'>Tổng tin nhắn</div>
        </button>
        <button
          onClick={() => setMessageStatusFilter('WAITING')}
          className={`rounded-2xl border bg-white px-4 py-3 text-left shadow-sm ${
            messageStatusFilter === 'WAITING' ? 'border-red-300 ring-2 ring-red-100' : 'border-red-100'
          }`}
        >
          <div className='text-2xl font-black text-red-600'>{summary.waiting}</div>
          <div className='text-xs text-gray-500'>Chờ phản hồi</div>
        </button>
        <button
          onClick={() => setMessageStatusFilter('RESPONDED')}
          className={`rounded-2xl border bg-white px-4 py-3 text-left shadow-sm ${
            messageStatusFilter === 'RESPONDED' ? 'border-green-300 ring-2 ring-green-100' : 'border-green-100'
          }`}
        >
          <div className='text-2xl font-black text-green-600'>{summary.responded}</div>
          <div className='text-xs text-gray-500'>Đã phản hồi</div>
        </button>
      </div>

      <div className='mb-6 rounded-lg bg-white p-4 shadow-sm'>
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
          <input
            value={inputValue}
            onChange={(event) => {
              const value = event.target.value
              setInputValue(value)
              setSearchTerm(value.trim())
              setPage(0)
            }}
            className='w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-400'
            placeholder='Tìm theo email, số điện thoại, nội dung...'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-5 xl:grid-cols-12'>
        <div className='relative xl:col-span-9'>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
            <div className='border-b border-gray-200 px-4 py-3'>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex items-center gap-2'>
                  <select
                    value={messageStatusFilter}
                    onChange={(event) => setMessageStatusFilter(event.target.value as 'ALL' | 'WAITING' | 'RESPONDED')}
                    className='h-9 rounded-md border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-200'
                  >
                    <option value='ALL'>Tất cả trạng thái</option>
                    <option value='WAITING'>Chờ phản hồi</option>
                    <option value='RESPONDED'>Đã phản hồi</option>
                  </select>
                </div>
                <div className='relative w-full lg:max-w-md'>
                  <Search className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={16} />
                  <input
                    value={inputValue}
                    onChange={(event) => {
                      const value = event.target.value
                      setInputValue(value)
                      setSearchTerm(value.trim())
                      setPage(0)
                    }}
                    className='h-9 w-full rounded-md border border-gray-200 py-1 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-200'
                    placeholder='Tìm theo tên, email, nội dung...'
                  />
                </div>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead className='border-b border-gray-200 bg-gray-100 text-xs font-bold uppercase text-gray-600'>
                  <tr>
                    <th className='px-4 py-3'>Khách hàng</th>
                    <th className='px-4 py-3'>Nội dung</th>
                    <th className='px-4 py-3'>Thời gian</th>
                    <th className='px-4 py-3 text-center'>Trạng thái</th>
                    <th className='px-4 py-3 text-center'>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isConversationsLoading ? (
                    <tr>
                      <td colSpan={5} className='px-6 py-8 text-center text-gray-500'>
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : conversationRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className='px-6 py-8 text-center text-gray-500'>
                        Chưa có hội thoại chat trực tiếp từ khách hàng.
                      </td>
                    </tr>
                  ) : (
                    conversationRows.map((conversation) => {
                      const avatar = resolveAssetUrl(conversation.avatarURL ?? undefined, buildAvatarUrl(conversation.customerName))
                      return (
                        <tr key={conversation.conversationId} className='border-b border-gray-100 align-top hover:bg-gray-50'>
                          <td className='px-4 py-4'>
                            <div className='flex items-start gap-3'>
                              <img
                                src={avatar}
                                alt={conversation.customerName || 'Khách hàng'}
                                className='h-9 w-9 shrink-0 rounded-full border border-blue-100 object-cover'
                              />
                              <div className='space-y-1 text-xs text-gray-600'>
                                <div className='text-sm font-semibold text-gray-900'>{conversation.customerName || 'Khách hàng'}</div>
                                <div className='flex items-center gap-1'>
                                  <Mail size={13} className='text-blue-500' />
                                  <span>{conversation.customerEmail || '-'}</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                  <Phone size={13} className='text-green-500' />
                                  <span>{conversation.customerPhone || '-'}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-4'>
                            <p className='line-clamp-2 text-sm text-gray-800'>{conversation.lastMessagePreview || '-'}</p>
                            <p className='mt-1 text-xs font-semibold text-blue-600'>Chat trực tiếp qua page</p>
                          </td>
                          <td className='px-4 py-4 text-xs text-gray-500'>
                            <div className='flex items-center gap-1'>
                              <Calendar size={14} />
                              <span>{formatTime(conversation.lastMessageAt)}</span>
                            </div>
                            <div className='mt-1'>{formatDate(conversation.lastMessageAt)}</div>
                          </td>
                          <td className='px-4 py-4 text-center'>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                conversation.replied ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {conversation.replied ? 'Đã phản hồi' : 'Chờ phản hồi'}
                            </span>
                          </td>
                          <td className='px-4 py-4'>
                            <div className='flex items-center justify-center gap-1'>
                              <button
                                onClick={() => setActiveConversationId(conversation.conversationId)}
                                className='inline-flex items-center gap-1 rounded-md border border-blue-200 px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50'
                              >
                                <MessageSquareReply size={13} />
                                Mở hội thoại
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingMessageId(conversation.conversationId)
                                  setReplyDraft(`Chào ${conversation.customerName || 'bạn'}, ViVuGo đã nhận được tin nhắn của bạn và đang hỗ trợ ngay.`)
                                }}
                                className='inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100'
                                aria-label='Phản hồi nhanh'
                              >
                                <MoreVertical size={14} />
                              </button>
                            </div>
                            {replyingMessageId === conversation.conversationId && (
                              <div className='mx-auto mt-2 w-[280px] rounded-md border border-gray-200 bg-white p-2 text-left shadow-sm'>
                                <textarea
                                  rows={4}
                                  value={replyDraft}
                                  onChange={(event) => setReplyDraft(event.target.value)}
                                  className='w-full rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-400'
                                />
                                <div className='mt-2 flex justify-end gap-2'>
                                  <button
                                    onClick={() => {
                                      setReplyingMessageId(null)
                                      setReplyDraft('')
                                    }}
                                    className='rounded border border-gray-300 px-2 py-1 text-xs text-gray-600'
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    disabled={!replyDraft.trim() || replyConversationMutation.isPending}
                                    onClick={() =>
                                      replyConversationMutation.mutate({
                                        conversationId: conversation.conversationId,
                                        message: replyDraft.trim()
                                      })
                                    }
                                    className='rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white disabled:bg-gray-300'
                                  >
                                    Gửi
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {(conversationsData?.totalPages || 0) > 1 && (
              <div className='flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm'>
                <span className='text-gray-500'>Trang {page + 1} / {conversationsData?.totalPages || 1}</span>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                    disabled={page === 0}
                    className='rounded border px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40'
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setPage((prev) => Math.min((conversationsData?.totalPages || 1) - 1, prev + 1))}
                    disabled={page >= (conversationsData?.totalPages || 1) - 1}
                    className='rounded border px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40'
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeConversationId && (
            <div className='fixed inset-x-4 bottom-4 z-[70] rounded-xl border border-gray-200 bg-white shadow-2xl xl:inset-x-auto xl:bottom-auto xl:right-[18%] xl:top-1/2 xl:w-[420px] xl:-translate-y-1/2'>
              <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3'>
                <div>
                  <p className='text-sm font-bold text-slate-900'>{activeConversation?.customerName || 'Hội thoại hỗ trợ'}</p>
                  <p className='text-xs text-emerald-600'>Đang hoạt động</p>
                </div>
                <button
                  onClick={() => setActiveConversationId(null)}
                  className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100'
                  aria-label='Đóng hội thoại'
                >
                  <X size={14} />
                </button>
              </div>

              <div className='h-[340px] space-y-2 overflow-y-auto bg-gray-50 p-3'>
                {activeMessages.length === 0 ? (
                  <p className='text-sm text-gray-500'>Chưa có tin nhắn trong hội thoại này.</p>
                ) : (
                  activeMessages.map((item) => (
                    <div key={item.messageId} className={`flex ${item.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[88%] rounded-xl px-3 py-2 text-xs ${
                          item.senderType === 'ADMIN'
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 bg-white text-gray-800'
                        }`}
                      >
                        <p className='font-semibold'>{item.senderName}</p>
                        <p className='mt-1 whitespace-pre-wrap'>{item.content}</p>
                        <p className={`mt-1 text-[11px] ${item.senderType === 'ADMIN' ? 'text-blue-100' : 'text-gray-400'}`}>
                          {formatTime(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className='border-t border-gray-200 p-3'>
                <div className='flex items-center gap-2'>
                  <input
                    value={conversationReply}
                    onChange={(event) => setConversationReply(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && conversationReply.trim() && !replyConversationMutation.isPending) {
                        replyConversationMutation.mutate({
                          conversationId: activeConversationId,
                          message: conversationReply.trim()
                        })
                      }
                    }}
                    placeholder='Nhập tin nhắn...'
                    className='h-9 flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-400'
                  />
                  <button
                    disabled={!conversationReply.trim() || replyConversationMutation.isPending}
                    onClick={() =>
                      replyConversationMutation.mutate({
                        conversationId: activeConversationId,
                        message: conversationReply.trim()
                      })
                    }
                    className='inline-flex h-9 items-center gap-1 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white disabled:bg-gray-300'
                  >
                    <Send size={14} />
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='space-y-4 xl:col-span-3'>
          <div className='rounded-xl border border-gray-200 bg-white shadow-sm'>
            <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3'>
              <h2 className='text-base font-bold text-slate-900'>Khách liên hệ qua Zalo</h2>
              <span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700'>{zaloContacts.length}</span>
            </div>
            <div className='space-y-1 p-2'>
              {zaloContacts.slice(0, 8).map((item, index) => (
                <button
                  key={`${getMessageId(item)}-zalo-${index}`}
                  onClick={() => item.conversationId && setActiveConversationId(item.conversationId)}
                  className='flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-gray-50'
                >
                  <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700'>
                    {initialsFromName(item.name)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-gray-900'>{item.name || 'Khách hàng'}</p>
                    <p className='truncate text-xs text-gray-500'>{item.message}</p>
                  </div>
                  <div className='flex flex-col items-end gap-1'>
                    <span className='text-[11px] text-gray-400'>{formatTime(item.sentAt)}</span>
                    {!item.responded && <span className='h-4 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] text-white'>1</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white shadow-sm'>
            <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3'>
              <h2 className='text-base font-bold text-slate-900'>Khách liên hệ qua SĐT</h2>
              <span className='rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700'>{phoneContacts.length}</span>
            </div>
            <div className='space-y-1 p-2'>
              {phoneContacts.slice(0, 8).map((item, index) => (
                <button
                  key={`${getMessageId(item)}-phone-${index}`}
                  onClick={() => item.conversationId && setActiveConversationId(item.conversationId)}
                  className='flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-gray-50'
                >
                  <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700'>
                    {initialsFromName(item.name)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-gray-900'>{item.phone || '-'}</p>
                    <p className='truncate text-xs text-gray-500'>{item.message}</p>
                  </div>
                  <div className='flex flex-col items-end gap-1'>
                    <span className='text-[11px] text-gray-400'>{formatTime(item.sentAt)}</span>
                    {!item.responded && <span className='h-4 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] text-white'>1</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
