import React, { useContext } from 'react'
import {
  LayoutDashboard,
  Map,
  Users,
  Calendar,
  Tag,
  MessageSquare,
  MessageSquareMore,
  ListOrdered,
  MapPin,
  LogOut
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo.png'
import { logout } from '../../../apis/auth.api'
import { AppContext } from '../../../contexts/app.context'

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu }) => {
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'booking', label: 'Quản lý Booking', icon: Calendar },
    { id: 'tour', label: 'Quản lý Tour', icon: Map },
    { id: 'tour-type', label: 'Quản lý Loại tour', icon: ListOrdered },
    { id: 'destination', label: 'Quản lý Điểm đến', icon: MapPin },
    { id: 'promotion', label: 'Quản lý Khuyến mãi', icon: Tag },
    { id: 'user', label: 'Quản lý Người dùng', icon: Users },
    { id: 'review', label: 'Quản lý Review', icon: MessageSquareMore },
    // { id: "settings", label: "Cài đặt", icon: Settings },
    { id: 'contact-message', label: 'Tin nhắn liên hệ', icon: MessageSquare }
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <img src={logo} alt="ViVuGo" className="h-10 w-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-800">ViVuGo Admin</h2>
        <p className="text-sm text-gray-500 mt-1">He thong quan ly tour</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeMenu === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left font-bold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut size={20} />
          <span>{logoutMutation.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

