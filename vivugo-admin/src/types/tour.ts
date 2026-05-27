// frontend-demo/src/types/tour.ts

export interface Tour {
    tourID: string;
    title: string;
    imageURL: string;
    startDate: string;
    durationDays: number;
    durationNights: number;
    departurePlace: string;
    priceAdult: number;
    priceChild: number;
    finalPrice: number;
    tourTypeName: string;
    destinationName: string;
    originalPrice: number | null;
    // FIX: Loại bỏ | null vì backend đã đảm bảo trả về 0 nếu không có khuyến mãi.
    discountPercentage: number;
    averageRating: number;
    reviewCount: number;
}

export interface TourList {
    content: Tour[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export type TourApiResponse = TourList;

/**
 * Đây là kiểu dữ liệu cho query params khi gọi API lấy danh sách tour
 * Dùng cho cả bộ lọc (filter) và phân trang (pagination).
 */
export interface TourListParams {
    page?: number | string;
    size?: number | string;
    sort?: string;
    search?: string;
    // (CẬP NHẬT) Đổi tên trường sang snake_case
    destination_id?: string;
    tour_type_id?: string;
    region?: string;
}

export interface TourListAdminParams {
    page?: number | string;
    size?: number | string;
    search?: string;
    status?: string;
    tour_type_id?: string;
}

interface ItineraryDto {
    dayNumber: number;
    title: string;
    description: string;
}

interface TourImageDto {
    url: string;
    caption: string;
}

interface DestinationDto {
    destinationID: string;
    nameDes: string;
    region: string;
}

// (CẬP NHẬT) Dựa trên TourDetailsResponse của backend
export interface TourDetails {
    imagePath: any;
    tourID: string;
    title: string;
    description: string;
    startDate: string; // LocalDate
    endDate: string; // LocalDate
    durationDays: number;
    durationNights: number;
    departurePlace: string;
    priceAdult: number;
    priceChild: number;
    finalPriceAdult: number; // <-- (MỚI) Thêm giá cuối cùng
    finalPriceChild: number; // <-- (MỚI) Thêm giá cuối cùng
    maxParticipants: number;
    imageURL: string;
    status: string;
    ranking: number;
    // finalPrice: number; // Trường này không còn trong DTO chi tiết
    // discountPercentage: number; // Trường này không còn trong DTO chi tiết
    tourType: {
        tourTypeID: string;
        nameType: string;
    };
    destinations: DestinationDto[];
    tourImages: TourImageDto[];
    itineraries: ItineraryDto[];
    // Giả định thêm rating cho hiển thị
    averageRating: number;
    reviewCount: number;
}

