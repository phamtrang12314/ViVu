import { useState, useCallback, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AppContext } from '../../contexts/app.context'
import { reviewApi } from '../../apis/review.api'
import ReviewModal from '../ReviewModel'

interface ReviewButtonProps {
  tourId: string
  tourTitle: string
  status: string
}

export const ReviewButton = ({ tourId, tourTitle, status }: ReviewButtonProps) => {
  const { isAuthenticated } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)

  const {
    data: reviewedData,
    isLoading: isLoadingReviewed,
    refetch
  } = useQuery({
    queryKey: ['hasReviewed', tourId],
    queryFn: () => reviewApi.hasReviewed(tourId),
    enabled: isAuthenticated && status === 'COMPLETED',
    staleTime: 5000
  })

  const isReviewed = reviewedData?.data === true
  const canReview = status === 'COMPLETED' && !isReviewed

  const handleSuccess = useCallback(() => {
    refetch()
  }, [refetch])

  if (!isAuthenticated || status !== 'COMPLETED') {
    return null
  }

  if (isLoadingReviewed) {
    return (
      <button
        disabled
        className="px-4 py-2 text-sm bg-gray-100 text-gray-500 rounded-md cursor-not-allowed"
      >
        Đang kiểm tra...
      </button>
    )
  }

  if (isReviewed) {
    return (
      <button
        disabled
        className="px-4 py-2 text-sm bg-black/10 text-gray-500 font-medium rounded-md cursor-not-allowed"
      >
        Đã đánh giá
      </button>
    )
  }

  if (canReview) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-sm bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition"
        >
          Đánh giá ngay
        </button>
        {showModal && (
          <ReviewModal
            tourId={tourId}
            tourTitle={tourTitle}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}
      </>
    )
  }

  return null
}

