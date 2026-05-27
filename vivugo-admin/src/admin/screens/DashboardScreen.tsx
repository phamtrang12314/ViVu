/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  CalendarRange,
  DollarSign,
  Download,
  Loader2,
  MessageSquareWarning,
  ShoppingBag,
  TrendingUp,
  Users
} from 'lucide-react'
import { dashboardApi } from '../apis/dashboard.api'
import type { DashboardStats } from '../types/dashboard.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444']
const TIME_RANGES = [
  { label: '3 tháng', months: 3 },
  { label: '6 tháng', months: 6 },
  { label: '12 tháng', months: 12 }
]

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Hoàn thành',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  CANCELED: 'Đã hủy'
}

const TONE_CLASSES: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600'
}

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonths, setSelectedMonths] = useState(12)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardApi.getStats({ year: selectedYear, months: selectedMonths })
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [selectedMonths, selectedYear])

  const handleExportReport = async () => {
    try {
      setIsExporting(true)
      const response = await dashboardApi.exportBookings()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Bao_cao_Booking_${new Date().getTime()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export report:', error)
      alert('Có lỗi xảy ra khi xuất báo cáo!')
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!stats) return <div className="p-6">Không có dữ liệu</div>

  const bookingStatusData = Object.keys(stats.bookingStatusStats).map((key) => ({
    name: STATUS_LABELS[key] || key,
    value: stats.bookingStatusStats[key]
  }))

  const metricCards = [
    {
      title: 'Tổng doanh thu',
      value: `${stats.totalRevenue.toLocaleString('vi-VN')} đ`,
      hint: 'Thanh toán thành công trong khoảng đã chọn',
      icon: DollarSign,
      tone: 'blue'
    },
    {
      title: 'Đơn đặt tour',
      value: stats.totalBookings.toString(),
      hint: 'Booking trong khoảng đã chọn',
      icon: ShoppingBag,
      tone: 'violet'
    },
    {
      title: 'Khách hàng',
      value: stats.totalUsers.toString(),
      hint: `+${stats.newUsersThisMonth} khách hàng trong khoảng đã chọn`,
      icon: Users,
      tone: 'amber'
    },
    {
      title: 'Cần xử lý',
      value: stats.pendingContactMessages.toString(),
      hint: 'Tin nhắn liên hệ đang có',
      icon: MessageSquareWarning,
      tone: 'rose'
    }
  ]

  return (
    <div className="min-h-screen space-y-6 bg-slate-100 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">VivuGo Admin</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Dashboard tổng quan</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Dữ liệu mẫu đã có booking, doanh thu, khách hàng và tour để xem biểu đồ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white bg-white/80 p-1 shadow-sm backdrop-blur-xl">
            <CalendarRange size={18} className="ml-2 text-blue-600" />
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="h-10 rounded-xl bg-transparent px-2 text-sm font-bold text-slate-700 outline-none"
            >
              {[2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-2xl border border-white bg-white/80 p-1 shadow-sm backdrop-blur-xl">
            {TIME_RANGES.map((range) => (
              <button
                key={range.months}
                type="button"
                onClick={() => setSelectedMonths(range.months)}
                className={`h-10 rounded-xl px-4 text-sm font-bold transition ${
                  selectedMonths === range.months
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <Button
            onClick={handleExportReport}
            disabled={isExporting}
            className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <Card
            key={card.title}
            className="overflow-hidden border border-white bg-white/84 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500">{card.title}</CardTitle>
              <card.icon className={`h-9 w-9 rounded-2xl p-2 ${TONE_CLASSES[card.tone]}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-950">{card.value}</div>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                {card.title === 'Khách hàng' && <TrendingUp className="h-3 w-3" />}
                {card.hint}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="border border-white bg-white/84 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-slate-900">Xu hướng doanh thu</CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                {selectedMonths} tháng cuối năm {selectedYear}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={stats.revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.68} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickFormatter={(value) => `T${value}`} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `${Number(value) / 1000000}M`} />
                <Tooltip formatter={(value: any) => `${Number(value).toLocaleString('vi-VN')} đ`} labelFormatter={(label) => `Tháng ${label}`} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-white bg-white/84 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl font-black text-slate-900">Tỷ lệ trạng thái đơn</CardTitle>
            <p className="mt-1 text-sm text-slate-500">Theo khoảng thời gian đang chọn</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={bookingStatusData} cx="50%" cy="50%" innerRadius={64} outerRadius={98} fill="#8884d8" paddingAngle={5} dataKey="value">
                  {bookingStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-white bg-white/84 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl font-black text-slate-900">Top tour doanh thu cao nhất</CardTitle>
          <p className="mt-1 text-sm text-slate-500">Xếp theo booking hoàn thành trong khoảng đã chọn</p>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stats.topSellingTours}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="tourName"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => (value.length > 18 ? `${value.substring(0, 18)}...` : value)}
              />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `${Number(value) / 1000000}M`} />
              <Tooltip formatter={(value: any) => `${Number(value).toLocaleString('vi-VN')} đ`} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
              <Bar dataKey="totalRevenue" fill="#10b981" radius={[8, 8, 0, 0]} name="Doanh thu" barSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
