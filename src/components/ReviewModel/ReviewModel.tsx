import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { reviewApi } from "../../apis/review.api";

interface ReviewModalProps {
  tourId: string;
  tourTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  tourId,
  tourTitle,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReviewMutation = useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: () => {
      toast.success("Đánh giá đã được gửi và đang chờ duyệt.");
      onSuccess();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["bookingHistory"] });
    },
    onError: (error: any) => {
      const message = error.response?.data || "Có lỗi xảy ra khi gửi đánh giá.";
      toast.error(message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedMediaUrl: string | undefined;
      if (mediaFile) {
        const uploadResponse = await reviewApi.uploadReviewMedia(mediaFile);
        uploadedMediaUrl = uploadResponse.data.url;
      }

      createReviewMutation.mutate({
        tourId,
        rating,
        comment,
        videoUrl: uploadedMediaUrl,
      });
    } catch (error: any) {
      setIsSubmitting(false);
      const message =
        error.response?.data || "Không tải được ảnh/video. Vui lòng thử lại.";
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
          Đánh giá Tour: {tourTitle}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chất lượng dịch vụ
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={30}
                  className={`cursor-pointer transition-colors duration-200 ${
                    star <= rating
                      ? "text-yellow-500"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bình luận (Tùy chọn)
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Chia sẻ trải nghiệm của bạn..."
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="mediaFile"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ảnh hoặc video từ điện thoại (Tùy chọn)
            </label>
            <input
              id="mediaFile"
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setMediaFile(file);
              }}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isSubmitting}
            />
            <p className="mt-2 text-xs text-gray-500">
              Hỗ trợ ảnh/video, tối đa 50MB.
            </p>
            {mediaFile && (
              <p className="mt-1 text-xs text-gray-600">
                Đã chọn: {mediaFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

