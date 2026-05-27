// frontend-demo/src/components/ReviewCard/ReviewCard.tsx

import type { Review } from "../../types/review.type";
import { FaStar } from "react-icons/fa";

// Component con để hiển thị sao
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, index) => (
                <FaStar
                    key={index}
                    className={index < rating ? "text-yellow-500" : "text-gray-300"}
                />
            ))}
        </div>
    );
};

// Helper format ngày (vd: 25/10/2025)
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
};

interface Props {
    review: Review;
}

export default function ReviewCard({ review }: Props) {
    // Dùng ảnh user mặc định nếu backend không trả về avatarURL
    const avatar = review.user.avatarURL || "/src/assets/user.png";

    return (
        <div className="border-b border-gray-200 py-5 last:border-b-0">
            <div className="flex items-start">
                <img
                    src={avatar}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-gray-800">{review.user.name}</h4>
                            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                        <StarRating rating={review.rating} />
                    </div>
                    <p className="mt-2 text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
            </div>
        </div>
    );
}

