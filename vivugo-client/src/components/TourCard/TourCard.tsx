import { Link } from 'react-router-dom'
import type { Tour } from '../../types/tour'
import { formatCurrency } from '../../utils/utils'
import { FaMapMarkerAlt, FaStar, FaClock, FaHeart, FaBolt } from 'react-icons/fa'
import Button from '../Button'
import React, { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AppContext } from '../../contexts/app.context'
import { favoriteApi } from '../../apis/favorite.api'
import type { AxiosError } from 'axios'
import { motion } from 'framer-motion'

export type TourCardVariant = 'default' | 'featured' | 'trending' | 'deal'

export default function TourCard({
  tour,
  isFavoritePage = false,
  variant = 'default'
}: {
  tour: Tour
  isFavoritePage?: boolean
  variant?: TourCardVariant
}) {
  const { isAuthenticated, favoriteIds, addFavoriteId, removeFavoriteId } = useContext(AppContext)
  const queryClient = useQueryClient()

  // BẢO VỆ ID: Xử lý lỗi mất ID do JSON parse từ Spring Boot
  const safeId = tour.tourID || (tour as any).tourId || (tour as any).id || '';

  const isLiked = favoriteIds.has(safeId)

  const addFavoriteMutation = useMutation({ mutationFn: favoriteApi.addFavorite })
  const removeFavoriteMutation = useMutation({ mutationFn: favoriteApi.removeFavorite })

  const finalPrice = tour.finalPrice || 0
  const priceAdult = tour.priceAdult || 0
  const hasDiscount = finalPrice < priceAdult
  const averageRating = tour.averageRating || 0
  const reviewCount = tour.reviewCount || 0
  const durationDays = tour.durationDays || 0
  const durationNights = tour.durationNights || 0

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.info('Bạn cần đăng nhập để thực hiện chức năng này')
      return
    }

    if (isLiked) {
      removeFavoriteMutation.mutate(safeId, {
        onSuccess: () => {
          removeFavoriteId(safeId)
          toast.success('Đã xóa khỏi danh sách yêu thích!')
          queryClient.invalidateQueries({ queryKey: ['favoriteIds'] })
        },
        onError: () => toast.error('Có lỗi xảy ra, vui lòng thử lại.')
      })
    } else {
      addFavoriteMutation.mutate(
        { tourId: safeId },
        {
          onSuccess: () => {
            addFavoriteId(safeId)
            toast.success('Đã thêm tour vào danh sách yêu thích!')
            queryClient.invalidateQueries({ queryKey: ['favoriteIds'] })
          },
          onError: (error: AxiosError | Error) => {
            const axiosError = error as AxiosError<{ message: string }>
            if (axiosError.response?.status === 409) {
              addFavoriteId(safeId)
              toast.info('Bạn đã yêu thích tour này rồi.')
            } else {
              toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
            }
          }
        }
      )
    }
  }

  const isFeatured = variant === 'featured'
  const isTrending = variant === 'trending'
  const isDeal = variant === 'deal'

  const cardClass = [
    'bg-white/82 backdrop-blur-xl p-3 shadow-[var(--vivugo-shadow)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 group border flex flex-col h-full',
    'rounded-[var(--vivugo-radius)]',
    isTrending ? 'border-amber-200/80 ring-2 ring-amber-400/30 hover:ring-amber-400/50' : 'border-gray-100',
    isFeatured ? 'md:min-h-[520px]' : ''
  ].join(' ')

  const imageHeight = isFeatured ? 'h-72 md:h-80' : 'h-60'

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cardClass}
    >
      <div className={`relative ${imageHeight} rounded-3xl overflow-hidden mb-4`}>
        <Link to={`/tours/${safeId}`} className="block w-full h-full">
          <img
            src={tour.imageURL}
            alt={tour.title}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x256/E5E7EB/6B7280?text=Tour'
            }}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        </Link>

        {isTrending && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-amber-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <FaBolt size={12} /> Trending
          </div>
        )}

        {!isFavoritePage && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleFavoriteClick}
            disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
            className={`absolute top-4 right-4 z-10 p-2.5 bg-white/70 backdrop-blur-md rounded-full shadow-sm transition-colors
              ${isLiked ? 'text-red-500 bg-white' : 'text-gray-500 hover:text-red-500 hover:bg-white'}
              ${addFavoriteMutation.isPending || removeFavoriteMutation.isPending ? 'cursor-not-allowed opacity-50' : ''}
            `}
            aria-label="Yêu thích"
          >
            <FaHeart size={18} className={isLiked ? 'animate-pulse' : ''} />
          </motion.button>
        )}

        {tour.tourTypeName && !isTrending && (
          <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full capitalize shadow-sm">
            {tour.tourTypeName.toLowerCase().replace('tour ', '')}
          </div>
        )}

        {tour.discountPercentage > 0 && (
          <div
            className={`absolute z-10 text-white text-xs font-bold shadow-lg ${
              isDeal
                ? 'top-0 left-0 bg-gradient-to-br from-red-600 to-rose-500 px-4 py-2 rounded-br-2xl clip-ribbon'
                : 'bottom-4 left-4 bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 rounded-full'
            }`}
          >
            {isDeal ? (
              <>
                <span className="block text-[10px] uppercase opacity-90">Ưu đãi</span>
                -{tour.discountPercentage}%
              </>
            ) : (
              <>Giảm {tour.discountPercentage}%</>
            )}
          </div>
        )}
      </div>

      <div className="px-3 flex flex-col flex-grow">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2 py-1 rounded-md font-medium">
            <FaStar />
            <span>{averageRating.toFixed(1)}</span>
            <span className="text-gray-400 text-xs ml-1">({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <FaClock className="text-gray-400" />
            <span>{`${durationDays}N${durationNights}Đ`}</span>
          </div>
        </div>

        <h3
          className={`font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors ${
            isFeatured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}
        >
          <Link to={`/tours/${safeId}`}>{tour.title}</Link>
        </h3>

        {isFeatured && (
          <div className="mb-4 rounded-2xl border border-white/70 bg-white/48 backdrop-blur-xl p-4 text-sm text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-xs font-semibold uppercase text-slate-400">Thời lượng</span>
                <span className="font-bold text-slate-800">
                  {durationDays} ngày {durationNights} đêm
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold uppercase text-slate-400">Điểm đến</span>
                <span className="font-bold text-slate-800 line-clamp-1">
                  {tour.destinationName || 'Đang cập nhật'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500 mb-4 font-medium">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          <span className="truncate">{tour.destinationName || 'Đang cập nhật'}</span>
        </div>

        <div className="border-t border-gray-100 mb-4 w-full"></div>

        <div className="mt-auto">
          <div className="flex flex-col items-end justify-end mb-4">
            <span className="text-xs text-gray-400 font-medium uppercase mb-0.5">Giá chỉ từ</span>
            <div className="flex items-baseline gap-2">
              {hasDiscount && (
                <span className="text-gray-400 line-through text-sm font-medium">
                  {formatCurrency(priceAdult)}
                </span>
              )}
              <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              as="link"
              to={`/tours/${safeId}`}
              variant="outline"
              className="flex-1 !rounded-xl !py-3 !text-sm !font-bold !bg-white/70 !text-slate-700 hover:!bg-white hover:!-translate-y-0.5"
            >
              Chi tiết
            </Button>
            <Button
              as="link"
              to={`/tours/${safeId}`}
              variant="solid"
              className="flex-1 !rounded-xl !py-3 !text-sm !font-black !text-white !bg-gradient-to-r !from-blue-600 !to-indigo-600 hover:!from-blue-700 hover:!to-indigo-700 hover:!-translate-y-0.5 hover:!scale-[1.02] !shadow-[0_12px_26px_rgba(37,99,235,0.32)] hover:!shadow-[0_18px_34px_rgba(37,99,235,0.42)]"
            >
              Đặt ngay
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
