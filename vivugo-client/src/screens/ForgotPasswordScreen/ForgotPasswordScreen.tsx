import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaCheckCircle, FaKey, FaPaperPlane } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { requestForgotPasswordOtp, resetPassword } from '../../apis/auth.api'
import Input from '../../components/Input'
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter'

const forgotPasswordSchema = yup.object({
  email: yup.string().required('Email là bắt buộc').email('Email không đúng định dạng'),
  otpCode: yup.string().required('Mã OTP là bắt buộc').matches(/^[0-9]{6}$/, 'Mã OTP gồm 6 chữ số'),
  newPassword: yup
    .string()
    .required('Mật khẩu mới là bắt buộc')
    .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
    .max(160, 'Mật khẩu mới không được vượt quá 160 ký tự'),
  confirmPassword: yup
    .string()
    .required('Xác nhận mật khẩu mới là bắt buộc')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
})

type ForgotPasswordForm = yup.InferType<typeof forgotPasswordSchema>

function getErrorMessage(error: unknown, fallback: string) {
  const maybeAxiosError = error as { response?: { data?: { message?: string } } }
  if (!maybeAxiosError.response) {
    return 'Không kết nối được máy chủ. Vui lòng kiểm tra backend cổng 8081.'
  }
  return maybeAxiosError.response?.data?.message || fallback
}

export default function ForgotPasswordScreen() {
  const [otpSent, setOtpSent] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors }
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      otpCode: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const email = watch('email')
  const newPassword = watch('newPassword')

  const otpMutation = useMutation({
    mutationFn: requestForgotPasswordOtp
  })

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword
  })

  const handleSendOtp = async () => {
    const isEmailValid = await trigger('email')
    if (!isEmailValid) return

    otpMutation.mutate(
      { email: getValues('email') },
      {
        onSuccess: (response) => {
          setOtpSent(true)
          toast.success(response.data.message || 'Mã OTP đã được gửi đến email của bạn.', { autoClose: 5000 })
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, 'Không gửi được OTP. Vui lòng kiểm tra email và thử lại.'))
        }
      }
    )
  }

  const onSubmit = handleSubmit((data) => {
    if (!otpSent) {
      handleSendOtp()
      return
    }

    resetPasswordMutation.mutate(
      {
        email: data.email,
        otpCode: data.otpCode || '',
        newPassword: data.newPassword
      },
      {
        onSuccess: () => {
          toast.success('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.', { autoClose: 2500 })
          navigate('/login')
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, 'Mã OTP không đúng hoặc đã hết hạn.'))
        }
      }
    )
  })

  const inputClass =
    'w-full px-5 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800'
  const errorClass = 'mt-1 text-red-600 min-h-[1.25rem] text-sm text-left ml-1'
  const isSendingOtp = otpMutation.isPending
  const isResetting = resetPasswordMutation.isPending

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center animate-out scale-105 duration-1000"
        style={{ backgroundImage: 'url(/hero.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-black/70 to-teal-900/80 backdrop-blur-[2px]" />

      <div className="relative z-10 bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-w-lg w-full border border-white/50">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transform -rotate-3 hover:rotate-0 transition-all duration-300">
            <FaKey className="text-3xl" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Quên mật khẩu</h2>
          <p className="text-gray-500 font-medium leading-snug">
            {otpSent
              ? 'Nhập mã OTP trong email và tạo mật khẩu mới cho tài khoản.'
              : 'Nhập email tài khoản để ViVuGo gửi mã OTP xác nhận.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="email" className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1">
              Email
            </label>
            <Input
              type="email"
              register={register}
              name="email"
              autoComplete="email"
              placeholder="nhap.email@example.com"
              disabled={otpSent || isSendingOtp || isResetting}
              classNameInput={inputClass}
              classNameError={errorClass}
              errorMessage={errors.email?.message}
            />
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="w-full mt-2 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-[0.98] bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:bg-blue-300 disabled:cursor-not-allowed shadow-lg hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)]"
            >
              {isSendingOtp ? 'Đang gửi OTP...' : 'Gửi OTP đặt lại mật khẩu'}
              {!isSendingOtp && <FaPaperPlane />}
            </button>
          ) : (
            <>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                OTP đã gửi đến <span className="font-bold">{email}</span>
              </div>

              <div>
                <label htmlFor="otpCode" className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  Mã OTP
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  register={register}
                  name="otpCode"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  classNameInput={`${inputClass} tracking-[0.35em]`}
                  classNameError={errorClass}
                  errorMessage={errors.otpCode?.message}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  Mật khẩu mới
                </label>
                <Input
                  type="password"
                  register={register}
                  name="newPassword"
                  autoComplete="new-password"
                  placeholder="********"
                  classNameInput={`${inputClass} tracking-wider`}
                  classNameError={errorClass}
                  errorMessage={errors.newPassword?.message}
                />
                <PasswordStrengthMeter password={newPassword} />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1"
                >
                  Xác nhận mật khẩu mới
                </label>
                <Input
                  type="password"
                  register={register}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="********"
                  classNameInput={`${inputClass} tracking-wider`}
                  classNameError={errorClass}
                  errorMessage={errors.confirmPassword?.message}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  disabled={isResetting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-4 font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaArrowLeft /> Đổi email
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-[0.98] bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 disabled:bg-blue-300 disabled:cursor-not-allowed shadow-lg hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)]"
                >
                  {isResetting ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                  {!isResetting && <FaCheckCircle />}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Đã nhớ mật khẩu?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
