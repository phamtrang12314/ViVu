import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { FaArrowRight, FaUserAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { loginSchema, type LoginSchema } from '../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import { loginAccount } from '../../apis/auth.api'
import Input from '../../components/Input'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import type { SimpleProfile } from '../../types/user.type'
import { isAxiosError } from 'axios'

type FormData = LoginSchema

function getLoginErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return 'Không đăng nhập được. Vui lòng thử lại.'
  }

  if (!error.response) {
    return 'Không kết nối được máy chủ. Vui lòng kiểm tra backend cổng 8081.'
  }

  if (error.response.status === 401) {
    return 'Email hoặc mật khẩu không chính xác.'
  }

  const data = error.response.data as { message?: string } | undefined
  return data?.message || 'Không đăng nhập được. Vui lòng thử lại.'
}

export default function LoginScreen() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: FormData) => loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
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
        const message = getLoginErrorMessage(error)
        setError('email', { type: 'manual', message })
        setError('password', { type: 'manual', message })
      }
    })
  })

  const isPending = loginAccountMutation.isPending

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center animate-out scale-105 duration-1000"
        style={{ backgroundImage: 'url(/hero.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-black/70 to-purple-900/80 backdrop-blur-[2px]" />

      <div className="relative z-10 bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-w-md w-full border border-white/50 transform transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-300">
            <FaUserAlt className="text-3xl" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Mừng Trở Lại!</h2>
          <p className="text-gray-500 font-medium">Đăng nhập để tiếp tục hành trình của bạn.</p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          {(errors.email?.message || errors.password?.message) &&
            (errors.email?.type === 'manual' || errors.password?.type === 'manual') && (
              <div className="text-red-600 text-sm font-medium p-3 bg-red-50 border border-red-100 rounded-xl text-center flex items-center justify-center gap-2 animate-pulse">
                <span>!</span> {errors.email?.message || errors.password?.message}
              </div>
            )}

          <div>
            <label htmlFor="email" className="block text-left text-sm font-bold text-gray-700 mb-1.5 ml-1">
              Email
            </label>
            <div className="relative">
              <Input
                type="email"
                register={register}
                name="email"
                autoComplete="email"
                placeholder="nhap.email@example.com"
                classNameInput="w-full px-5 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800"
                errorMessage={errors.email?.message}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 px-1">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                Mật khẩu
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Input
                type="password"
                register={register}
                name="password"
                autoComplete="current-password"
                placeholder="********"
                classNameInput="w-full px-5 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium text-gray-800 tracking-wider"
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full mt-4 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-[0.98] ${
              isPending
                ? 'bg-blue-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)]'
            }`}
          >
            {isPending ? 'Đang xử lý...' : 'Đăng nhập ngay'}
            {!isPending && <FaArrowRight />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Chưa có tài khoản?{' '}
          <Link
            to="/register"
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition-opacity"
          >
            Đăng ký tại đây
          </Link>
        </p>
      </div>
    </div>
  )
}
