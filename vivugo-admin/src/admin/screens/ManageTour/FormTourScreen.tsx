import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { tourTypeApi } from "../../../apis/tourType.api";
import { destinationAdminApi } from "../../apis/destinationAdmin.api";
import { promotionAdminApi } from "@/admin/apis/promotionAdmin.api";
import { tourAdminApi } from "../../apis/tourAdmin.api";

import type { PromotionSimple } from "@/admin/types/promotionAdmin";
import type { ItineraryAdmin } from "@/admin/types/itineraryAdmin";
import type { SimpleTour, TourDetailAdmin } from "@/admin/types/tourAdmin";
import Select from "react-select";
import { ArrowLeft } from "lucide-react";
import { resolveAssetUrl } from "../../../utils/utils";

// ==== Types local ====

type TourType = {
  tourTypeID: string;
  nameType: string;
};

type DestinationAdmin = {
  destinationID: string;
  nameDes: string;
  region: string;
};

type TourForm = {
  title: string;
  startDate: string;
  endDate: string;
  priceAdult: number | "";
  priceChild: number | "";
  minGuests: number | "";
  maxGuests: number | "";
  imageURL: string;
  durationDays: number | "";
  durationNights: number | "";
  description: string;
  tourTypeId: string;
  status: string;
  region: string;
  destinationId: string; // select tạm
};

type FormErrors = {
  [K in keyof TourForm]?: string;
} & {
  form?: string;
  itineraries?: string;
};

const REGION_OPTIONS = [
  { value: "Miền Bắc", label: "Miền Bắc" },
  { value: "Miền Trung", label: "Miền Trung" },
  { value: "Miền Nam", label: "Miền Nam" },
];

const inputBase =
  "w-full border border-gray-300 rounded-xl px-3 py-3 text-base " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

// ==== helpers VND ====

const parseVND = (raw: string): number | "" => {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits);
};

const formatVND = (value: number | ""): string => {
  if (value === "" || isNaN(Number(value))) return "";
  return Number(value).toLocaleString("vi-VN");
};

// ==== component ====

export default function FormTourScreen() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [selectedPromotions, setSelectedPromotions] = useState<PromotionSimple[]>([]);
  const [itineraries, setItineraries] = useState<ItineraryAdmin[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<DestinationAdmin[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedReopenTourId, setSelectedReopenTourId] = useState<string | null>(null);


  const [form, setForm] = useState<TourForm>({
    title: "",
    startDate: "",
    endDate: "",
    priceAdult: "",
    priceChild: "",
    minGuests: "",
    maxGuests: "",
    imageURL: "",
    durationDays: "",
    durationNights: "",
    description: "",
    tourTypeId: "",
    status: "ACTIVE",
    region: "",
    destinationId: "",
  });

  // ==== Query loại tour ====
  const {
    data: tourTypes = [],
    isLoading: loadingTypes,
  } = useQuery<TourType[]>({
    queryKey: ["tourTypes"],
    queryFn: () => tourTypeApi.getTourTypes().then((res) => res.data),
  });

  // ==== Query chi tiết tour khi edit ====
  const {
    data: tourDetail,
    isLoading: loadingTour,
  } = useQuery<TourDetailAdmin>({
    queryKey: ["tour-detail", id],
    queryFn: () => {
      if (!id) throw new Error("missing id");
      return tourAdminApi.getTourById(id as string).then((res) => res.data);
    },
    enabled: isEdit && !!id,
  });

  // ==== Query khuyến mãi ====
  const {
    data: promotions = [],
    isLoading: loadingPromotions,
  } = useQuery<PromotionSimple[]>({
    queryKey: ["admin-promotions-simple"],
    queryFn: () =>
      promotionAdminApi.getSimplePromotions().then((res) => res.data),
  });

  // ==== Query điểm đến theo region ====
  const {
    data: destinations = [],
    isLoading: loadingDestinations,
    error: destinationsError,
  } = useQuery<DestinationAdmin[]>({
    queryKey: ["admin-destinations", form.region],
    queryFn: () =>
      destinationAdminApi
        .getDestinationsForTour(form.region || undefined)
        .then((res: any) => res.data),
    enabled: !!form.region,
  });

  // ==== Query danh sách tour COMPLETED để "mở lại" (chỉ dùng khi tạo mới) ====
  const {
    data: completedTours = [],
    isLoading: loadingCompletedTours,
  } = useQuery<SimpleTour[]>({
    queryKey: ["admin-tours-completed-simple"],
    queryFn: () =>
      tourAdminApi.getCompletedToursSimple().then((res) => res.data),
    enabled: !isEdit,
  });

  // options cho react-select
  const reopenTourOptions = useMemo(
    () =>
      completedTours.map((t) => ({
        value: t.tourId ?? t.tourId,
        label: `${t.title}`,
      })),
    [completedTours]
  );

  const handleReopenTour = async (tourId: string | null) => {
    if (!tourId) return;

    try {
      const res = await tourAdminApi.getTourById(tourId);
      const detail = res.data;
      // fill form bằng dữ liệu tour đã hoàn thành, ép trạng thái về ACTIVE
      fillFromTourDetail(detail, { forceActive: true });
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        form: "Không tải được dữ liệu tour để mở lại.",
      }));
    }
  };



  // ==== helper fill form từ TourDetail ====
  const fillFromTourDetail = (detail: TourDetailAdmin, opts?: { forceActive?: boolean }) => {
    const tourDestinations = detail.tourDestinations || [];
    const firstDes = tourDestinations[0]?.destination;

    const mappedDestinations: DestinationAdmin[] = tourDestinations
      .map((td) => td.destination)
      .filter(
        (d): d is { id: string; nameDes: string; region: string } => !!d
      )
      .map((d) => ({
        destinationID: d.id,
        nameDes: d.nameDes,
        region: d.region,
      }));

    setForm({
      title: detail.title ?? "",
      startDate: detail.startDate ?? "",
      endDate: detail.endDate ?? "",
      priceAdult:
        typeof detail.priceAdult === "number" ? detail.priceAdult : "",
      priceChild:
        typeof detail.priceChild === "number" ? detail.priceChild : "",
      minGuests:
        typeof detail.minParticipants === "number"
          ? detail.minParticipants
          : "",
      maxGuests:
        typeof detail.maxParticipants === "number"
          ? detail.maxParticipants
          : "",
      imageURL: detail.imageURL ?? "",
      durationDays:
        typeof detail.durationDays === "number" ? detail.durationDays : "",
      durationNights:
        typeof detail.durationNights === "number"
          ? detail.durationNights
          : "",
      description: detail.description ?? "",
      tourTypeId: detail.tourType?.id ?? "",
      status: opts?.forceActive
        ? "ACTIVE"
        : detail.status?.toUpperCase() ?? "ACTIVE",
      region: firstDes?.region ?? "",
      destinationId: "",
    });

    const promoList: PromotionSimple[] =
      detail.promotions?.map((p) => ({
        promotionID: p.promotionID,
        title: p.title,
      })) ?? [];

    setSelectedPromotions(promoList);

    const itList: ItineraryAdmin[] =
      detail.itineraries?.map((it) => ({
        itineraryID: it.itineraryID,
        dayNumber: it.dayNumber,
        title: it.title,
        description: it.description,
      })) ?? [];

    setItineraries(itList.length > 0 ? itList : []);
    setSelectedDestinations(mappedDestinations);
    setErrors({});
  };

  // Khi đang edit → tourDetail thay đổi thì fill form
  useEffect(() => {
    if (!tourDetail) return;
    fillFromTourDetail(tourDetail);
  }, [tourDetail]);

  // ==== Handlers ====

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    const priceFields = ["priceAdult", "priceChild"];
    const numericFields = [
      "minGuests",
      "maxGuests",
      "durationDays",
      "durationNights",
    ];

    if (priceFields.includes(name)) {
      const numeric = parseVND(value);
      setForm((prev) => ({
        ...prev,
        [name]: numeric,
      }));
    } else if (numericFields.includes(name)) {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;

    setForm((prev) => ({
      ...prev,
      region,
      destinationId: "",
    }));

    setErrors((prev) => ({
      ...prev,
      region: undefined,
      destinationId: undefined,
      form: undefined,
    }));
  };

  const handleDestinationSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value;

    setForm((prev) => ({
      ...prev,
      destinationId: id,
    }));

    setErrors((prev) => ({
      ...prev,
      destinationId: undefined,
      form: undefined,
    }));

    if (!id) return;

    const found = destinations.find((d) => d.destinationID === id);
    if (!found) return;

    setSelectedDestinations((prev) => {
      const exists = prev.some((d) => d.destinationID === id);
      if (exists) return prev;
      return [...prev, found];
    });
  };

  const handleRemoveDestination = (id: string) => {
    setSelectedDestinations((prev) =>
      prev.filter((d) => d.destinationID !== id)
    );
    setForm((prev) => ({
      ...prev,
      destinationId: prev.destinationId === id ? "" : prev.destinationId,
    }));
  };

  const handlePromotionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;

    const found = promotions.find((p) => p.promotionID === id);
    if (!found) return;

    setSelectedPromotions((prev) => {
      const exists = prev.some((p) => p.promotionID === id);
      if (exists) return prev;
      return [...prev, found];
    });
  };

  const handleRemovePromotion = (id: string) => {
    setSelectedPromotions((prev) =>
      prev.filter((p) => p.promotionID !== id)
    );
  };

  const handleAddItineraryRow = () => {
    setItineraries((prev) => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        title: "",
        description: "",
      },
    ]);
  };

  const handleItineraryChange =
    (index: number, field: "title" | "description") =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setItineraries((prev) =>
          prev.map((it, i) =>
            i === index ? { ...it, [field]: value } : it
          )
        );
      };

  const handleRemoveItineraryRow = (index: number) => {
    setItineraries((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((it, idx) => ({ ...it, dayNumber: idx + 1 }))
    );
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      imageURL: "",
    }));
    setErrors((prev) => ({
      ...prev,
      imageURL: undefined,
      form: undefined,
    }));
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setErrors((prev) => ({ ...prev, imageURL: undefined, form: undefined }));

      const res = await tourAdminApi.uploadTourImage(file);
      const url = res.data.url;

      setForm((prev) => ({
        ...prev,
        imageURL: url,
      }));
    } catch (error: any) {
      console.log(error?.response || error);
      setErrors((prev) => ({
        ...prev,
        imageURL: "Upload ảnh thất bại. Vui lòng thử lại.",
      }));
    } finally {
      setUploadingImage(false);
    }
  };


  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) newErrors.title = "Không được để trống";
    if (!form.description.trim())
      newErrors.description = "Không được để trống";

    if (!form.tourTypeId) newErrors.tourTypeId = "Chọn loại tour";
    if (!form.region) newErrors.region = "Chọn miền";

    if (selectedDestinations.length === 0) {
      newErrors.destinationId = "Chọn ít nhất một điểm đến";
    }

    if (itineraries.length === 0) {
      newErrors.itineraries = "Cần thêm ít nhất một ngày lịch trình.";
    }

    const checkPositive = (
      value: number | "",
      field: keyof TourForm,
      label: string
    ) => {
      if (value === "" || Number(value) <= 0) {
        newErrors[field] = `${label} phải > 0`;
      }
    };

    // > 0
    checkPositive(form.priceAdult, "priceAdult", "Giá người lớn");
    checkPositive(form.priceChild, "priceChild", "Giá trẻ em");
    checkPositive(form.minGuests, "minGuests", "Số lượng tối thiểu");
    checkPositive(form.maxGuests, "maxGuests", "Số lượng tối đa");
    checkPositive(form.durationDays, "durationDays", "Số ngày");

    // >= 0 cho số đêm
    if (form.durationNights === "" || Number(form.durationNights) < 0) {
      newErrors.durationNights = "Số đêm phải ≥ 0";
    }

    // ====== CHECK NGÀY KHỞI HÀNH & KẾT THÚC ======
    if (!form.startDate) {
      newErrors.startDate = "Chọn ngày khởi hành";
    } else {
      const start = new Date(form.startDate);

      if (isNaN(start.getTime())) {
        newErrors.startDate = "Ngày khởi hành không hợp lệ";
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const minStart = new Date(today);
        minStart.setMonth(minStart.getMonth() + 1); // ít nhất 1 tháng sau

        if (start < minStart) {
          newErrors.startDate =
            "Ngày khởi hành phải sau ngày hiện tại ít nhất 1 tháng";
        }
      }
    }

    if (!form.endDate) {
      newErrors.endDate = "Chọn ngày kết thúc";
    } else if (form.startDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày khởi hành";
      }
    }

    if (!form.imageURL.trim()) {
      newErrors.imageURL = "Không được để trống";
    }

    return newErrors;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      durationDays: Number(form.durationDays),
      durationNights: Number(form.durationNights),
      priceAdult: Number(form.priceAdult),
      priceChild: Number(form.priceChild),
      minGuests: Number(form.minGuests),
      maxGuests: Number(form.maxGuests),
      imageURL: form.imageURL.trim(),
      status: form.status,
      tourTypeId: form.tourTypeId,
      destinationIds: selectedDestinations.map((d) => d.destinationID),
      promotionIds: selectedPromotions.map((p) => p.promotionID),
      itineraries: itineraries.map((it, index) => ({
        dayNumber: index + 1,
        title: it.title.trim(),
        description: it.description.trim(),
      })),
    };

    console.log("submit payload", payload);

    try {
      if (isEdit && id) {
        await tourAdminApi.updateTour(id, payload);
      } else {
        await tourAdminApi.createTour(payload);
      }
      navigate("/admin/manage-tour");
    } catch (error: any) {
      console.log(error?.response?.data || error);
      setErrors((prev) => ({
        ...prev,
        form: "Lỗi lưu tour. Kiểm tra lại dữ liệu hoặc thử lại",
      }));
    }
  };

  // ==== Render ====

  if (isEdit && loadingTour) {
    return (
      <div className="p-8 text-base">
        Đang tải dữ liệu tour
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-base">
      <div className="flex items-center gap-3 mb-7">
        <button
          onClick={() => navigate("/admin/manage-tour")}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "Chỉnh sửa tour" : "Tạo tour mới"}
          </h1>
          <p className="text-base text-gray-500 mt-1">
            Nhập đầy đủ thông tin để hiển thị tour rõ ràng.
          </p>
        </div>
      </div>

      {errors.form && (
        <div className="mb-4 text-sm text-red-500">{errors.form}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mở lại tour đã hoàn thành (chỉ khi tạo mới) */}
        {/* {!isEdit && (
          <section className="bg-white rounded-2xl shadow-sm p-6 space-y-3 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Mở lại tour đã hoàn thành
            </h2>

            <div className="mt-2">
              <select
                className={inputBase}
                onChange={handleReopenTourChange}
                disabled={loadingCompletedTours || completedTours.length === 0}
                defaultValue=""
              >
                <option value="">
                  {loadingCompletedTours
                    ? "Đang tải danh sách tour hoàn thành..."
                    : completedTours.length === 0
                    ? "Chưa có tour nào ở trạng thái Hoàn thành"
                    : "Chọn tour để dùng lại thông tin"}
                </option>
                {completedTours.map((t) => (
                  <option key={t.tourId} value={t.tourId}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )} */}
        {/* Mở lại tour đã hoàn thành (chỉ khi tạo mới) */}
        {!isEdit && (
          <section className="bg-white rounded-2xl shadow-sm p-6 space-y-3 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Mở lại tour đã hoàn thành
            </h2>
            <div className="mt-3 space-y-2">

              <Select
                isClearable
                isSearchable
                options={reopenTourOptions}
                placeholder={
                  loadingCompletedTours
                    ? "Đang tải danh sách tour hoàn thành..."
                    : reopenTourOptions.length === 0
                      ? "Chưa có tour nào ở trạng thái Hoàn thành"
                      : "— Chọn tour để dùng lại —"
                }
                value={
                  reopenTourOptions.find((opt) => opt.value === selectedReopenTourId) ||
                  null
                }
                onChange={(opt: any) => {
                  const value = opt?.value ?? null;
                  setSelectedReopenTourId(value);
                  if (value) {
                    handleReopenTour(value);
                  }
                }}
                classNamePrefix="react-select"
                className="min-w-[280px] text-sm"
                isDisabled={loadingCompletedTours || reopenTourOptions.length === 0}
              />


            </div>
          </section>
        )}



        {/* Thông tin cơ bản */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên tour
              </label>
              {errors.title && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.title}
                </p>
              )}
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ví dụ: Hà Nội - Hạ Long - Sapa 5N4Đ"
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Loại tour
              </label>
              {errors.tourTypeId && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.tourTypeId}
                </p>
              )}
              <select
                name="tourTypeId"
                value={form.tourTypeId}
                onChange={handleChange}
                className={inputBase}
              >
                <option value="">
                  {loadingTypes ? "Đang tải" : "Chọn loại tour"}
                </option>
                {tourTypes.map((type) => (
                  <option key={type.tourTypeID} value={type.tourTypeID}>
                    {type.nameType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Lịch trình & thời lượng */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Lịch trình & thời lượng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ngày khởi hành
              </label>
              {errors.startDate && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.startDate}
                </p>
              )}
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ngày kết thúc
              </label>
              {errors.endDate && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.endDate}
                </p>
              )}
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số ngày
              </label>
              {errors.durationDays && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.durationDays}
                </p>
              )}
              <input
                type="number"
                min={0}
                name="durationDays"
                value={form.durationDays}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số đêm
              </label>
              {errors.durationNights && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.durationNights}
                </p>
              )}
              <input
                type="number"
                min={0}
                name="durationNights"
                value={form.durationNights}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
          </div>
        </section>

        {/* Giá & số lượng */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Giá & số lượng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Giá người lớn (VNĐ)
              </label>
              {errors.priceAdult && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.priceAdult}
                </p>
              )}
              <input
                type="text"
                name="priceAdult"
                value={formatVND(form.priceAdult)}
                onChange={handleChange}
                className={inputBase}
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Giá trẻ em (VNĐ)
              </label>
              {errors.priceChild && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.priceChild}
                </p>
              )}
              <input
                type="text"
                name="priceChild"
                value={formatVND(form.priceChild)}
                onChange={handleChange}
                className={inputBase}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số lượng tối thiểu
              </label>
              {errors.minGuests && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.minGuests}
                </p>
              )}
              <input
                type="number"
                min={0}
                name="minGuests"
                value={form.minGuests}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Số lượng tối đa
              </label>
              {errors.maxGuests && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.maxGuests}
                </p>
              )}
              <input
                type="number"
                min={0}
                name="maxGuests"
                value={form.maxGuests}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
          </div>
        </section>

        {/* Khu vực & điểm đến */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Khu vực & điểm đến
          </h2>

          {destinationsError && (
            <p className="text-sm text-red-500">Lỗi tải điểm đến</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Miền
              </label>
              {errors.region && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.region}
                </p>
              )}
              <select
                name="region"
                value={form.region}
                onChange={handleRegionChange}
                className={inputBase}
              >
                <option value="">Chọn miền</option>
                {REGION_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Điểm đến
              </label>
              {errors.destinationId && (
                <p className="text-xs text-red-500 mb-1">
                  {errors.destinationId}
                </p>
              )}
              <select
                name="destinationId"
                value={form.destinationId}
                onChange={handleDestinationSelect}
                className={inputBase}
                disabled={!form.region || loadingDestinations}
              >
                <option value="">
                  {!form.region
                    ? "Chọn miền trước"
                    : loadingDestinations
                      ? "Đang tải điểm đến"
                      : destinations.length === 0
                        ? "Không có điểm đến phù hợp"
                        : "Chọn điểm đến để thêm"}
                </option>
                {destinations.map((d) => (
                  <option key={d.destinationID} value={d.destinationID}>
                    {d.nameDes}
                  </option>
                ))}
              </select>

              {selectedDestinations.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                      Lộ trình điểm đến
                    </p>
                  </div>

                  <div className="space-y-2">
                    {selectedDestinations.map((d, index) => (
                      <div
                        key={d.destinationID}
                        className="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">
                              {d.nameDes}
                            </span>
                            <span className="text-xs text-gray-500">
                              {d.region}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveDestination(d.destinationID)
                          }
                          className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-500"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Khuyến mãi */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Khuyến mãi áp dụng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <select
                className={inputBase}
                onChange={handlePromotionSelect}
                disabled={loadingPromotions}
                value=""
              >
                <option value="">
                  {loadingPromotions ? "Đang tải..." : "Chọn để thêm khuyến mãi"}
                </option>
                {promotions.map((p) => (
                  <option key={p.promotionID} value={p.promotionID}>
                    {p.title}
                  </option>
                ))}
              </select>

              {selectedPromotions.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedPromotions.map((p) => (
                    <div
                      key={p.promotionID}
                      className="flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {p.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePromotion(p.promotionID)}
                        className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-500"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Lịch trình chi tiết */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Lịch trình chi tiết
            </h2>
            <button
              type="button"
              onClick={handleAddItineraryRow}
              className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-medium border border-blue-200"
            >
              + Thêm ngày
            </button>
          </div>

          {errors.itineraries && (
            <p className="text-xs text-red-500">
              {errors.itineraries}
            </p>
          )}

          {itineraries.length === 0 ? (
            <p className="text-sm text-gray-500">
              Chưa có lịch trình, bấm “Thêm ngày” để bắt đầu.
            </p>
          ) : (
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2 w-20">Ngày</th>
                    <th className="px-4 py-2 w-64">Tiêu đề</th>
                    <th className="px-4 py-2">Mô tả</th>
                    <th className="px-4 py-2 w-20 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {itineraries.map((it, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-center font-semibold">
                        Ngày {index + 1}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={it.title}
                          onChange={handleItineraryChange(index, "title")}
                          placeholder="Ví dụ: Khởi hành - tham quan Hà Nội"
                          className={inputBase + " text-sm"}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <textarea
                          value={it.description}
                          onChange={handleItineraryChange(index, "description")}
                          placeholder="Mô tả chi tiết hoạt động trong ngày..."
                          className={inputBase + " text-sm min-h-[80px]"}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryRow(index)}
                          className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-500"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Mô tả tour */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-3 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Mô tả tour
          </h2>
          {errors.description && (
            <p className="text-xs text-red-500 mb-1">
              {errors.description}
            </p>
          )}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Điểm nổi bật, lịch trình tóm tắt, dịch vụ bao gồm"
            className={inputBase + " min-h-[160px] resize-y"}
          />
        </section>

        {/* Hình ảnh & trạng thái */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Hình ảnh & trạng thái
            </h2>
            {form.imageURL && !uploadingImage && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                Đã chọn ảnh bìa
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cột trái: upload + preview */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-600">
                Ảnh bìa tour
              </label>

              {errors.imageURL && (
                <p className="text-xs text-red-500">
                  {errors.imageURL}
                </p>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-sm text-gray-700
                   file:mr-3 file:py-2 file:px-4
                   file:rounded-xl file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-600
                   hover:file:bg-blue-100"
              />

              {uploadingImage && (
                <p className="text-xs text-gray-500">
                  Đang tải ảnh lên...
                </p>
              )}

              {form.imageURL && !uploadingImage && (
                <div className="mt-1">
                  <p className="text-xs text-gray-500 mb-1">
                    Xem trước ảnh bìa
                  </p>
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 group">
                    <img
                      src={resolveAssetUrl(form.imageURL)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 text-[10px] px-2 py-1 rounded-full bg-white/90 text-red-500 border border-red-200 opacity-0 group-hover:opacity-100 transition"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cột phải: trạng thái */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-600">
                Trạng thái tour
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputBase}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="PAUSE">Tạm dừng</option>
                <option value="SOLD_OUT">Hết chỗ</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-tour")}
            className="px-6 py-3 rounded-xl border border-gray-300 text-base text-gray-700"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-blue-600 text-base text-white font-semibold"
          >
            {isEdit ? "Lưu thay đổi" : "Tạo tour"}
          </button>
        </div>
      </form>
    </div>
  );
}

