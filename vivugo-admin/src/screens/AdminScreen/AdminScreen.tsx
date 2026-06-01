import { useEffect, useState } from 'react'
import Sidebar from '../../admin/components/SiideBar'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const getMenuFromPath = (path: string): string => {
  if (path.startsWith('/admin/manage-tour') || path.startsWith('/admin/tours')) return 'tour'
  if (path.startsWith('/admin/revenue')) return 'revenue'
  if (path.startsWith('/admin/promotions')) return 'promotion'
  if (path.startsWith('/admin/manage-destination') || path.startsWith('/admin/destinations'))
    return 'destination'
  if (path.startsWith('/admin/reviews')) return 'review'
  if (path.startsWith('/admin/users')) return 'user'
  if (path.startsWith('/admin/tour-types')) return 'tour-type'
  if (path.startsWith('/admin/manage-booking')) return 'booking'
  if (path.startsWith('/admin/manage-booking') || path.startsWith('/admin/bookings'))
    return 'booking'
  // 1. Thêm dòng này để Sidebar biết đang ở trang tin nhắn
  if (path.startsWith('/admin/contact-messages')) return 'contact-message'

  return 'dashboard'
}

export default function AdminScreen() {
  const navigate = useNavigate()
  const location = useLocation()

  const [activeMenu, setActiveMenu] = useState(getMenuFromPath(location.pathname))
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu)

    if (menu === 'dashboard') navigate('/admin/dashboard')
    else if (menu === 'revenue') navigate('/admin/revenue')
    else if (menu === 'tour') navigate('/admin/manage-tour')
    else if (menu === 'destination') navigate('/admin/manage-destination')
    else if (menu === 'promotion') navigate('/admin/promotions')
    else if (menu === 'user') navigate('/admin/users')
    else if (menu === 'booking') navigate('/admin/manage-booking')
    else if (menu === 'contact-message') navigate('/admin/contact-messages')
    else if (menu === 'review') navigate('/admin/reviews')
    else if (menu === 'tour-type') navigate('/admin/tour-types')
  }

  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/dashboard', { replace: true })
      return
    }

    const currentMenu = getMenuFromPath(location.pathname)
    if (currentMenu !== activeMenu) {
      setActiveMenu(currentMenu)
    }
    setSidebarOpen(false)
  }, [location.pathname, navigate, activeMenu])

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={handleMenuChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="lg:ml-64">
        <Outlet />
      </div>
    </div>
  )
}

