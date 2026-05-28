import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  Globe2,
  ImageIcon,
  Calendar,
  Route,
} from "lucide-react";
import { destinationAdminApi } from "../../apis/destinationAdmin.api";
import type { DestinationDetailAdmin } from "../../types/destinationAdmin";

const DestinationDetailAdminScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-destination-detail", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("Missing id");
      const res = await destinationAdminApi.getDestinationById(id);
      return res.data;
    },
  });

  const handleBack = () => navigate("/admin/manage-destination");

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Đang tải thông tin điểm đến...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8">
        <button
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
        <p className="text-red-500 text-sm">Không tìm thấy điểm đến.</p>
      </div>
    );
  }

  const destination: DestinationDetailAdmin = data;
  const images = destination.images || [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Back + tiêu đề */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/manage-destination")}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {destination.nameDes}
            </h1>
            <p className="text-gray-500 text-sm">
              Trang quản trị chi tiết điểm đến
            </p>
          </div>
        </div>
      </div>

      {/* PHẦN TRÊN: 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Cột trái: Thông tin chi tiết */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6 flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            Thông tin điểm đến
          </h2>

          <div className="flex items-start gap-2 text-gray-800">
            <MapPin size={18} className="mt-1" />
            <div className="text-sm">
              <div className="font-semibold">Địa điểm</div>
              <div>{destination.location || "Không rõ"}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-gray-800">
            <Globe2 size={18} className="mt-1" />
            <div className="text-sm">
              <div className="font-semibold">Khu vực</div>
              <div>{destination.region || "Không rõ"}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-gray-800">
            <Globe2 size={18} className="mt-1" />
            <div className="text-sm">
              <div className="font-semibold">Quốc gia</div>
              <div>{destination.country || "Không rõ"}</div>
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xs font-semibold text-gray-500 mb-1">
              ID điểm đến  {destination.destinationID}
            </div>
          </div>

          {destination.description && (
            <div className="mt-3">
              <div className="text-sm font-semibold text-gray-800 mb-1">
                Mô tả
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {destination.description}
              </p>
            </div>
          )}
        </div>

        {/* Cột phải: Thống kê tour */}
        <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-800">
            Thống kê tour sử dụng điểm đến
          </h2>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 rounded-2xl px-3 py-3">
              <div className="text-[10px] text-blue-500 font-semibold uppercase">
                Tổng số tour
              </div>
              <div className="text-xl font-bold text-blue-700">
                {destination.totalTours}
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl px-3 py-3">
              <div className="text-[10px] text-green-500 font-semibold uppercase">
                Tour đang hoạt động
              </div>
              <div className="text-xl font-bold text-green-700">
                {destination.activeTours}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl px-3 py-3">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">
                Tour đã hoàn thành
              </div>
              <div className="text-xl font-bold text-gray-800">
                {destination.completedTours}
              </div>
            </div>

            <div className="bg-yellow-50 rounded-2xl px-3 py-3">
              <div className="text-[10px] text-yellow-500 font-semibold uppercase">
                Tour sắp khởi hành
              </div>
              <div className="text-xl font-bold text-yellow-700">
                {destination.upcomingTours}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <Calendar size={14} />
            <span>
              Lần sử dụng gần nhất:{" "}
              {destination.lastUsedDate
                ? new Date(destination.lastUsedDate).toLocaleDateString("vi-VN")
                : "Chưa có dữ liệu"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Route size={14} />
            <span>
              Điểm đến này đang là một trong các điểm dừng trong hệ thống tour.
            </span>
          </div>
        </div>
      </div>

      {/* PHẦN DƯỚI: Thư viện hình ảnh */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          Thư viện hình ảnh
        </h2>

        {images.length === 0 ? (
          <div className="w-full h-32 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl">
            <ImageIcon className="mr-2" size={18} />
            Chưa có hình ảnh cho điểm đến này
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="w-full h-28 rounded-2xl overflow-hidden bg-gray-100"
              >
                <img
                  src={img}
                  alt={`${destination.nameDes} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetailAdminScreen;

