import { useContext, useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Popover from '../Popover'
import { AppContext } from '../../contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import { logout } from '../../apis/auth.api'
import userImage from '../../assets/user.png'

export default function Header() {
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Hiệu ứng đổi màu header khi scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
    }
  })

  const handleLogout = () => logoutMutation.mutate()
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    // Wrapper thả nổi (Floating wrapper)
    <header
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] sm:w-auto max-w-5xl ${
        scrolled ? 'translate-y-0' : 'translate-y-0'
      }`}
    >
      {/* Inner Pill Container */}
      <div
        className={`flex items-center justify-between sm:justify-center gap-4 md:gap-8 backdrop-blur-2xl border border-gray-200/50 rounded-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 py-2 px-4 md:px-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
            : 'bg-white/70 py-2.5 px-4 md:px-6 shadow-[0_4px_20px_rgb(0,0,0,0.08)]'
        }`}
      >
        {/* --- Logo thu nhỏ --- */}
        <Link
          to="/"
          className="flex items-center gap-2 group transform transition-transform hover:scale-105 shrink-0"
        >
          <img
            src="/Logo-ViVuGo.png"
            alt="ViVuGo Logo"
            className="h-8 md:h-9 w-auto drop-shadow-sm"
          />
        </Link>

        {/* --- Menu Điều Hướng (Desktop) --- */}
        <div className="hidden md:flex items-center gap-1 font-medium text-sm">
          {[
            { path: '/', label: 'Trang chủ' },
            { path: '/tours', label: 'Tours' },
            { path: '/about', label: 'Về chúng tôi' },
            { path: '/contact', label: 'Liên hệ' }
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* --- Account/Auth & Mobile Toggle --- */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:block">
            {isAuthenticated ? (
              <Popover
                renderPopover={
                  <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 w-56 text-sm overflow-hidden transform transition-all p-2 mt-2">
                    <div className="flex flex-col gap-1 text-left">
                      <Link
                        to="/account/profile"
                        className="flex gap-3 items-center px-3 py-2 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors duration-300 mb-1"
                      >
                        <img
                          src={userImage}
                          alt="User avatar"
                          className="w-9 h-9 object-cover rounded-full border-2 border-white shadow-sm"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-bold text-gray-900 truncate text-sm">
                            {profile?.userID || 'User'}
                          </span>
                          <span className="text-[11px] text-gray-500 truncate">
                            {profile?.email}
                          </span>
                        </div>
                      </Link>
                      <Link
                        to="/account/profile"
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                      >
                        Hồ sơ cá nhân
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 cursor-pointer font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                }
              >
                <img
                  src={userImage}
                  alt="User avatar"
                  className="w-8 h-8 md:w-9 md:h-9 cursor-pointer object-cover rounded-full ring-2 ring-gray-100 hover:ring-blue-500 transition-all shadow-sm"
                />
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm text-gray-700 font-semibold hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-expanded={isMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* --- Mobile Menu (Floating Card) --- */}
      <div
        className={`absolute top-full left-0 w-full mt-3 bg-white/95 backdrop-blur-2xl border border-gray-100 shadow-2xl rounded-3xl lg:hidden transition-all duration-300 origin-top overflow-hidden ${
          isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-4 space-y-1 font-medium">
          {[
            { path: '/', label: 'Trang chủ' },
            { path: '/tours', label: 'Tours' },
            { path: '/destinations', label: 'Điểm đến' },
            { path: '/about', label: 'Về chúng tôi' },
            { path: '/contact', label: 'Liên hệ' }
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-2xl transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="border-t border-gray-100 my-2"></div>

          {isAuthenticated ? (
            <>
              <Link
                to="/account/profile"
                onClick={toggleMenu}
                className="block px-4 py-3 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hồ sơ cá nhân
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  toggleMenu()
                }}
                className="w-full text-left px-4 py-3 rounded-2xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block text-center px-4 py-3 rounded-2xl bg-gray-50 text-gray-800 font-semibold hover:bg-gray-100 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="block text-center px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

