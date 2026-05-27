// src/admin/screens/ContactMessageScreen/ContactMessageScreen.tsx

import React, { useState, useMemo } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Search, Mail, Phone, Calendar } from 'lucide-react'
import { contactAdminApi } from '../../apis/contactAdmin.api'
import { debounce } from 'lodash' // Import debounce từ lodash
import type { ContactMessageListParams } from '../../types/contactAdmin.type' // Import type for better type safety

// Helper để lấy ID an toàn
const getMessageId = (msg: any) => msg.contactMessId || msg.id || ''

// NEW HELPER: For date input formatting (copied from ManageBookingScreen.tsx logic)
const toDateInputValue = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// NEW: Initial date values
const today = new Date()
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
const initialFromDate = toDateInputValue(firstOfMonth)
const initialToDate = toDateInputValue(today)

// NEW TYPE: Extend params type locally (Backend API must also support these fields)
type ExtendedContactMessageListParams = ContactMessageListParams & {
  fromDate?: string
  toDate?: string
}

const ContactMessageScreen = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('') // State riêng cho input để gõ mượt hơn
  const [page, setPage] = useState(0)
  const [fromDate, setFromDate] = useState(initialFromDate) // NEW STATE
  const [toDate, setToDate] = useState(initialToDate) // NEW STATE
  const SIZE = 10

  const queryParams: ExtendedContactMessageListParams = useMemo(
    () => ({
      page,
      size: SIZE,
      search: searchTerm,
      fromDate, // NEW PARAM
      toDate // NEW PARAM
    }),
    [page, searchTerm, fromDate, toDate]
  )

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contact-messages', queryParams], // UPDATE queryKey
    queryFn: () =>
      contactAdminApi
        // Truyền thêm date params (cần đảm bảo backend API có thể nhận)
        .getAllMessages(
          queryParams as ContactMessageListParams & {
            fromDate?: string
            toDate?: string
          }
        )
        .then((res) => res.data),
    placeholderData: keepPreviousData
  })

  const messages = useMemo(() => {
    const list = data?.content || []
    // Sắp xếp ngược lại theo ID (giả định ID tăng dần) để tin nhắn mới nhất lên đầu
    // Dùng ID: getMessageId(b).localeCompare(getMessageId(a), ...)
    // Hoặc nếu muốn sắp xếp theo thời gian gửi (sentAt)
    return [...list].sort((a, b) => {
      // Sắp xếp theo sentAt (mới nhất lên đầu)
      const dateA = new Date(a.sentAt || 0).getTime()
      const dateB = new Date(b.sentAt || 0).getTime()
      return dateB - dateA
    })
  }, [data])

  const totalPages = data?.totalPages || 0

  // (GIỮ NGUYÊN) Sử dụng debounce của lodash để tối ưu việc gọi API
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchTerm(value)
      setPage(0)
    }, 500),
    []
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value) // Cập nhật UI ngay lập tức
    debouncedSearch(value) // Trì hoãn việc set searchTerm (gọi API)
  }

  // NEW FUNCTION: Handle date filter change
  const handleDateChange = (type: 'fromDate' | 'toDate', value: string) => {
    if (type === 'fromDate') {
      setFromDate(value)
    } else {
      setToDate(value)
    }
    setPage(0) // Reset page khi đổi filter
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tin nhắn liên hệ</h1>
        <p className="text-gray-500">Quản lý danh sách tin nhắn từ khách hàng</p>
      </div>

      {/* Search Bar + Date Filter (NEW BLOCK) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={inputValue} // Bind vào state inputValue
            placeholder="Tìm theo email, phone..."
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date Filter (NEW) */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700">Từ ngày</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => handleDateChange('fromDate', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700">Đến ngày</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => handleDateChange('toDate', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* REMOVE ID AND USER ID COLUMN */}
            <thead className="bg-gray-100 border-b border-gray-200 uppercase text-gray-600 text-xs font-bold">
              <tr>
                <th className="px-4 py-4 w-60">Liên hệ (Email/Phone)</th>
                <th className="px-4 py-4">Nội dung tin nhắn</th>
                <th className="px-4 py-4 w-48 whitespace-nowrap">Thời gian gửi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={3} // UPDATE COLSPAN
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td
                    colSpan={3} // UPDATE COLSPAN
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không có tin nhắn nào.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={getMessageId(msg) || Math.random()}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Email & Phone (Liên hệ) - Keep, integrate User Status */}
                    <td className="px-4 py-4 align-top w-60">
                      <div className="flex flex-col gap-1.5">
                        {/* User Type/Name */}

                        {/* Email */}
                        <div className="flex items-center gap-2 text-gray-700" title={msg.email}>
                          <Mail size={14} className="text-blue-500 flex-shrink-0" />
                          <span className="truncate max-w-[200px] text-xs">{msg.email}</span>
                        </div>
                        {/* Phone */}
                        <div className="flex items-center gap-2 text-gray-700 text-xs">
                          <Phone size={14} className="text-green-500 flex-shrink-0" />
                          <span>{msg.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Content - Keep */}
                    <td className="px-4 py-4 align-top">
                      <p className="text-gray-800 line-clamp-3 text-sm" title={msg.message}>
                        {msg.message}
                      </p>
                    </td>

                    {/* Date - Keep */}
                    <td className="px-4 py-4 align-top text-gray-500 w-48">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="flex-shrink-0" />
                        <span className="text-xs">
                          {msg.sentAt ? new Date(msg.sentAt).toLocaleString('vi-VN') : '-'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            ←
          </button>
          <span className="text-gray-700 font-medium">
            Trang {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

export default ContactMessageScreen

