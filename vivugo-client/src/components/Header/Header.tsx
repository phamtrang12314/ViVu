import { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FaSearch } from 'react-icons/fa'
import Popover from '../Popover'
import { AppContext } from '../../contexts/app.context'
import { getProfile, logout } from '../../apis/auth.api'
import userImage from '../../assets/user.png'
import logo from '../../assets/logo.png'
import { resolveAssetUrl } from '../../utils/utils'

const navItems = [
  { path: '/', label: 'Trang chủ' },
  { path: '/tours', label: 'Tours' },
  { path: '/destinations', label: 'Điểm đến' },
  { path: '/about', label: 'Giới thiệu' },
  { path: '/contact', label: 'Liên hệ' }
]

export default function Header() {
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickSearch, setQuickSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const { data: userData } = useQuery({
    queryKey: ['users'],
    queryFn: () => getProfile(),
    enabled: isAuthenticated
  })

  const isHome = location.pathname === '/'
  const isTourDetail = /^\/tours\/[^/]+$/.test(location.pathname)
  const transparent = (isHome || isTourDetail) && !scrolled

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

  const avatarSrc = resolveAssetUrl(userData?.data.avatarURL, userImage)

  const handleQuickSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const value = quickSearch.trim()
    navigate(value ? `/tours?search=${encodeURIComponent(value)}` : '/tours')
    setSearchOpen(false)
  }

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
      transparent
        ? isActive
          ? 'border-white/40 bg-white/20 text-white'
          : 'border-transparent text-white/90 hover:border-white/30 hover:bg-white/10 hover:text-white'
        : isActive
          ? 'border-white/80 bg-white/60 text-blue-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl'
          : 'border-transparent text-gray-600 hover:border-white/70 hover:bg-white/45 hover:text-blue-600'
    }`

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? 'border-b border-transparent bg-transparent'
          : scrolled
            ? 'vivugo-glass border-b border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
            : 'border-b border-gray-100 bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link to="/" className="shrink-0">
            <img src={logo} alt="ViVuGo" className={`h-9 w-auto ${transparent ? 'brightness-110 drop-shadow-lg' : ''}`} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'} className={desktopLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden max-w-xs flex-1 items-center justify-end gap-2 md:flex">
            {searchOpen ? (
              <form onSubmit={handleQuickSearch} className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(event) => setQuickSearch(event.target.value)}
                  placeholder="Tìm tour, điểm đến..."
                  autoFocus
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    transparent
                      ? 'border-white/30 bg-white/12 text-white placeholder-white/65 backdrop-blur'
                      : 'border-gray-200 bg-slate-50 text-gray-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ${transparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Đóng
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium ${
                  transparent
                    ? 'border-white/25 text-white/90 hover:bg-white/10'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaSearch size={14} />
                <span className="hidden xl:inline">Tìm kiếm</span>
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 lg:flex">
              {isAuthenticated ? (
                <Popover
                  renderPopover={
                    <div className="mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
                      <Link to="/account/profile" className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-blue-50">
                        <img src={avatarSrc} alt="" className="h-9 w-9 rounded-full object-cover" />
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-bold text-gray-900">{userData?.data.name || 'Người dùng'}</span>
                          <span className="block truncate text-xs text-gray-500">{userData?.data.email || profile?.email}</span>
                        </div>
                      </Link>
                      <Link to="/account/profile" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Hồ sơ
                      </Link>
                      <button
                        type="button"
                        onClick={() => logoutMutation.mutate()}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  }
                >
                  <img src={avatarSrc} alt="Tài khoản" className="h-9 w-9 cursor-pointer rounded-full object-cover ring-2 ring-white/50" />
                </Popover>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                      transparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="vivugo-gradient-brand rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`rounded-xl p-2 lg:hidden ${transparent ? 'text-white hover:bg-white/15' : 'text-gray-600 hover:bg-gray-100'}`}
              aria-expanded={isMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        className={`overflow-hidden border-t transition-all duration-300 lg:hidden ${
          isMenuOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        } ${transparent && !scrolled ? 'border-white/15 bg-black/35 backdrop-blur-xl' : 'border-gray-100 bg-white'}`}
      >
        <div className="space-y-1 px-4 py-4">
          <form onSubmit={handleQuickSearch} className="mb-3 flex gap-2 md:hidden">
            <input
              type="text"
              value={quickSearch}
              onChange={(event) => setQuickSearch(event.target.value)}
              placeholder="Tìm kiếm..."
              className="flex-1 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button type="submit" className="vivugo-gradient-brand rounded-xl px-4 py-2.5 text-sm font-bold text-white">
              <FaSearch />
            </button>
          </form>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-3 text-sm font-semibold ${
                  isActive ? 'bg-blue-50 text-blue-700' : transparent ? 'text-white' : 'text-gray-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="my-2 border-t border-gray-200/30 pt-2">
            {isAuthenticated ? (
              <>
                <Link to="/account/profile" onClick={() => setIsMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-medium">
                  Tài khoản
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logoutMutation.mutate()
                    setIsMenuOpen(false)
                  }}
                  className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex-1 rounded-xl bg-gray-100 py-3 text-center text-sm font-semibold">
                  Đăng nhập
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="vivugo-gradient-brand flex-1 rounded-xl py-3 text-center text-sm font-semibold text-white">
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
