import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { destinationAdminApi } from '../../apis/destinationAdmin.api'
import type { DestinationSave, DestinationDetailAdmin } from '../../types/destinationAdmin'
import { ArrowLeft } from 'lucide-react'
import { resolveAssetUrl } from '../../../utils/utils'

const inputBase =
  'w-full border border-gray-300 rounded-xl px-3 py-3 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

const REGION_OPTIONS = [
  { value: 'Miền Bắc', label: 'Miền Bắc' },
  { value: 'Miền Trung', label: 'Miền Trung' },
  { value: 'Miền Nam', label: 'Miền Nam' }
]

type FormErrors = {
  [k: string]: string | undefined
}

const DestinationFormScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const { data: detail, isLoading } = useQuery({
    queryKey: ['admin-destination-detail', id],
    enabled: isEdit,
    queryFn: async () => {
      if (!id) throw new Error('missing id')
      const res = await destinationAdminApi.getDestinationById(id)
      return res.data
    }
  })

  const [form, setForm] = useState<DestinationSave>({
    nameDes: '',
    region: '',
    location: '',
    country: '',
    imageUrls: []
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [uploading, setUploading] = useState(false)

  // fill khi edit
  useEffect(() => {
    if (!detail) return
    const d = detail as DestinationDetailAdmin
    setForm({
      nameDes: d.nameDes || '',
      region: d.region || '',
      location: d.location || '',
      country: d.country || '',
      imageUrls: d.images || []
    })
    setErrors({})
  }, [detail])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }))
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const res = await destinationAdminApi.uploadDestinationImage(file)
      const url = res.data.url
      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, url]
      }))
      setErrors((prev) => ({ ...prev, imageUrls: undefined }))
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: 'Upload ảnh thất bại. Thử lại.'
      }))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleRemoveImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((u) => u !== url)
    }))
  }

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.nameDes.trim()) e.nameDes = 'Không được để trống'
    if (!form.region) e.region = 'Chọn khu vực'
    if (!form.location.trim()) e.location = 'Không được để trống'
    if (!form.country.trim()) e.country = 'Không được để trống'
    if (form.imageUrls.length === 0) e.imageUrls = 'Thêm ít nhất 1 ảnh để hiển thị'
    return e
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const v = validate()
    if (Object.keys(v).length) {
      setErrors(v)
      return
    }

    try {
      if (isEdit && id) {
        await destinationAdminApi.updateDestination(id, form)
      } else {
        await destinationAdminApi.createDestination(form)
      }
      navigate('/admin/manage-destination')
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: 'Lưu không thành công. Kiểm tra lại dữ liệu.'
      }))
    }
  }

  if (isEdit && isLoading) {
    return <div className="p-8 text-sm">Đang tải dữ liệu điểm đến...</div>
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-sm">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/manage-destination')}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-gray-50 border border-gray-200"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý thông tin và hình ảnh điểm đến trong hệ thống.
          </p>
        </div>
      </div>

      {errors.form && <div className="mb-4 text-xs text-red-500">{errors.form}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin điểm đến */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Thông tin điểm đến</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tên điểm đến</label>
              {errors.nameDes && <p className="text-[10px] text-red-500 mb-1">{errors.nameDes}</p>}
              <input
                name="nameDes"
                value={form.nameDes}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Quốc gia</label>
              {errors.country && <p className="text-[10px] text-red-500 mb-1">{errors.country}</p>}
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className={inputBase}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tỉnh/Thành phố</label>
              {errors.location && (
                <p className="text-[10px] text-red-500 mb-1">{errors.location}</p>
              )}
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Khu vực</label>
              {errors.region && <p className="text-[10px] text-red-500 mb-1">{errors.region}</p>}
              <select
                name="region"
                value={form.region}
                onChange={handleChange}
                className={inputBase}
              >
                <option value="">Chọn khu vực</option>
                {REGION_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Hình ảnh */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">Hình ảnh điểm đến</h2>
            {errors.imageUrls && <p className="text-[10px] text-red-500">{errors.imageUrls}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Thêm ảnh (upload)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="block w-full text-xs text-gray-700
                  file:mr-3 file:py-2 file:px-4
                  file:rounded-xl file:border-0
                  file:text-xs file:font-semibold
                  file:bg-blue-50 file:text-blue-600
                  hover:file:bg-blue-100"
              />
              {uploading && <p className="text-[10px] text-gray-500 mt-1">Đang tải ảnh lên...</p>}
            </div>
          </div>

          {form.imageUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-gray-500 mb-2">
                Ảnh đang sử dụng (ảnh đầu tiên sẽ làm ảnh bìa).
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {form.imageUrls.map((url, idx) => (
                  <div
                    key={url + idx}
                    className="relative group w-full h-24 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50"
                  >
                    <img src={resolveAssetUrl(url)} alt={`img-${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(url)}
                      className="absolute top-1 right-1 text-[9px] px-2 py-1 rounded-full bg-white/90 text-red-500 border border-red-200 opacity-0 group-hover:opacity-100 transition"
                    >
                      Xóa
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 text-[8px] px-2 py-0.5 rounded-full bg-blue-600 text-white">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/manage-destination')}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-700"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-xs text-white font-semibold"
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo điểm đến'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DestinationFormScreen

