import React, { useContext } from 'react'
import {
  Calendar,
  ChartNoAxesColumn,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Map,
  MapPin,
  Menu,
  MessageSquare,
  MessageSquareMore,
  Tag,
  Users,
  X
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo.png'
import { logout } from '../../../apis/auth.api'
import { AppContext } from '../../../contexts/app.context'

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
  isOpen?: boolean
  onClose?: () => void
  onToggle?: () => void
}

type MenuItem = {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

type MenuGroup = {
  title: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Tổng quan',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'revenue', label: 'Thống kê doanh thu', icon: ChartNoAxesColumn }
    ]
  },
  {
    title: 'Kinh doanh',
    items: [
      { id: 'booking', label: 'Quản lý booking', icon: Calendar },
      { id: 'promotion', label: 'Quản lý khuyến mãi', icon: Tag }
    ]
  },
  {
    title: 'Nội dung tour',
    items: [
      { id: 'tour', label: 'Quản lý tour', icon: Map },
      { id: 'tour-type', label: 'Quản lý loại tour', icon: ListOrdered },
      { id: 'destination', label: 'Quản lý địa điểm du lịch', icon: MapPin }
    ]
  },
  {
    title: 'Khách hàng',
    items: [
      { id: 'user', label: 'Quản lý người dùng', icon: Users },
      { id: 'review', label: 'Quản lý review', icon: MessageSquareMore },
      { id: 'contact-message', label: 'Tin nhắn liên hệ', icon: MessageSquare }
    ]
  }
]

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, isOpen = false, onClose, onToggle }) => {
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      setIsAuthenticated(false)
      setProfile(null)
      navigate('/login', { replace: true })
    }
  })

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId)
    onClose?.()
  }

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600"
        >
          <Menu size={18} />
        </button>
        <img src={logo} alt="ViVuGo" className="h-8 w-auto" />
        <div className="w-9" />
      </div>

      {isOpen && <div className="fixed inset-0 z-40 bg-black/35 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:z-20 lg:w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div>
            <img src={logo} alt="ViVuGo" className="mb-2 h-8 w-auto" />
            <h2 className="text-lg font-bold text-gray-800">ViVuGo Admin</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {menuGroups.map((group) => (
            <section key={group.title} className="mb-4">
              <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-gray-400">{group.title}</p>
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      activeMenu === item.id
                        ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                )
              })}
            </section>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={20} />
            <span>{logoutMutation.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
