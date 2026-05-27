// frontend-demo/src/components/TourReviewSection/TourReviewSection.tsx

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { reviewApi } from "../../apis/review.api";
import ReviewCard from "../ReviewCard";
import Button from "../Button";
import type { Review } from "../../types/review.type";

const REVIEW_PAGE_SIZE = 5; // Hiển thị 5 review mỗi trang

interface Props {
    tourId: string;
}

export default function TourReviewSection({ tourId }: Props) {
    const [page, setPage] = useState(0); // Quản lý trang hiện tại

    const { data: reviewsData, isLoading } = useQuery({
        queryKey: ["reviews", tourId, page],
        queryFn: () =>
            reviewApi.getReviewsForTour(tourId, {
                page: page,
                size: REVIEW_PAGE_SIZE,
            }),
        placeholderData: keepPreviousData, // Giữ data cũ khi fetch trang mới
    });

    const reviews = reviewsData?.data.content || [];
    const totalPages = reviewsData?.data.totalPages || 0;
    const totalElements = reviewsData?.data.totalElements || 0;

    // Hiển thị loading chỉ khi fetch lần đầu
    if (isLoading && reviews.length === 0) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Đánh giá từ khách hàng
                </h2>
                <div className="text-center text-gray-600">Đang tải đánh giá...</div>
            </div>
        );
    }

    // Không hiển thị gì nếu không có review
    if (totalElements === 0) {
        return null; // Hoặc bạn có thể trả về:
        // <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
        //     <h2 className="text-2xl font-semibold text-gray-800 mb-6">Đánh giá</h2>
        //     <p className="text-gray-600">Chưa có đánh giá nào cho tour này.</p>
        // </div>
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Đánh giá từ khách hàng ({totalElements})
            </h2>

            {/* Danh sách review */}
            <div>
                {reviews.map((review: Review, index: number) => (
                    // Sử dụng index + createdAt làm key dự phòng
                    <ReviewCard key={review.createdAt + index} review={review} />
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={reviewsData?.data.first} // Vô hiệu hóa nếu là trang đầu
                        variant="outline"
                    >
                        Trang trước
                    </Button>
                    <span className="text-gray-700 font-medium">
                        Trang {page + 1} / {totalPages}
                    </span>
                    <Button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={reviewsData?.data.last} // Vô hiệu hóa nếu là trang cuối
                        variant="outline"
                    >
                        Trang sau
                    </Button>
                </div>
            )}
        </div>
    );
}

