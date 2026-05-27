import { useContext, useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Popover from '../Popover'
import { AppContext } from '../../contexts/app.context'
import { useMutation } from '@tanstack/react-query'
import { logout } from '../../apis/auth.api'
import userImage from '../../assets/user.png'
import logo from '../../assets/logo.png'
import { FaSearch } from 'react-icons/fa'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/tours', label: 'Tours' },
  { path: '/destinations', label: 'Destinations' },
  { path: '/tours?deals_only=true', label: 'Deals' },
  { path: '/about', label: 'About' }
]

export default function Header() {
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickSearch, setQuickSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
    }
  })

  const handleLogout = () => logoutMutation.mutate()
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (quickSearch.trim()) {
      navigate(`/tours?search=${encodeURIComponent(quickSearch.trim())}`)
    } else {
      navigate('/tours')
    }
    setSearchOpen(false)
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
      transparent
        ? isActive
          ? 'bg-white/24 text-white border-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
          : 'text-white/90 border-transparent hover:bg-white/15 hover:border-white/25 hover:text-white'
        : isActive
          ? 'bg-white/55 text-blue-600 border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl'
          : 'text-gray-600 border-transparent hover:bg-white/45 hover:border-white/70 hover:text-blue-600 hover:backdrop-blur-xl'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent border-b border-transparent'
          : scrolled
            ? 'vivugo-glass border-b border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
            : 'bg-white/80 backdrop-blur-md border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img
              src={logo}
              alt="ViVuGo"
              className={`h-9 w-auto transition-all ${transparent ? 'drop-shadow-lg brightness-110' : ''}`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={linkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs justify-end">
            {searchOpen ? (
              <form onSubmit={handleQuickSearch} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Tìm tour, điểm đến..."
                  autoFocus
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    transparent
                      ? 'bg-white/15 text-white placeholder-white/60 border border-white/25'
                      : 'bg-slate-50 text-gray-800 border border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium ${
                    transparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Đóng
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  transparent
                    ? 'text-white/90 hover:bg-white/15 border border-white/20'
                    : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <FaSearch size={14} />
                <span className="hidden xl:inline">Search</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated ? (
                <Popover
                  renderPopover={
                    <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 w-56 p-2 mt-2">
                      <Link
                        to="/account/profile"
                        className="flex gap-3 items-center px-3 py-2 rounded-xl hover:bg-blue-50 mb-1"
                      >
                        <img src={userImage} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div className="min-w-0">
                          <span className="font-bold text-sm text-gray-900 block truncate">
                            {profile?.userID || 'User'}
                          </span>
                          <span className="text-xs text-gray-500 truncate block">{profile?.email}</span>
                        </div>
                      </Link>
                      <Link
                        to="/account/profile"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        Hồ sơ
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  }
                >
                  <img
                    src={userImage}
                    alt="Account"
                    className="w-9 h-9 rounded-full ring-2 ring-white/50 cursor-pointer object-cover"
                  />
                </Popover>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                      transparent
                        ? 'text-white hover:bg-white/15'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold rounded-xl text-white vivugo-gradient-brand shadow-md hover:shadow-lg transition-all"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={toggleMenu}
              className={`lg:hidden p-2 rounded-xl ${
                transparent ? 'text-white hover:bg-white/15' : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 border-t ${
          isMenuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        } ${transparent && !scrolled ? 'border-white/10 bg-black/40 backdrop-blur-xl' : 'border-gray-100 bg-white'}`}
      >
        <div className="px-4 py-4 space-y-1">
          <form onSubmit={handleQuickSearch} className="flex gap-2 mb-3 md:hidden">
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button type="submit" className="px-4 py-2.5 rounded-xl vivugo-gradient-brand text-white text-sm font-bold">
              <FaSearch />
            </button>
          </form>
          <NavLink to="/" end onClick={toggleMenu} className={linkClass}>
            Trang chủ
          </NavLink>
          {navItems.filter((item) => item.path !== '/').map((item) => (
            <NavLink key={item.path} to={item.path} onClick={toggleMenu} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <div className="border-t border-gray-200/30 my-2 pt-2">
            {isAuthenticated ? (
              <>
                <Link to="/account/profile" onClick={toggleMenu} className="block px-3 py-3 rounded-xl text-sm font-medium">
                  Tài khoản
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                  className="w-full text-left px-3 py-3 text-sm text-red-600 font-semibold"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link to="/login" onClick={toggleMenu} className="flex-1 text-center py-3 rounded-xl bg-gray-100 font-semibold text-sm">
                  Login
                </Link>
                <Link to="/register" onClick={toggleMenu} className="flex-1 text-center py-3 rounded-xl vivugo-gradient-brand text-white font-semibold text-sm">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
