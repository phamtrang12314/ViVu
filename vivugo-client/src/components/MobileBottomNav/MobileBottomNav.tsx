import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import { FaHome, FaCompass, FaMapMarkedAlt, FaUser, FaSearch } from 'react-icons/fa'

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const { isAuthenticated } = useContext(AppContext)

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
      isActive ? 'text-blue-600' : 'text-gray-500'
    }`

  return (
    <>
      <button
        type="button"
        onClick={() => {
          navigate('/')
          setTimeout(() => {
            document.getElementById('home-filter-bar')?.scrollIntoView({ behavior: 'smooth' })
          }, 300)
        }}
        className="lg:hidden fixed bottom-[76px] right-4 z-50 w-14 h-14 rounded-full vivugo-gradient-brand text-white shadow-[0_8px_24px_rgba(11,120,227,0.45)] flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Tìm tour nhanh"
      >
        <FaSearch size={20} />
      </button>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 safe-area-pb">
        <div className="flex items-center justify-around px-2 pt-2 pb-3 max-w-lg mx-auto">
          <NavLink to="/" end className={navClass}>
            <FaHome size={20} />
            Trang chủ
          </NavLink>
          <NavLink to="/tours" className={navClass}>
            <FaCompass size={20} />
            Tours
          </NavLink>
          <NavLink to="/destinations" className={navClass}>
            <FaMapMarkedAlt size={20} />
            Điểm đến
          </NavLink>
          <NavLink
            to={isAuthenticated ? '/account/profile' : '/login'}
            className={navClass}
          >
            <FaUser size={20} />
            {isAuthenticated ? 'Tài khoản' : 'Đăng nhập'}
          </NavLink>
        </div>
      </nav>
    </>
  )
}
