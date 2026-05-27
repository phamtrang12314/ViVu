import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import type { UpdateProfileBody } from '../../../../apis/user.api'
import { schemaProfile, type SchemaProfile } from '../../../../utils/rules'
import { getProfile } from '../../../../apis/auth.api'
import userApi from '../../../../apis/user.api'
import { FaPencilAlt, FaSave, FaUserEdit } from 'react-icons/fa'

type FormData = SchemaProfile

export default function Profile() {
  const queryClient = useQueryClient()

  const { data: userData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getProfile()
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  // FIX LỖI: Cập nhật form values trong useEffect để tránh infinite re-render
  useEffect(() => {
    if (userData?.data) {
      setValue('name', userData.data.name || '')
      setValue('phoneNumber', userData.data.phoneNumber || '')
      setValue('address', userData.data.address || '')
      setValue('avatarUrl', userData.data.avatarURL || '')
    }
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

  const onSubmit = handleSubmit((data) => {
    const normalize = (value: string | null | undefined): string | undefined => {
      return value ? value.trim() : undefined
    }

    const payload: UpdateProfileBody = {
      name: normalize(data.name),
      phoneNumber: normalize(data.phoneNumber),
      address: normalize(data.address),
      avatarUrl: normalize(data.avatarUrl)
    }

    updateProfileMutation.mutate(payload)
  })

  const avatarPreview = watch('avatarUrl') || userData?.data.avatarURL || '/src/assets/user.png'

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FaUserEdit size={20} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Hồ Sơ Cá Nhân</h2>
        </div>
        <p className="text-gray-500 font-medium ml-13">
          Quản lý thông tin liên hệ và cá nhân của bạn.
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="flex flex-col items-center gap-4 rounded-[28px] border border-white bg-white/70 p-6 shadow-[0_14px_42px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:flex-row sm:items-end">
          <div className="relative">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
              onError={(event) => {
                event.currentTarget.src = '/src/assets/user.png'
              }}
            />
            <label
              htmlFor="avatarUrl"
              className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-white/72 text-blue-600 shadow-lg backdrop-blur-xl transition hover:bg-white"
              title="Đổi ảnh đại diện"
            >
              <FaPencilAlt size={15} />
            </label>
          </div>
          <div className="w-full flex-1">
            <label htmlFor="avatarUrl" className="block text-sm font-bold mb-2 text-gray-700 ml-1">
              Ảnh đại diện
            </label>
            <input
              type="url"
              id="avatarUrl"
              {...register('avatarUrl')}
              className="w-full px-5 py-4 bg-white/58 border border-white rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
              placeholder="Dán URL ảnh đại diện mới"
            />
            {errors.avatarUrl && (
              <p className="mt-2 text-sm text-red-500 ml-1 font-medium">{errors.avatarUrl.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-bold mb-2 text-gray-700 ml-1">
              Email đăng nhập (Không thể thay đổi)
            </label>
            <input
              type="email"
              id="email"
              defaultValue={userData?.data.email}
              disabled
              className="w-full px-5 py-4 bg-gray-100 border border-transparent rounded-2xl text-gray-500 font-medium cursor-not-allowed"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-bold mb-2 text-gray-700 ml-1">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 ${errors.name ? 'ring-2 ring-red-500/50 bg-white' : ''}`}
              placeholder="Nhập họ và tên của bạn"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500 ml-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-bold mb-2 text-gray-700 ml-1"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              id="phoneNumber"
              {...register('phoneNumber')}
              className={`w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 ${errors.phoneNumber ? 'ring-2 ring-red-500/50 bg-white' : ''}`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-500 ml-1 font-medium">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-bold mb-2 text-gray-700 ml-1">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              {...register('address')}
              className={`w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 ${errors.address ? 'ring-2 ring-red-500/50 bg-white' : ''}`}
              placeholder="Nhập địa chỉ cư trú"
            />
            {errors.address && (
              <p className="mt-2 text-sm text-red-500 ml-1 font-medium">{errors.address.message}</p>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 mt-8">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 disabled:opacity-70"
          >
            {updateProfileMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              <>
                <FaSave size={18} />
                Lưu Thay Đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

