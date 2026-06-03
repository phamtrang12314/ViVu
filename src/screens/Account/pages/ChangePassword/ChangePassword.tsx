import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { FaKey, FaShieldAlt } from 'react-icons/fa'
import userApi from '../../../../apis/user.api'
import PasswordStrengthMeter from '../../../../components/PasswordStrengthMeter'

const passwordSchema = yup.object({
  oldPassword: yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
    .max(160, 'Mật khẩu mới không được vượt quá 160 ký tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
})

type PasswordFormData = yup.InferType<typeof passwordSchema>

function getErrorMessage(error: unknown, fallback: string) {
  const maybeAxiosError = error as { response?: { data?: string | { message?: string } } }
  const data = maybeAxiosError.response?.data
  if (typeof data === 'string') return data
  return data?.message || fallback
}

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema)
  })

  const newPassword = watch('newPassword')

  const onSubmit = handleSubmit(async (data) => {
    try {
      await userApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      })
      toast.success('Đổi mật khẩu thành công!')
      reset()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra.'))
    }
  })

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <FaShieldAlt size={20} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Bảo mật tài khoản</h2>
        </div>
        <p className="text-gray-500 font-medium ml-13">
          Đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn.
        </p>
      </div>

      <div className="bg-slate-50/70 p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Mật khẩu hiện tại
            </label>
            <input
              {...register('oldPassword')}
              type="password"
              autoComplete="current-password"
              className="w-full px-5 py-4 bg-white border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 shadow-sm"
              placeholder="********"
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-medium">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div className="border-t border-gray-200/60 my-6"></div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Mật khẩu mới</label>
            <input
              {...register('newPassword')}
              type="password"
              autoComplete="new-password"
              className="w-full px-5 py-4 bg-white border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 shadow-sm"
              placeholder="********"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-medium">
                {errors.newPassword.message}
              </p>
            )}
            <PasswordStrengthMeter password={newPassword} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              className="w-full px-5 py-4 bg-white border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 shadow-sm"
              placeholder="********"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:bg-blue-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <FaKey />
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
