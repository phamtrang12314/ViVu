// frontend-demo/src/types/review.type.ts

// Dựa trên ReviewUserDto lồng trong ReviewDto
export interface ReviewUser {
    name: string;
    avatarURL: string | null;
}

// Dựa trên ReviewDto
export interface Review {
    rating: number;
    comment: string;
    createdAt: string; // Đây sẽ là một chuỗi ISO date (vd: "2025-10-25T10:30:00")
    user: ReviewUser;
}

// Dựa trên cấu trúc Page<> của Spring Boot
export interface ReviewApiResponse {
    content: Review[];
    totalPages: number;
    totalElements: number;
    number: number; // trang hiện tại
    first: boolean;
    last: boolean;
}

