import React, { useEffect, useMemo, useState } from 'react'
import Select, { components, type MultiValue, type OptionProps } from 'react-select'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarPlus, Plus, Trash2 } from 'lucide-react'
import { destinationAdminApi } from '../../apis/destinationAdmin.api'
import { promotionAdminApi } from '../../apis/promotionAdmin.api'
import { tourAdminApi } from '../../apis/tourAdmin.api'
import { tourTypeApi } from '../../../apis/tourType.api'
import { resolveAssetUrl } from '../../../utils/utils'
import type { TourDetailAdmin } from '../../types/tourAdmin'

type TourType = {
  tourTypeID: string
  nameType: string
}

type DestinationOption = {
  value: string
  label: string
  region: string
}

type PromotionOption = {
  value: string
  label: string
}

type DayPlan = {
  dayNumber: number
  title: string
  note: string
  activities: string[]
}

type TourForm = {
  title: string
  description: string
  tourTypeId: string
  durationDays: number | ''
  durationNights: number | ''
  priceAdult: number | ''
  priceChild: number | ''
  minGuests: number | ''
  maxGuests: number | ''
  status: 'ACTIVE' | 'PAUSE' | 'SOLD_OUT'
  imageURL: string
}

type FormErrors = Partial<Record<keyof TourForm, string>> & {
  destinationIds?: string
  promotionIds?: string
  openDates?: string
  itineraries?: string
  galleryImages?: string
  form?: string
}

const inputBase =
  'w-full border border-gray-300 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

const toDateInput = (value: string) => value.slice(0, 10)

const parseVND = (raw: string): number | '' => {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  return Number(digits)
}

const formatVND = (value: number | '') => {
  if (value === '') return ''
  return Number(value).toLocaleString('vi-VN')
}

const CheckboxOption = (props: OptionProps<any, true>) => (
  <components.Option {...props}>
    <div className='flex items-center gap-2'>
      <input type='checkbox' readOnly checked={props.isSelected} />
      <span>{props.label}</span>
    </div>
  </components.Option>
)

export default function FormTourScreen() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<TourForm>({
    title: '',
    description: '',
    tourTypeId: '',
    durationDays: '',
    durationNights: '',
    priceAdult: '',
    priceChild: '',
    minGuests: '',
    maxGuests: '',
    status: 'ACTIVE',
    imageURL: ''
  })

  const [selectedDestinations, setSelectedDestinations] = useState<DestinationOption[]>([])
  const [selectedPromotions, setSelectedPromotions] = useState<PromotionOption[]>([])
  const [openDates, setOpenDates] = useState<string[]>([''])
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([
    { dayNumber: 1, title: '', note: '', activities: [''] }
  ])
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const { data: tourTypes = [], isLoading: loadingTypes } = useQuery<TourType[]>({
    queryKey: ['tourTypes'],
    queryFn: () => tourTypeApi.getTourTypes().then((res) => res.data)
  })

  const { data: destinationsRaw = [] } = useQuery({
    queryKey: ['admin-destinations-tour-all'],
    queryFn: () => destinationAdminApi.getDestinationsForTour().then((res) => res.data)
  })

  const { data: promotionsRaw = [] } = useQuery({
    queryKey: ['admin-promotions-simple'],
    queryFn: () => promotionAdminApi.getSimplePromotions().then((res) => res.data)
  })

  const { data: tourDetail } = useQuery<TourDetailAdmin>({
    queryKey: ['tour-detail', id],
    enabled: isEdit && !!id,
    queryFn: () => tourAdminApi.getTourById(id as string).then((res) => res.data)
  })

  useEffect(() => {
    if (!tourDetail) return
    const detail = tourDetail
      setForm({
        title: detail.title || '',
        description: detail.description || '',
        tourTypeId: detail.tourType?.id || '',
        durationDays: detail.durationDays ?? '',
        durationNights: detail.durationNights ?? '',
        priceAdult: detail.priceAdult ?? '',
        priceChild: detail.priceChild ?? '',
        minGuests: detail.minParticipants ?? '',
        maxGuests: detail.maxParticipants ?? '',
        status: (detail.status as TourForm['status']) || 'ACTIVE',
        imageURL: detail.imageURL || ''
      })

      const mappedDestinations = (detail.tourDestinations || [])
        .map((item) => item.destination)
        .filter(Boolean)
        .map((destination) => ({
          value: destination!.id,
          label: destination!.nameDes,
          region: destination!.region
        }))
      setSelectedDestinations(mappedDestinations)

      const mappedPromotions = (detail.promotions || []).map((promotion) => ({
        value: promotion.promotionID,
        label: promotion.title
      }))
      setSelectedPromotions(mappedPromotions)

      const normalizedOpenDates = (detail.openDates && detail.openDates.length > 0 ? detail.openDates : [detail.startDate])
        .filter(Boolean)
        .map(toDateInput)
      setOpenDates(normalizedOpenDates.length > 0 ? normalizedOpenDates : [''])

      const mappedDayPlans = (detail.itineraries || [])
        .sort((a, b) => a.dayNumber - b.dayNumber)
        .map((itinerary, index) => {
          const lines = (itinerary.description || '').split('\n').map((line) => line.trim()).filter(Boolean)
          const activities: string[] = []
          const notes: string[] = []
          for (const line of lines) {
            if (/^\d+\./.test(line)) activities.push(line.replace(/^\d+\.\s*/, ''))
            else notes.push(line)
          }
          return {
            dayNumber: index + 1,
            title: itinerary.title || '',
            note: notes.join('\n'),
            activities: activities.length > 0 ? activities : ['']
          }
        })
      setDayPlans(mappedDayPlans.length > 0 ? mappedDayPlans : [{ dayNumber: 1, title: '', note: '', activities: [''] }])

      const incomingImages = (detail.tourImages || []).map((image) => image.url).filter(Boolean)
      const filtered = incomingImages.filter((url) => url !== detail.imageURL)
      setGalleryImages(filtered)
  }, [tourDetail])

  const destinationOptions: DestinationOption[] = useMemo(
    () =>
      destinationsRaw.map((destination: any) => ({
        value: destination.destinationID,
        label: destination.nameDes,
        region: destination.region
      })),
    [destinationsRaw]
  )

  const promotionOptions: PromotionOption[] = useMemo(
    () =>
      promotionsRaw.map((promotion: any) => ({
        value: promotion.promotionID,
        label: promotion.title
      })),
    [promotionsRaw]
  )

  const uniqueDestinationCount = destinationOptions.length

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    const priceFields = ['priceAdult', 'priceChild']
    const numericFields = ['durationDays', 'durationNights', 'minGuests', 'maxGuests']

    if (priceFields.includes(name)) {
      setForm((prev) => ({ ...prev, [name]: parseVND(value) }))
    } else if (numericFields.includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  const handleUploadCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setUploadingCover(true)
      const response = await tourAdminApi.uploadTourImage(file)
      setForm((prev) => ({ ...prev, imageURL: response.data.url }))
      setErrors((prev) => ({ ...prev, imageURL: undefined, form: undefined }))
    } catch {
      setErrors((prev) => ({ ...prev, imageURL: 'Upload ảnh bìa thất bại.' }))
    } finally {
      setUploadingCover(false)
      event.target.value = ''
    }
  }

  const handleUploadGallery = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return
    try {
      setUploadingGallery(true)
      const uploaded: string[] = []
      for (const file of files) {
        const response = await tourAdminApi.uploadTourImage(file)
        uploaded.push(response.data.url)
      }
      setGalleryImages((prev) => Array.from(new Set([...prev, ...uploaded])))
      setErrors((prev) => ({ ...prev, galleryImages: undefined, form: undefined }))
    } catch {
      setErrors((prev) => ({ ...prev, galleryImages: 'Upload ảnh chi tiết thất bại.' }))
    } finally {
      setUploadingGallery(false)
      event.target.value = ''
    }
  }

  const addOpenDate = () => setOpenDates((prev) => [...prev, ''])

  const updateOpenDate = (index: number, value: string) => {
    setOpenDates((prev) => prev.map((item, idx) => (idx === index ? value : item)))
  }

  const removeOpenDate = (index: number) => {
    setOpenDates((prev) => {
      if (prev.length === 1) return prev
      return prev.filter((_, idx) => idx !== index)
    })
  }

  const addDay = () => {
    setDayPlans((prev) => [...prev, { dayNumber: prev.length + 1, title: '', note: '', activities: [''] }])
  }

  const removeDay = (index: number) => {
    setDayPlans((prev) =>
      prev
        .filter((_, idx) => idx !== index)
        .map((item, idx) => ({ ...item, dayNumber: idx + 1 }))
    )
  }

  const updateDayField = (index: number, field: 'title' | 'note', value: string) => {
    setDayPlans((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)))
  }

  const addActivity = (dayIndex: number) => {
    setDayPlans((prev) =>
      prev.map((item, idx) => (idx === dayIndex ? { ...item, activities: [...item.activities, ''] } : item))
    )
  }

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    setDayPlans((prev) =>
      prev.map((item, idx) =>
        idx === dayIndex
          ? {
              ...item,
              activities: item.activities.map((activity, actIdx) => (actIdx === activityIndex ? value : activity))
            }
          : item
      )
    )
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setDayPlans((prev) =>
      prev.map((item, idx) => {
        if (idx !== dayIndex) return item
        if (item.activities.length === 1) return item
        return { ...item, activities: item.activities.filter((_, actIdx) => actIdx !== activityIndex) }
      })
    )
  }

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {}

    if (!form.title.trim()) nextErrors.title = 'Vui lòng nhập tên tour'
    if (!form.description.trim()) nextErrors.description = 'Vui lòng nhập mô tả tour'
    if (!form.tourTypeId) nextErrors.tourTypeId = 'Vui lòng chọn loại tour'
    if (form.durationDays === '' || Number(form.durationDays) <= 0) nextErrors.durationDays = 'Số ngày phải lớn hơn 0'
    if (form.durationNights === '' || Number(form.durationNights) < 0) nextErrors.durationNights = 'Số đêm phải từ 0'
    if (form.priceAdult === '' || Number(form.priceAdult) <= 0) nextErrors.priceAdult = 'Giá người lớn phải lớn hơn 0'
    if (form.priceChild === '' || Number(form.priceChild) <= 0) nextErrors.priceChild = 'Giá trẻ em phải lớn hơn 0'
    if (form.minGuests === '' || Number(form.minGuests) <= 0) nextErrors.minGuests = 'Số khách tối thiểu phải lớn hơn 0'
    if (form.maxGuests === '' || Number(form.maxGuests) <= 0) nextErrors.maxGuests = 'Số khách tối đa phải lớn hơn 0'
    if (form.minGuests !== '' && form.maxGuests !== '' && Number(form.maxGuests) < Number(form.minGuests)) {
      nextErrors.maxGuests = 'Số khách tối đa phải lớn hơn hoặc bằng tối thiểu'
    }
    if (!form.imageURL) nextErrors.imageURL = 'Vui lòng chọn ảnh bìa'
    if (galleryImages.length < 2) nextErrors.galleryImages = 'Cần thêm tối thiểu 2 ảnh chi tiết'
    if (selectedDestinations.length === 0) nextErrors.destinationIds = 'Vui lòng chọn ít nhất 1 địa điểm du lịch'
    if (openDates.filter(Boolean).length === 0) nextErrors.openDates = 'Vui lòng thêm ít nhất 1 ngày mở bán'

    const hasValidItinerary = dayPlans.every((day) => {
      const hasTitle = day.title.trim().length > 0
      const hasActivities = day.activities.some((activity) => activity.trim().length > 0)
      return hasTitle && hasActivities
    })
    if (!hasValidItinerary) {
      nextErrors.itineraries = 'Mỗi ngày cần có tiêu đề và ít nhất 1 hoạt động'
    }

    return nextErrors
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const normalizedOpenDates = openDates.filter(Boolean).sort()
    const startDate = normalizedOpenDates[0]
    const endDate = normalizedOpenDates[normalizedOpenDates.length - 1]

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      startDate,
      endDate,
      durationDays: Number(form.durationDays),
      durationNights: Number(form.durationNights),
      priceAdult: Number(form.priceAdult),
      priceChild: Number(form.priceChild),
      minGuests: Number(form.minGuests),
      maxGuests: Number(form.maxGuests),
      imageURL: form.imageURL,
      status: form.status,
      tourTypeId: form.tourTypeId,
      destinationIds: selectedDestinations.map((item) => item.value),
      promotionIds: selectedPromotions.map((item) => item.value),
      imageUrls: Array.from(new Set([form.imageURL, ...galleryImages])),
      openDates: normalizedOpenDates,
      itineraries: dayPlans.map((day, dayIndex) => {
        const activities = day.activities
          .map((activity) => activity.trim())
          .filter(Boolean)
          .map((activity, index) => `${index + 1}. ${activity}`)
        const description = [...activities, day.note.trim()].filter(Boolean).join('\n')
        return {
          dayNumber: dayIndex + 1,
          title: day.title.trim(),
          description
        }
      })
    }

    try {
      if (isEdit && id) {
        await tourAdminApi.updateTour(id, payload)
      } else {
        await tourAdminApi.createTour(payload)
      }
      navigate('/admin/manage-tour')
    } catch {
      setErrors((prev) => ({ ...prev, form: 'Lưu tour thất bại. Vui lòng kiểm tra dữ liệu và thử lại.' }))
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mb-7 flex items-center gap-3'>
        <button
          onClick={() => navigate('/admin/manage-tour')}
          className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50'
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>{isEdit ? 'Chỉnh sửa tour' : 'Thêm tour mới'}</h1>
          <p className='text-gray-500'>Cập nhật thông tin đầy đủ để hiển thị nhất quán ở trang khách hàng.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {errors.form && <div className='rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600'>{errors.form}</div>}

        <section className='space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-gray-800'>Thông tin cơ bản</h2>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Tên tour</label>
              {errors.title && <p className='mb-1 text-xs text-red-500'>{errors.title}</p>}
              <input className={inputBase} name='title' value={form.title} onChange={handleChange} />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Loại tour</label>
              {errors.tourTypeId && <p className='mb-1 text-xs text-red-500'>{errors.tourTypeId}</p>}
              <select className={inputBase} name='tourTypeId' value={form.tourTypeId} onChange={handleChange}>
                <option value=''>{loadingTypes ? 'Đang tải...' : 'Chọn loại tour'}</option>
                {tourTypes.map((tourType) => (
                  <option key={tourType.tourTypeID} value={tourType.tourTypeID}>
                    {tourType.nameType}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-600'>Mô tả tour</label>
            {errors.description && <p className='mb-1 text-xs text-red-500'>{errors.description}</p>}
            <textarea
              className={`${inputBase} min-h-[120px] resize-y`}
              name='description'
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className='space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-gray-800'>Thời lượng và sức chứa</h2>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-4'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Số ngày</label>
              {errors.durationDays && <p className='mb-1 text-xs text-red-500'>{errors.durationDays}</p>}
              <input className={inputBase} type='number' min={1} name='durationDays' value={form.durationDays} onChange={handleChange} />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Số đêm</label>
              {errors.durationNights && <p className='mb-1 text-xs text-red-500'>{errors.durationNights}</p>}
              <input className={inputBase} type='number' min={0} name='durationNights' value={form.durationNights} onChange={handleChange} />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Khách tối thiểu</label>
              {errors.minGuests && <p className='mb-1 text-xs text-red-500'>{errors.minGuests}</p>}
              <input className={inputBase} type='number' min={1} name='minGuests' value={form.minGuests} onChange={handleChange} />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Khách tối đa</label>
              {errors.maxGuests && <p className='mb-1 text-xs text-red-500'>{errors.maxGuests}</p>}
              <input className={inputBase} type='number' min={1} name='maxGuests' value={form.maxGuests} onChange={handleChange} />
            </div>
          </div>
        </section>

        <section className='space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-gray-800'>Giá và trạng thái</h2>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Giá người lớn (VNĐ)</label>
              {errors.priceAdult && <p className='mb-1 text-xs text-red-500'>{errors.priceAdult}</p>}
              <input
                className={inputBase}
                name='priceAdult'
                value={formatVND(form.priceAdult)}
                onChange={handleChange}
                inputMode='numeric'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Giá trẻ em (VNĐ)</label>
              {errors.priceChild && <p className='mb-1 text-xs text-red-500'>{errors.priceChild}</p>}
              <input
                className={inputBase}
                name='priceChild'
                value={formatVND(form.priceChild)}
                onChange={handleChange}
                inputMode='numeric'
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Trạng thái</label>
              <select className={inputBase} name='status' value={form.status} onChange={handleChange}>
                <option value='ACTIVE'>Đang hoạt động</option>
                <option value='PAUSE'>Tạm dừng</option>
                <option value='SOLD_OUT'>Hết chỗ</option>
              </select>
            </div>
          </div>
        </section>

        <section className='space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-gray-800'>Địa điểm du lịch và khuyến mãi</h2>
          <p className='text-xs text-gray-500'>Đã có {uniqueDestinationCount} địa điểm trong hệ thống. Có thể chọn nhiều địa điểm cho một tour.</p>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Địa điểm du lịch</label>
              {errors.destinationIds && <p className='mb-1 text-xs text-red-500'>{errors.destinationIds}</p>}
              <Select
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                options={destinationOptions}
                value={selectedDestinations}
                onChange={(value) => setSelectedDestinations(value as DestinationOption[])}
                components={{ Option: CheckboxOption }}
                placeholder='Chọn một hoặc nhiều địa điểm'
                classNamePrefix='react-select'
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Khuyến mãi áp dụng</label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                options={promotionOptions}
                value={selectedPromotions}
                onChange={(value: MultiValue<PromotionOption>) => setSelectedPromotions([...value])}
                components={{ Option: CheckboxOption }}
                placeholder='Chọn một hoặc nhiều khuyến mãi'
                classNamePrefix='react-select'
              />
            </div>
          </div>
        </section>

        <section className='space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-800'>Ngày mở bán tour</h2>
            <button
              type='button'
              onClick={addOpenDate}
              className='inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700'
            >
              <CalendarPlus size={14} /> Thêm ngày
            </button>
          </div>
          {errors.openDates && <p className='text-xs text-red-500'>{errors.openDates}</p>}
          <div className='space-y-2'>
            {openDates.map((openDate, index) => (
              <div key={`${openDate}-${index}`} className='flex items-center gap-2'>
                <input
                  type='date'
                  value={openDate}
                  onChange={(event) => updateOpenDate(index, event.target.value)}
                  className={inputBase}
                />
                <button
                  type='button'
                  onClick={() => removeOpenDate(index)}
                  className='rounded-lg border border-red-200 p-2 text-red-500'
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className='space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-800'>Lịch trình chi tiết</h2>
            <button
              type='button'
              onClick={addDay}
              className='inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700'
            >
              <Plus size={14} /> Thêm ngày
            </button>
          </div>
          {errors.itineraries && <p className='text-xs text-red-500'>{errors.itineraries}</p>}
          <div className='space-y-4'>
            {dayPlans.map((day, dayIndex) => (
              <div key={dayIndex} className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <p className='font-semibold text-slate-800'>Ngày {dayIndex + 1}</p>
                  <button
                    type='button'
                    onClick={() => removeDay(dayIndex)}
                    className='inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600'
                    disabled={dayPlans.length === 1}
                  >
                    <Trash2 size={12} /> Xóa ngày
                  </button>
                </div>
                <div className='grid grid-cols-1 gap-3'>
                  <input
                    className={inputBase}
                    value={day.title}
                    onChange={(event) => updateDayField(dayIndex, 'title', event.target.value)}
                    placeholder='Tiêu đề ngày'
                  />
                  <textarea
                    className={`${inputBase} min-h-[70px]`}
                    value={day.note}
                    onChange={(event) => updateDayField(dayIndex, 'note', event.target.value)}
                    placeholder='Mô tả thêm cho ngày này'
                  />
                  <div className='space-y-2 rounded-xl border border-slate-200 bg-white p-3'>
                    <div className='mb-1 flex items-center justify-between'>
                      <p className='text-sm font-semibold text-slate-700'>Hoạt động trong ngày</p>
                      <button
                        type='button'
                        onClick={() => addActivity(dayIndex)}
                        className='inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700'
                      >
                        <Plus size={12} /> Thêm hoạt động
                      </button>
                    </div>
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className='flex items-center gap-2'>
                        <input
                          className={inputBase}
                          value={activity}
                          onChange={(event) => updateActivity(dayIndex, activityIndex, event.target.value)}
                          placeholder={`Hoạt động ${activityIndex + 1}`}
                        />
                        <button
                          type='button'
                          onClick={() => removeActivity(dayIndex, activityIndex)}
                          className='rounded-lg border border-red-200 p-2 text-red-500'
                          disabled={day.activities.length === 1}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-semibold text-gray-800'>Hình ảnh tour</h2>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Ảnh bìa</label>
              {errors.imageURL && <p className='mb-1 text-xs text-red-500'>{errors.imageURL}</p>}
              <input
                type='file'
                accept='image/*'
                onChange={handleUploadCover}
                className='block w-full text-sm text-gray-700 file:mr-3 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-600 hover:file:bg-blue-100'
              />
              {uploadingCover && <p className='mt-1 text-xs text-gray-500'>Đang tải ảnh bìa...</p>}
              {form.imageURL && (
                <div className='mt-2 h-40 overflow-hidden rounded-xl border border-slate-200'>
                  <img src={resolveAssetUrl(form.imageURL)} alt='cover' className='h-full w-full object-cover' />
                </div>
              )}
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>Ảnh chi tiết (tối thiểu 2 ảnh)</label>
              {errors.galleryImages && <p className='mb-1 text-xs text-red-500'>{errors.galleryImages}</p>}
              <input
                type='file'
                accept='image/*'
                multiple
                onChange={handleUploadGallery}
                className='block w-full text-sm text-gray-700 file:mr-3 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-600 hover:file:bg-blue-100'
              />
              {uploadingGallery && <p className='mt-1 text-xs text-gray-500'>Đang tải ảnh chi tiết...</p>}
              <div className='mt-2 grid grid-cols-3 gap-2'>
                {galleryImages.map((url, index) => (
                  <div key={`${url}-${index}`} className='relative overflow-hidden rounded-xl border border-slate-200'>
                    <img src={resolveAssetUrl(url)} alt={`gallery-${index + 1}`} className='h-24 w-full object-cover' />
                    <button
                      type='button'
                      onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== index))}
                      className='absolute right-1 top-1 rounded bg-white/90 px-2 py-1 text-[10px] text-red-600'
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={() => navigate('/admin/manage-tour')}
            className='rounded-xl border border-gray-300 px-6 py-3 text-base text-gray-700'
          >
            Hủy
          </button>
          <button type='submit' className='rounded-xl bg-blue-600 px-7 py-3 text-base font-semibold text-white'>
            {isEdit ? 'Lưu thay đổi' : 'Tạo tour'}
          </button>
        </div>
      </form>
    </div>
  )
}
