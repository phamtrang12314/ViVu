import type { BookingStatus } from '@/types/booking.type'
import type { ItineraryAdmin } from './itineraryAdmin'

export interface TourAdmin {
  tourID: string
  title: string
  imageURL: string
  durationDays: number
  durationNights: number
  priceAdult: number
  tourTypeName: string
  destinationName: string
  status: string
  endDate: string
}

export interface TourListAdmin {
  content: TourAdmin[]
  pageable: {
    pageNumber: number
    pageSize: number
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  numberOfElements: number
  first: boolean
  empty: boolean
}

export type TourAdminApiResponse = TourListAdmin

export interface TourListAdminParams {
  page?: number | string
  size?: number | string
  search?: string
  status?: string
  tour_type_id?: string
}

export interface TourDetailAdmin {
  tourID: string
  title: string
  description: string
  startDate: string
  endDate: string
  durationDays: number
  durationNights: number
  priceAdult: number
  priceChild: number
  maxParticipants: number
  minParticipants: number
  imageURL: string
  status: string
  ranking?: number | null
  tourType?: {
    id: string
    name: string
  } | null
  tourDestinations?: {
    tourDestinationID: string
    destination: {
      id: string
      nameDes: string
      region: string
    } | null
  }[]

  promotions?: {
    promotionID: string
    title: string
  }[]

  itineraries?: ItineraryAdmin[]
  tourImages?: {
    url: string
    caption?: string | null
  }[]
  openDates?: string[]
}

export interface SimpleTour {
  tourId: string
  title: string
}

export interface TourParticipants {
  tourId: string
  tourName: string | null
  participants: {
    participantId: string
    fullName: string
    phone?: string
    identification?: string
    gender?: string // MALE/FEMALE/...
    participantType?: string // ADULT/CHILD/...
    bookingId: string
    bookingDate: string
    bookingStatus: BookingStatus
  }[]
}

// Tour đơn giản cho combobox
export interface SimpleTour {
  tourId: string
  title: string
}

// admin/types/tourAdmin.ts
export type SimpleTour2 = {
  tourId: string
  code?: string
  title: string
  startDate: string
  endDate: string
  status: string
}

