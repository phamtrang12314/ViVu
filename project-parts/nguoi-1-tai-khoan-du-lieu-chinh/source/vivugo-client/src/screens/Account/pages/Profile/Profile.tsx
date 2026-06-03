import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { FaSave, FaUserEdit, FaUpload } from 'react-icons/fa'
import type { UpdateProfileBody } from '../../../../apis/user.api'
import userApi from '../../../../apis/user.api'
import { getProfile } from '../../../../apis/auth.api'
import { schemaProfile, type SchemaProfile } from '../../../../utils/rules'
import { resolveAssetUrl } from '../../../../utils/utils'

type FormData = SchemaProfile

export default function Profile() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)

  const { data: userData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getProfile()
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schemaProfile) as any,
    defaultValues: {
      name: '',
      phoneNumber: '',
      address: '',
      avatarUrl: ''
    }
  })

  useEffect(() => {
    if (!userData?.data) return
    setValue('name', userData.data.name || '')
    setValue('phoneNumber', userData.data.phoneNumber || '')
    setValue('address', userData.data.address || '')
    setValue('avatarUrl', userData.data.avatarURL || '')
    setSelectedAvatar(userData.data.avatarURL || null)
  }, [userData, setValue])

  const updateProfileMutation = useMutation({
    mutationFn: (body: UpdateProfileBody) => userApi.updateProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Cập nhật hồ sơ thành công!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra trong quá trình cập nhật.')
    }
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      const avatarUrl = response.data.avatarURL
      setValue('avatarUrl', avatarUrl || '')
      setSelectedAvatar(avatarUrl || null)
      toast.success('Cập nhật ảnh đại diện thành công!')
    },
    onError: () => {
      toast.error('Tải ảnh thất bại, vui lòng thử lại.')
    }
  })

  const onSubmit = handleSubmit((data) => {
    const normalize = (value: string | null | undefined): string | undefined => {
      const trimmed = value ? value.trim() : ''
      return trimmed.length > 0 ? trimmed : undefined
    }

    const payload: UpdateProfileBody = {
      name: normalize(data.name),
      phoneNumber: normalize(data.phoneNumber),
      address: normalize(data.address),
      avatarUrl: normalize(selectedAvatar || data.avatarUrl)
    }

    updateProfileMutation.mutate(payload)
  })

  const avatarPreview = useMemo(() => {
    return resolveAssetUrl(selectedAvatar || userData?.data.avatarURL, '/uifaces-human-avatar.jpg')
  }, [selectedAvatar, userData?.data.avatarURL])

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      toast.error('Vui lòng chọn tệp ảnh hợp lệ.')
      return
    }

    uploadAvatarMutation.mutate(file)
    event.target.value = ''
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FaUserEdit size={20} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Hồ Sơ Cá Nhân</h2>
        </div>
        <p className="ml-13 font-medium text-gray-500">Quản lý thông tin liên hệ và cá nhân của bạn.</p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="rounded-[28px] border border-white bg-white/70 p-6 shadow-[0_14px_42px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <img
              src={avatarPreview}
              alt="Ảnh đại diện"
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <div className="flex-1 space-y-3">
              <p className="text-sm font-bold text-gray-700">Ảnh đại diện</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
                >
                  <FaUpload size={14} />
                  Chọn ảnh mới
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="profileId" className="mb-2 ml-1 block text-sm font-bold text-gray-700">
              Mã hồ sơ (Không thể thay đổi)
            </label>
            <input
              id="profileId"
              value={userData?.data.userID || ''}
              disabled
              className="w-full cursor-not-allowed rounded-2xl border border-transparent bg-gray-100 px-5 py-4 font-medium text-gray-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className="mb-2 ml-1 block text-sm font-bold text-gray-700">
              Email đăng nhập (Không thể thay đổi)
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                id="email"
                value={userData?.data.email || ''}
                disabled
                className="w-full cursor-not-allowed rounded-2xl border border-transparent bg-gray-100 px-5 py-4 font-medium text-gray-500"
              />
              <Link
                to="/account/password"
                className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
              >
                Đổi mật khẩu
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="name" className="mb-2 ml-1 block text-sm font-bold text-gray-700">
              Tên khách hàng
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-4 font-medium text-gray-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/50 ${
                errors.name ? 'bg-white ring-2 ring-red-500/50' : ''
              }`}
              placeholder="Nhập tên của bạn"
            />
            {errors.name && <p className="ml-1 mt-2 text-sm font-medium text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="mb-2 ml-1 block text-sm font-bold text-gray-700">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phoneNumber"
              {...register('phoneNumber')}
              className={`w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-4 font-medium text-gray-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/50 ${
                errors.phoneNumber ? 'bg-white ring-2 ring-red-500/50' : ''
              }`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phoneNumber && <p className="ml-1 mt-2 text-sm font-medium text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label htmlFor="address" className="mb-2 ml-1 block text-sm font-bold text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              {...register('address')}
              className={`w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-4 font-medium text-gray-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/50 ${
                errors.address ? 'bg-white ring-2 ring-red-500/50' : ''
              }`}
              placeholder="Nhập địa chỉ cư trú"
            />
            {errors.address && <p className="ml-1 mt-2 text-sm font-medium text-red-500">{errors.address.message}</p>}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending || uploadAvatarMutation.isPending}
            className="ml-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 font-bold text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95 disabled:opacity-70 sm:w-auto"
          >
            <FaSave size={18} />
            {updateProfileMutation.isPending ? 'Đang xử lý...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  )
}
