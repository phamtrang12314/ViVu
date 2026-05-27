import { useContext, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { LockKeyhole, LogIn, Phone } from 'lucide-react'
import { toast } from 'react-toastify'
import logo from '../assets/logo.png'
import { loginAdmin } from '../admin/apis/authAdmin.api'
import { AppContext } from '../contexts/app.context'
import type { AuthResponse } from '../types/auth.type'
import type { SimpleProfile } from '../types/user.type'

export default function AdminLoginScreen() {
  const navigate = useNavigate()
  const { isAuthenticated, setIsAuthenticated, setProfile } = useContext(AppContext)
  const [phone, setPhone] = useState('0123456789')
  const [password, setPassword] = useState('password123')

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (response) => {
      const data = response.data as AuthResponse
      const profile: SimpleProfile = {
        userID: data.userID,
        email: data.email,
        role: data.role
      }
      setIsAuthenticated(true)
      setProfile(profile)
      toast.success('Đăng nhập admin thành công')
      navigate('/admin/dashboard', { replace: true })
    },
    onError: () => {
      toast.error('Sai số điện thoại hoặc mật khẩu admin')
    }
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    loginMutation.mutate({ phone: phone.trim(), password })
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
        <img
          src="/images/tours/halong_tour.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-42"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/78 to-blue-950/86" />

        <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/18 bg-white/12 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:grid-cols-[0.9fr_1fr]">
          <div className="hidden p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <img src={logo} alt="ViVuGo" className="h-12 w-auto rounded-xl bg-white p-2" />
              <h1 className="mt-10 text-4xl font-black leading-tight">Quản trị ViVuGo</h1>
              <p className="mt-4 text-sm font-medium leading-7 text-white/68">
                Khu vực quản trị chỉ hỗ trợ đăng nhập. Tài khoản mới được tạo trực tiếp trong hệ thống hoặc database.
              </p>
            </div>
            <div className="rounded-3xl border border-white/18 bg-white/10 p-5 text-sm text-white/74 backdrop-blur-xl">
              Demo admin: <span className="font-bold text-white">0123456789</span> /{' '}
              <span className="font-bold text-white">password123</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/88 p-8 backdrop-blur-xl sm:p-12">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <LockKeyhole size={22} />
              </div>
              <h2 className="text-3xl font-black text-slate-950">Đăng nhập admin</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">Không có đăng ký ở trang quản trị.</p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Số điện thoại</span>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="0123456789"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Mật khẩu</span>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="password123"
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-black text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-60"
            >
              <LogIn size={18} />
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
