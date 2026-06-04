import { useContext, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { FaArrowLeft, FaCheckCircle, FaPaperPlane, FaUserPlus } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { schema, type Schema } from '../../utils/rules'
import Input from '../../components/Input'
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter'
import { registerAccount, requestRegisterOtp } from '../../apis/auth.api'
import { toast } from 'react-toastify'
import { AppContext } from '../../contexts/app.context'
import type { SimpleProfile } from '../../types/user.type'

type FormData = Schema
type RegisterPayload = Omit<FormData, 'confirm_password'>

function getErrorMessage(error: unknown, fallback: string) {
  const maybeAxiosError = error as { response?: { data?: { message?: string } } }
  return maybeAxiosError.response?.data?.message || fallback
}

export default function RegisterScreen() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const [otpSent, setOtpSent] = useState(false)
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const email = watch('email')
  const password = watch('password')

  const otpMutation = useMutation({
    mutationFn: requestRegisterOtp
  })

  const registerMutation = useMutation({
    mutationFn: (body: RegisterPayload) => registerAccount(body)
  })

  const handleSendOtp = async () => {
    const isAccountInfoValid = await trigger(['name', 'phoneNumber', 'email', 'password', 'confirm_password'])
    if (!isAccountInfoValid) return

    otpMutation.mutate(
      { email: getValues('email') },
      {
        onSuccess: (response) => {
          setOtpSent(true)
          toast.success(response.data.message || 'Mã OTP đã được gửi đến email của bạn.', { autoClose: 5000 })
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, 'Không gửi được OTP. Vui lòng kiểm tra email hoặc cấu hình SMTP.'))
        }
      }
    )
  }

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password']) as RegisterPayload
    registerMutation.mutate(body, {
      onSuccess: (data) => {
        toast.success('Đăng ký tài khoản thành công!', { autoClose: 2000 })
        setIsAuthenticated(true)
        const authData = data.data
        const simpleProfile: SimpleProfile = {
          userID: authData.userID,
          email: authData.email,
          role: authData.role
        }

        setProfile(simpleProfile)
        navigate('/')
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, 'Có lỗi xảy ra, vui lòng thử lại.'))
      }
    })
  })

  const isRegistering = registerMutation.isPending
  const isSendingOtp = otpMutation.isPending
  const inputClass =
    'w-full px-5 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500/50 outline-none transition-all font-medium text-gray-800'
  const errorClass = 'mt-1 text-red-600 min-h-[1.25rem] text-sm text-left ml-1'

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center animate-out scale-105 duration-1000"
        style={{ backgroundImage: 'url(/hero.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-black/70 to-blue-900/80 backdrop-blur-[2px]" />

      <div className="relative z-10 bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-w-lg w-full border border-white/50">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transform -rotate-3 hover:rotate-0 transition-all duration-300">
            <FaUserPlus className="text-3xl ml-2" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Tạo Tài Khoản</h2>
          <p className="text-gray-500 font-medium leading-snug">
            {otpSent
              ? 'Nhập mã OTP trong email để hoàn tất đăng ký.'
              : 'Nhập thông tin và mật khẩu trước, sau đó ViVuGo sẽ gửi OTP xác nhận.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          {!otpSent ? (
            <>
              <div>
                <label htmlFor="name" className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  Họ và tên
                </label>
                <Input
                  type="text"
                  register={register}
                  name="name"
                  autoComplete="name"
                  placeholder="Nguyễn Văn A"
                  classNameInput={inputClass}
                  classNameError={errorClass}
                  errorMessage={errors.name?.message}
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  Số điện thoại
                </label>
                <Input
                  type="tel"
                  register={register}
                  name="phoneNumber"
                  autoComplete="tel"
                  placeholder="0912345678"
                  classNameInput={inputClass}
                  classNameError={errorClass}
                  errorMessage={errors.phoneNumber?.message}
                />
              </div>

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
                  classNameInput={inputClass}
                  classNameError={errorClass}
                  errorMessage={errors.email?.message}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  Mật khẩu
                </label>
                <Input
                  type="password"
                  register={register}
                  name="password"
                  autoComplete="new-password"
                  placeholder="********"
                  classNameInput={`${inputClass} tracking-wider`}
                  classNameError={errorClass}
                  errorMessage={errors.password?.message}
                />
                <PasswordStrengthMeter password={password} />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  Xác nhận mật khẩu
                </label>
                <Input
                  type="password"
                  register={register}
                  name="confirm_password"
                  autoComplete="new-password"
                  placeholder="********"
                  classNameInput={`${inputClass} tracking-wider`}
                  classNameError={errorClass}
                  errorMessage={errors.confirm_password?.message}
                />
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className="w-full mt-4 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-[0.98] bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:bg-teal-300 disabled:cursor-not-allowed shadow-lg hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)]"
              >
                {isSendingOtp ? 'Đang gửi OTP...' : 'Gửi OTP xác nhận'}
                {!isSendingOtp && <FaPaperPlane />}
              </button>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900">
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

              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  disabled={isRegistering}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-4 font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaArrowLeft /> Sửa thông tin
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-[0.98] ${
                    isRegistering
                      ? 'bg-teal-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)]'
                  }`}
                >
                  {isRegistering ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
                  {!isRegistering && <FaCheckCircle />}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-80 transition-opacity"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
