import { useContext, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../../../../contexts/app.context'
import { FaUser, FaHistory, FaHeart, FaKey, FaSignOutAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import userImage from '../../../../assets/user.png'

export default function AccountLayout() {
  const { profile, setIsAuthenticated, setProfile } = useContext(AppContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

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

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 pt-28 relative overflow-hidden">
      {/* Background Abstract Shapes (Premium Touch) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR (Glassmorphism) */}
          <div className="lg:w-1/4 w-full shrink-0">
            <div
              className={`bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 transition-all duration-300 ${scrolled ? 'lg:sticky lg:top-28' : ''}`}
            >
              {/* User Info */}
              <div className="text-center mb-8 pb-8 border-b border-gray-100">
                <div className="w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-blue-500 to-indigo-500 mb-4 shadow-xl">
                  <img
                    src={userImage} // Replace with profile?.avatar if available
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full border-4 border-white bg-white"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {profile?.userID || 'Người dùng'}
                </h3>
                <p className="text-sm text-gray-500 truncate px-2 font-medium">{profile?.email}</p>
                <span className="mt-3 inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  Thành viên ViVuGo
                </span>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {navLinks.map((item) => {
                  const isActive = location.pathname.includes(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]'
                          : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <item.icon className={isActive ? 'text-white' : 'text-gray-400'} size={18} />
                      {item.label}
                    </Link>
                  )
                })}
                <div className="border-t border-gray-100 my-4"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <FaSignOutAlt size={18} />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT (Outlet) */}
          <div className="lg:w-3/4 w-full">
            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 min-h-[600px] p-8 md:p-12">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

