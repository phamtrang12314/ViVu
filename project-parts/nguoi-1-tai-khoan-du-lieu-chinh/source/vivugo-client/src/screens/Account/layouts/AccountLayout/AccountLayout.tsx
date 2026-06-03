import { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AppContext } from '../../../../contexts/app.context'
import { getProfile } from '../../../../apis/auth.api'
import { FaUser, FaHistory, FaHeart, FaKey, FaSignOutAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { resolveAssetUrl } from '../../../../utils/utils'

export default function AccountLayout() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  const { data: userData } = useQuery({
    queryKey: ['users'],
    queryFn: () => getProfile()
  })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    setProfile(null)
    toast.success('Đăng xuất thành công!')
    navigate('/login')
  }

  const navLinks = [
    { path: '/account/profile', label: 'Hồ sơ cá nhân', icon: FaUser },
    { path: '/account/historyTour', label: 'Lịch sử đặt tour', icon: FaHistory },
    { path: '/account/favouriteTour', label: 'Tour yêu thích', icon: FaHeart },
    { path: '/account/password', label: 'Đổi mật khẩu', icon: FaKey }
  ]

  const user = userData?.data
  const displayName = user?.name?.trim() || 'Khách hàng'
  const avatarSrc = resolveAssetUrl(user?.avatarURL, '/uifaces-human-avatar.jpg')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] pb-20 pt-28">
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] animate-blob rounded-full bg-blue-400/20 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] animate-blob rounded-full bg-purple-400/20 blur-[100px] animation-delay-2000" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full shrink-0 lg:w-1/4">
            <div
              className={`rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 ${
                scrolled ? 'lg:sticky lg:top-28' : ''
              }`}
            >
              <div className="mb-8 border-b border-gray-100 pb-8 text-center">
                <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-1 shadow-xl">
                  <img src={avatarSrc} alt={displayName} className="h-full w-full rounded-full border-4 border-white bg-white object-cover" />
                </div>
                <h3 className="mb-1 text-xl font-bold text-gray-900">{displayName}</h3>
                <p className="truncate px-2 text-sm font-medium text-gray-500">{user?.email || 'Đang cập nhật'}</p>
                <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                  Thành viên ViVuGo
                </span>
              </div>

              <nav className="space-y-2">
                {navLinks.map((item) => {
                  const isActive = location.pathname.includes(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? 'scale-[1.02] bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                          : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <item.icon className={isActive ? 'text-white' : 'text-gray-400'} size={18} />
                      {item.label}
                    </Link>
                  )
                })}
                <div className="my-4 border-t border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-red-500 transition-all duration-300 hover:bg-red-50 hover:text-red-600"
                >
                  <FaSignOutAlt size={18} />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          <div className="w-full lg:w-3/4">
            <div className="min-h-[600px] rounded-[2.5rem] border border-white/60 bg-white/90 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-12">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
