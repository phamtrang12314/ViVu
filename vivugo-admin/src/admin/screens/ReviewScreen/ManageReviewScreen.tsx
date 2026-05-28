/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState } from 'react'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Calendar, Eye, EyeOff, MessageSquareReply, Star } from 'lucide-react'
import { toast } from 'react-toastify'
import { reviewAdminApi } from '../../apis/reviewAdmin.api'
import type { ReviewAdmin, ReviewAdminListParams, ReviewStatus } from '../../types/reviewAdmin.type'

const STATUS_LABELS: Record<ReviewStatus, string> = {
  PENDING: 'Chờ xử lý',
  APPROVED: 'Hiển thị',
  HIDDEN: 'Đã ẩn'
}

const STATUS_COLORS: Record<ReviewStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  HIDDEN: 'bg-red-100 text-red-700'
}

const buildSuggestedReply = (rating: number) => {
  if (rating >= 5) {
    return 'ViVuGo cảm ơn bạn đã đánh giá 5 sao. Đội ngũ rất vui vì bạn hài lòng với trải nghiệm chuyến đi.'
  }
  if (rating <= 2) {
    return 'ViVuGo xin lỗi vì trải nghiệm chưa như mong đợi. Bạn giúp bên mình thêm chi tiết để đội hỗ trợ liên hệ cải thiện ngay.'
  }
  return 'Cảm ơn bạn đã gửi đánh giá. ViVuGo đã ghi nhận góp ý và sẽ tiếp tục nâng cấp chất lượng dịch vụ.'
}

export default function ManageReviewScreen() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(0)
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')
  const size = 10

  const queryParams: ReviewAdminListParams = {
    page,
    size,
    status: statusFilter === 'ALL' ? undefined : statusFilter
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-reviews', queryParams],
    queryFn: () => reviewAdminApi.getAll(queryParams).then((res) => res.data),
    placeholderData: keepPreviousData
  })

  const toggleStatusMutation = useMutation({
    mutationFn: (payload: { id: string; nextStatus: ReviewStatus }) =>
      reviewAdminApi.updateStatus(payload.id, payload.nextStatus),
    onSuccess: async () => {
      toast.success('Cập nhật trạng thái review thành công')
      await refetch()
    },
    onError: () => {
      toast.error('Lỗi cập nhật trạng thái')
    }
  })

  const replyMutation = useMutation({
    mutationFn: (payload: { reviewId: string; reply: string }) =>
      reviewAdminApi.reply(payload.reviewId, payload.reply),
    onSuccess: async () => {
      toast.success('Đã phản hồi đánh giá')
      setReplyingReviewId(null)
      setReplyDraft('')
      await refetch()
    },
    onError: () => {
      toast.error('Không gửi được phản hồi')
    }
  })

  const reviews: ReviewAdmin[] = data?.content || []
  const totalPages = data?.totalPages || 0
  const currentPage = data?.number || 0

  const summary = useMemo(() => {
    const byStatus = {
      all: reviews.length,
      pending: reviews.filter((item) => item.status === 'PENDING').length,
      approved: reviews.filter((item) => item.status === 'APPROVED').length,
      hidden: reviews.filter((item) => item.status === 'HIDDEN').length
    }
    return byStatus
  }, [reviews])

  const handleChangeStatus = (review: ReviewAdmin) => {
    const nextStatus: ReviewStatus = review.status === 'APPROVED' ? 'HIDDEN' : 'APPROVED'
    toggleStatusMutation.mutate({ id: review.reviewID, nextStatus })
  }

  const openReplyBox = (review: ReviewAdmin) => {
    setReplyingReviewId(review.reviewID)
    setReplyDraft(review.adminReply || buildSuggestedReply(review.rating))
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Quản lý đánh giá</h1>
          <p className='mt-1 text-sm text-gray-500'>Theo dõi review và phản hồi trực tiếp từ admin.</p>
        </div>
      </div>

      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
        <button
          onClick={() => {
            setStatusFilter('ALL')
            setPage(0)
          }}
          className={`rounded-2xl border bg-white px-5 py-4 text-left shadow-sm ${statusFilter === 'ALL' ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'}`}
        >
          <div className='text-2xl font-black text-slate-900'>{summary.all}</div>
          <div className='text-xs text-gray-500'>Tổng review</div>
        </button>
        <button
          onClick={() => {
            setStatusFilter('PENDING')
            setPage(0)
          }}
          className={`rounded-2xl border bg-white px-5 py-4 text-left shadow-sm ${statusFilter === 'PENDING' ? 'border-yellow-300 ring-2 ring-yellow-100' : 'border-gray-100'}`}
        >
          <div className='text-2xl font-black text-yellow-600'>{summary.pending}</div>
          <div className='text-xs text-gray-500'>Chờ xử lý</div>
        </button>
        <button
          onClick={() => {
            setStatusFilter('APPROVED')
            setPage(0)
          }}
          className={`rounded-2xl border bg-white px-5 py-4 text-left shadow-sm ${statusFilter === 'APPROVED' ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-100'}`}
        >
          <div className='text-2xl font-black text-green-600'>{summary.approved}</div>
          <div className='text-xs text-gray-500'>Hiển thị</div>
        </button>
        <button
          onClick={() => {
            setStatusFilter('HIDDEN')
            setPage(0)
          }}
          className={`rounded-2xl border bg-white px-5 py-4 text-left shadow-sm ${statusFilter === 'HIDDEN' ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-100'}`}
        >
          <div className='text-2xl font-black text-red-600'>{summary.hidden}</div>
          <div className='text-xs text-gray-500'>Đã ẩn</div>
        </button>
      </div>

      <div className='mb-6 flex items-center gap-3 rounded-xl bg-white p-5 shadow-md'>
        <span className='text-sm text-gray-600'>Trạng thái:</span>
        <select
          className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as ReviewStatus | 'ALL')
            setPage(0)
          }}
        >
          <option value='ALL'>Tất cả</option>
          <option value='APPROVED'>Hiển thị</option>
          <option value='HIDDEN'>Đã ẩn</option>
          <option value='PENDING'>Chờ xử lý</option>
        </select>
      </div>

      <div className='overflow-hidden rounded-2xl bg-white shadow-xl'>
        <table className='w-full border-collapse text-left'>
          <thead className='border-b border-gray-200 bg-gray-200 text-xs uppercase text-gray-600'>
            <tr>
              <th className='px-5 py-3 font-bold text-black'>Tour</th>
              <th className='px-5 py-3 font-bold text-black'>Khách hàng</th>
              <th className='px-5 py-3 text-center font-bold text-black'>Đánh giá</th>
              <th className='px-5 py-3 font-bold text-black'>Nội dung</th>
              <th className='px-5 py-3 text-center font-bold text-black'>Trạng thái</th>
              <th className='px-5 py-3 text-center font-bold text-black'>Thời gian</th>
              <th className='px-5 py-3 text-center font-bold text-black'>Thao tác</th>
            </tr>
          </thead>
          <tbody className='text-gray-800'>
            {isLoading ? (
              <tr>
                <td colSpan={7} className='py-8 text-center text-gray-500'>
                  Đang tải dữ liệu đánh giá...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className='py-8 text-center text-gray-500'>
                  Không có đánh giá nào phù hợp.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.reviewID} className='border-b border-gray-100 hover:bg-gray-50'>
                  <td className='px-5 py-4 align-top'>
                    <p className='text-sm font-semibold text-gray-900'>{review.tourTitle || 'N/A'}</p>
                    <p className='text-xs text-gray-500'>ID: {review.reviewID}</p>
                  </td>
                  <td className='px-5 py-4 align-top text-sm'>
                    <p className='font-medium text-gray-900'>{review.userName || 'Khách'}</p>
                    <p className='text-xs text-gray-500'>{review.userEmail || '-'}</p>
                  </td>
                  <td className='px-5 py-4 text-center align-top'>
                    <div className='inline-flex items-center gap-1'>
                      <Star className='h-4 w-4 text-yellow-500' />
                      <span className='text-sm font-semibold'>{review.rating}/5</span>
                    </div>
                  </td>
                  <td className='max-w-xs px-5 py-4 align-top text-sm'>
                    <p className='line-clamp-3'>{review.comment}</p>
                    {review.adminReply && (
                      <div className='mt-2 rounded-lg border border-blue-100 bg-blue-50 p-2 text-xs text-blue-700'>
                        <div className='font-semibold'>Phản hồi admin:</div>
                        <div>{review.adminReply}</div>
                      </div>
                    )}
                  </td>
                  <td className='px-5 py-4 text-center align-top'>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${STATUS_COLORS[review.status]}`}>
                      {STATUS_LABELS[review.status]}
                    </span>
                  </td>
                  <td className='px-5 py-4 text-center align-top text-sm'>
                    <div className='inline-flex items-center gap-1 text-gray-700'>
                      <Calendar className='h-4 w-4 text-gray-500' />
                      {review.createdAt ? new Date(review.createdAt).toLocaleString('vi-VN') : 'N/A'}
                    </div>
                  </td>
                  <td className='px-5 py-4 text-center align-top'>
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        onClick={() => handleChangeStatus(review)}
                        className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                          review.status === 'APPROVED'
                            ? 'border-red-500 text-red-600 hover:bg-red-50'
                            : 'border-green-500 text-green-600 hover:bg-green-50'
                        }`}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {review.status === 'APPROVED' ? (
                          <>
                            <EyeOff className='h-3 w-3' /> Ẩn
                          </>
                        ) : (
                          <>
                            <Eye className='h-3 w-3' /> Hiện
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openReplyBox(review)}
                        className='inline-flex items-center gap-1 rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50'
                      >
                        <MessageSquareReply className='h-3 w-3' /> Phản hồi
                      </button>
                    </div>
                    {replyingReviewId === review.reviewID && (
                      <div className='mt-3 w-[320px] rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm'>
                        <textarea
                          value={replyDraft}
                          onChange={(event) => setReplyDraft(event.target.value)}
                          rows={4}
                          className='w-full rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-400'
                        />
                        <div className='mt-2 flex justify-end gap-2'>
                          <button
                            onClick={() => {
                              setReplyingReviewId(null)
                              setReplyDraft('')
                            }}
                            className='rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50'
                          >
                            Hủy
                          </button>
                          <button
                            disabled={replyMutation.isPending || !replyDraft.trim()}
                            onClick={() =>
                              replyMutation.mutate({
                                reviewId: review.reviewID,
                                reply: replyDraft.trim()
                              })
                            }
                            className='rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300'
                          >
                            Gửi phản hồi
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className='mt-8 flex items-center justify-center gap-4'>
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
            className='rounded border px-4 py-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40'
          >
            ←
          </button>
          <span className='font-medium text-gray-700'>
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className='rounded border px-4 py-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40'
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

