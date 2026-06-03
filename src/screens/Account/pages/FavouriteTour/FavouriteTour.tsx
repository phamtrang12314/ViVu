import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import { favoriteApi } from '../../../../apis/favorite.api'
import { tourApi } from '../../../../apis/tour'
import type { TourDetails, Tour } from '../../../../types/tour'
import TourCard from '../../../../components/TourCard'
import { FaHeart, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../../../../contexts/app.context'

export default function FavouriteTour() {
  const queryClient = useQueryClient()
  const { removeFavoriteId } = useContext(AppContext)

  const {
    data: favoriteIdsData,
    isLoading: isLoadingIds,
    isError: isErrorIds
  } = useQuery({
    queryKey: ['favoriteIds'],
    queryFn: favoriteApi.getMyFavoriteIds,
    staleTime: 1000 * 60
  })

  const favoriteIds = favoriteIdsData?.data || []

  const removeFavoriteMutation = useMutation({
    mutationFn: favoriteApi.removeFavorite,
    onSuccess: (_response, tourId) => {
      removeFavoriteId(tourId)

      queryClient.invalidateQueries({ queryKey: ['favoriteIds'] })

      const tourTitle = favoriteTours.find((t) => t.tourID === tourId)?.title || 'Tour'
      toast.success(`Đã xóa "${tourTitle}" khỏi danh sách yêu thích.`)
    },
    onError: (error) => {
      console.error('Remove failed:', error)
      toast.error('Không thể xóa tour khỏi danh sách yêu thích.')
    }
  })

  const tourQueries = useQueries({
    queries: favoriteIds.map((id) => {
      return {
        queryKey: ['tourDetails', id],
        queryFn: () => tourApi.getTourDetails(id),
        enabled: favoriteIds.length > 0 && !isLoadingIds,
        staleTime: 1000 * 60 * 5
      }
    })
  })

  const isLoadingTours = tourQueries.some((query) => query.isLoading)
  const isErrorTours = tourQueries.some((query) => query.isError)

  const favoriteTours: Tour[] = tourQueries
    .filter((query) => query.isSuccess && query.data)
    .map((query) => {
      const details = query.data!.data as TourDetails

      const destinationName =
        details.destinations?.[0]?.nameDes || details.departurePlace || 'Chưa xác định'

      const originalPrice = details.priceAdult ?? 0
      const finalPrice = details.finalPriceAdult ?? 0

      const discountPercentage =
        originalPrice > 0 && finalPrice < originalPrice
          ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
          : 0

      return {
        ...details,
        finalPrice: finalPrice,
        priceAdult: originalPrice,
        averageRating: details.averageRating ?? 0,
        reviewCount: details.reviewCount ?? 0,
        destinationName: destinationName,
        tourTypeName: details.tourType?.nameType || 'Khác',
        discountPercentage: discountPercentage,
        originalPrice: originalPrice
      } as Tour
    })
    .filter((tour) => !!tour)

  if (isLoadingIds || isLoadingTours) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mr-3"></div>
        <span className="text-gray-600">Đang tải danh sách Tour yêu thích...</span>
      </div>
    )
  }

  if (isErrorIds || isErrorTours) {
    return (
      <div className="text-red-500 text-center p-8 border border-red-200 bg-red-50 rounded-lg shadow-md">
        Lỗi khi tải Tour yêu thích. Vui lòng kiểm tra kết nối mạng hoặc server.
      </div>
    )
  }

  if (favoriteIds.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 border border-gray-200 bg-gray-50 rounded-lg shadow-lg">
        <FaHeart size={32} className="mx-auto mb-4 text-gray-400" />
        <p className="font-semibold">Danh sách yêu thích trống.</p>
        <p className="text-sm">Hãy khám phá và thêm tour mới!</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Tour Du Lịch Yêu Thích ({favoriteTours.length})
      </h3>
      {/* FIX: Thay đổi breakpoints ở đây.
         - md:grid-cols-2: Màn hình tablet/laptop nhỏ hiển thị 2 cột
         - lg:grid-cols-2: Màn hình laptop thường vẫn giữ 2 cột (để tránh bị hẹp do sidebar)
         - xl:grid-cols-3: Chỉ màn hình rất lớn mới hiện 3 cột
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {favoriteTours.map((tour) => (
          <div className="relative" key={tour.tourID}>
            <button
              onClick={(e) => {
                e.preventDefault()
                removeFavoriteMutation.mutate(tour.tourID)
              }}
              disabled={removeFavoriteMutation.isPending}
              className={`absolute top-4 right-4 z-20 p-2.5 rounded-full text-white transition duration-300 shadow-lg 
                    ${
                      removeFavoriteMutation.isPending
                        ? 'bg-red-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
              aria-label="Xóa khỏi yêu thích"
            >
              <FaTrashAlt size={16} />
            </button>
            <TourCard tour={tour} isFavoritePage={true} />
          </div>
        ))}
      </div>
    </div>
  )
}

