/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
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
  AlertCircle,
  ArrowRight,
  Bot,
  CalendarRange,
  Clock3,
  DollarSign,
  Download,
  Loader2,
  MailWarning,
  MessageSquareWarning,
  Plus,
  Search,
  Sparkles,
  ShieldAlert,
  ShoppingBag,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  type LucideIcon
} from 'lucide-react'
import { dashboardApi } from '../apis/dashboard.api'
import type { DashboardOverview, PendingTasks } from '../types/dashboard.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TIME_RANGES = [
  { label: '3 tháng', months: 3 },
  { label: '6 tháng', months: 6 },
  { label: '12 tháng', months: 12 }
]

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Hoàn thành',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  CANCELED: 'Đã hủy',
  CANCELLATION_REQUESTED: 'Chờ hủy'
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#2563eb',
  CONFIRMED: '#22c55e',
  PROCESSING: '#f97316',
  CANCELED: '#ef4444',
  CANCELLATION_REQUESTED: '#f97316'
}

const TOUR_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Đang bán',
  SOLD_OUT: 'Đã đầy',
  PAUSE: 'Tạm dừng',
  COMPLETED: 'Hoàn thành',
  CANCELED: 'Đã hủy'
}

const TOUR_STATUS_CLASSES: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  SOLD_OUT: 'bg-red-50 text-red-700 border-red-200',
  PAUSE: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
  CANCELED: 'bg-gray-50 text-gray-700 border-gray-200'
}

const formatMoney = (value: number) => `${Math.round(value).toLocaleString('vi-VN')} đ`

const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

const getDeltaTone = (delta: number, reverse = false) => {
  if (delta === 0) return 'text-gray-500'
  const positive = reverse ? delta < 0 : delta > 0
  return positive ? 'text-green-600' : 'text-red-600'
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden border border-gray-100 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-36 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-3 w-40 animate-pulse rounded bg-gray-100" />
      </CardContent>
    </Card>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500">
      {text}
    </div>
  )
}

function ErrorState({ text }: { text: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm text-red-600">
      <AlertCircle size={16} />
      {text}
    </div>
  )
}

type DashboardMetricNavCardProps = {
  title: string
  value: string
  delta: number
  deltaReverse?: boolean
  detail: string
  icon: LucideIcon
  iconClassName: string
  onClick: () => void
}

function DashboardMetricNavCard({
  title,
  value,
  delta,
  deltaReverse = false,
  detail,
  icon,
  iconClassName,
  onClick
}: DashboardMetricNavCardProps) {
  const Icon = icon
  const shouldShowDown = deltaReverse ? delta <= 0 : delta < 0

  return (
    <Card className="border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button type="button" onClick={onClick} className="block w-full cursor-pointer text-left">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-gray-500">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black text-gray-900">{value}</p>
            <Icon className={iconClassName} />
          </div>
          <p className={`mt-2 flex items-center gap-1 text-sm font-semibold ${getDeltaTone(delta, deltaReverse)}`}>
            {shouldShowDown ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {formatPercent(delta)} so với kỳ trước
          </p>
          <p className="mt-1 flex items-center justify-between gap-2 text-xs text-gray-500">
            <span>{detail}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
              Chi tiết <ArrowRight size={12} />
            </span>
          </p>
        </CardContent>
      </button>
    </Card>
  )
}

export default function DashboardScreen() {
  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonths, setSelectedMonths] = useState(12)
  const [searchScope, setSearchScope] = useState<'booking' | 'tour' | 'user' | 'message'>('booking')
  const [searchValue, setSearchValue] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard-overview', selectedYear, selectedMonths],
    queryFn: () => dashboardApi.getOverview({ year: selectedYear, months: selectedMonths }).then((res) => res.data)
  })

  const overview = data as DashboardOverview | undefined

  const bookingStatusData = useMemo(() => {
    if (!overview?.stats?.bookingStatusStats) return []
    return Object.keys(overview.stats.bookingStatusStats).map((key) => ({
      key,
      name: STATUS_LABELS[key] || key,
      value: overview.stats.bookingStatusStats[key]
    }))
  }, [overview])

  const totalStatus = useMemo(
    () => bookingStatusData.reduce((sum, item) => sum + (item.value || 0), 0),
    [bookingStatusData]
  )

  const pendingTasks: PendingTasks | undefined = overview?.pendingTasks

  const aiInsightMutation = useMutation({
    mutationFn: () =>
      dashboardApi.generateAiInsights({
        year: selectedYear,
        months: selectedMonths,
        question: aiQuestion.trim() || undefined
      }).then((res) => res.data)
  })

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const query = searchValue.trim()
    if (!query) return

    if (searchScope === 'booking') navigate(`/admin/manage-booking?search=${encodeURIComponent(query)}`)
    if (searchScope === 'tour') navigate(`/admin/manage-tour?search=${encodeURIComponent(query)}`)
    if (searchScope === 'user') navigate(`/admin/users?search=${encodeURIComponent(query)}`)
    if (searchScope === 'message') navigate(`/admin/contact-messages?search=${encodeURIComponent(query)}`)
  }

  const handleExportCsv = async () => {
    try {
      setIsExporting(true)
      const response = await dashboardApi.exportBookings()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `dashboard_report_${selectedYear}_${selectedMonths}m.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setShowExportMenu(false)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportExcel = async () => {
    await handleExportCsv()
    window.alert('Đã xuất định dạng CSV tương thích để mở bằng Excel.')
  }

  const handleExportPdf = () => {
    setShowExportMenu(false)
    window.alert('Xuất PDF sẽ được bổ sung ở bản tiếp theo.')
  }

  const hasRevenueData = Boolean(overview?.revenueTrend?.some((item) => item.revenue > 0))
  const hasBookingData = Boolean(overview?.bookingTrend?.some((item) => item.bookings > 0))
  const completedRate = totalStatus > 0
    ? ((overview?.stats?.bookingStatusStats?.COMPLETED || 0) / totalStatus) * 100
    : 0
  const responseRate = pendingTasks && pendingTasks.total > 0
    ? Math.max(0, Math.min(100, 100 - (pendingTasks.unrespondedMessages / pendingTasks.total) * 100))
    : 100
  const averageRevenuePerBooking = overview && overview.stats.totalBookings > 0
    ? overview.stats.totalRevenue / overview.stats.totalBookings
    : 0

  return (
    <div className="min-h-screen space-y-6 bg-gray-100 p-4 md:p-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Dashboard tổng quan</h1>
            <p className="mt-1 text-sm text-gray-500">Tổng hợp nhanh doanh thu, vận hành và việc cần xử lý.</p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full flex-col gap-2 md:flex-row xl:w-auto">
            <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3">
              <Search size={16} className="text-gray-400" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm tour, booking, khách hàng..."
                className="h-10 w-full bg-transparent px-2 text-sm outline-none md:w-72"
              />
            </div>
            <select
              value={searchScope}
              onChange={(event) => setSearchScope(event.target.value as any)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700"
            >
              <option value="booking">Booking</option>
              <option value="tour">Tour</option>
              <option value="user">Khách hàng</option>
              <option value="message">Tin nhắn</option>
            </select>
            <button
              type="submit"
              className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Tìm
            </button>
          </form>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <CalendarRange size={16} className="text-blue-600" />
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="bg-transparent text-sm font-semibold text-gray-700 outline-none"
            >
              {[2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-xl border border-gray-200 bg-white p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range.months}
                type="button"
                onClick={() => setSelectedMonths(range.months)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                  selectedMonths === range.months
                    ? 'bg-slate-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="inline-flex h-10 items-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Xuất báo cáo
            </button>
            {showExportMenu && (
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                <button onClick={handleExportPdf} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50">
                  Xuất PDF
                </button>
                <button onClick={handleExportExcel} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50">
                  Xuất Excel
                </button>
                <button onClick={handleExportCsv} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50">
                  Xuất CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => navigate('/admin/tours/new')} className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus className="mr-1 h-4 w-4" /> Tạo tour mới
        </button>
        <button onClick={() => navigate('/admin/promotions')} className="inline-flex items-center rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">
          <Plus className="mr-1 h-4 w-4" /> Tạo khuyến mãi
        </button>
        <button onClick={() => navigate('/admin/manage-destination/new')} className="inline-flex items-center rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600">
          <Plus className="mr-1 h-4 w-4" /> Thêm địa điểm
        </button>
        <button onClick={() => navigate('/admin/manage-booking/canceled')} className="inline-flex items-center rounded-lg border border-violet-500 bg-white px-3 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-50">
          <Clock3 className="mr-1 h-4 w-4" /> Booking chờ xử lý
        </button>
      </div>

      <Card className="border border-blue-100 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-900">
              <Bot className="h-5 w-5 text-blue-600" />
              AI phân tích báo cáo
            </CardTitle>
            <p className="mt-1 text-sm text-gray-500">Tóm tắt doanh thu, booking, rủi ro và việc cần làm từ dashboard hiện tại.</p>
          </div>
          <button
            type="button"
            onClick={() => aiInsightMutation.mutate()}
            disabled={aiInsightMutation.isPending || isLoading || !overview}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {aiInsightMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Phân tích AI
          </button>
        </CardHeader>
        <CardContent>
          <input
            value={aiQuestion}
            onChange={(event) => setAiQuestion(event.target.value)}
            placeholder="Hỏi thêm: tháng này nên đẩy tour nào, cần xử lý rủi ro gì..."
            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-400"
          />

          {aiInsightMutation.isError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              Không tạo được báo cáo AI. Vui lòng thử lại.
            </div>
          )}

          {aiInsightMutation.data && (
            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 xl:col-span-2">
                <h3 className="mb-2 text-sm font-black uppercase text-blue-700">Nhận định AI</h3>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">{aiInsightMutation.data.aiReport}</p>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                  <h4 className="text-sm font-black text-emerald-700">Điểm chính</h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {aiInsightMutation.data.highlights.map((item) => <li key={item}>- {item}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                  <h4 className="text-sm font-black text-amber-700">Rủi ro</h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {aiInsightMutation.data.risks.map((item) => <li key={item}>- {item}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-3">
                  <h4 className="text-sm font-black text-violet-700">Đề xuất</h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {aiInsightMutation.data.recommendations.map((item) => <li key={item}>- {item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!isLoading && overview && (
          <>
            <DashboardMetricNavCard
              title="Tổng doanh thu"
              value={formatMoney(overview.stats.totalRevenue)}
              delta={overview.revenueChangePercent}
              detail="Doanh thu đã thanh toán thành công theo bộ lọc đang chọn."
              icon={DollarSign}
              iconClassName="h-8 w-8 rounded-xl bg-blue-50 p-1.5 text-blue-600"
              onClick={() => navigate('/admin/revenue')}
            />

            <DashboardMetricNavCard
              title="Đơn đặt tour"
              value={overview.stats.totalBookings.toLocaleString('vi-VN')}
              delta={overview.bookingsChangePercent}
              detail={`+${Math.max(0, overview.stats.totalBookings - overview.previousBookings).toLocaleString('vi-VN')} booking mới trong kỳ.`}
              icon={ShoppingBag}
              iconClassName="h-8 w-8 rounded-xl bg-violet-50 p-1.5 text-violet-600"
              onClick={() => navigate('/admin/manage-booking')}
            />

            <DashboardMetricNavCard
              title="Khách hàng"
              value={overview.stats.totalUsers.toLocaleString('vi-VN')}
              delta={overview.usersChangePercent}
              detail={`+${overview.stats.newUsersThisMonth.toLocaleString('vi-VN')} khách hàng mới trong kỳ.`}
              icon={Users}
              iconClassName="h-8 w-8 rounded-xl bg-emerald-50 p-1.5 text-emerald-600"
              onClick={() => navigate('/admin/users')}
            />

            <DashboardMetricNavCard
              title="Cần xử lý"
              value={pendingTasks?.total.toLocaleString('vi-VN') || '0'}
              delta={overview.pendingTasksChangePercent}
              deltaReverse
              detail="Gồm booking, tin nhắn, review, hoàn tiền và tour sắp hết chỗ."
              icon={MessageSquareWarning}
              iconClassName="h-8 w-8 rounded-xl bg-rose-50 p-1.5 text-rose-600"
              onClick={() => navigate('/admin/contact-messages')}
            />
          </>
        )}
      </div>

      {!isLoading && overview && (
        <Card className="border border-gray-100 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-black text-slate-900">Thống kê nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Doanh thu / booking</p>
                <p className="mt-1 text-xl font-black text-slate-900">{formatMoney(averageRevenuePerBooking)}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Khách hàng mới</p>
                <p className="mt-1 text-xl font-black text-slate-900">{overview.stats.newUsersThisMonth.toLocaleString('vi-VN')}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Độ phản hồi</p>
                <p className="mt-1 text-xl font-black text-slate-900">{responseRate.toFixed(1)}%</p>
                <p className="mt-1 text-xs text-gray-500">Tính theo tỉ lệ tin nhắn chưa phản hồi trong nhóm công việc đang xử lý.</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tỉ lệ đơn hoàn thành</p>
                <p className="mt-1 text-xl font-black text-slate-900">{completedRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
        <Card className="border border-gray-100 bg-white shadow-sm xl:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-900">Doanh thu & Đơn đặt tour</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <EmptyState text="Đang tải dữ liệu biểu đồ..." />}
            {isError && <ErrorState text="Không tải được dữ liệu doanh thu." />}
            {!isLoading && !isError && overview && !hasRevenueData && !hasBookingData && (
              <EmptyState text="Chưa có dữ liệu trong khoảng thời gian này" />
            )}
            {!isLoading && !isError && overview && (hasRevenueData || hasBookingData) && (
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={overview.revenueTrend.map((item, index) => ({
                  month: item.month,
                  revenue: item.revenue,
                  bookings: overview.bookingTrend[index]?.bookings || 0
                }))}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tickFormatter={(value) => `T${value}`} />
                  <YAxis yAxisId="left" tickFormatter={(value: any) => `${Math.round(Number(value) / 1000000)}M`} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: any, name) => {
                      if (name === 'Doanh thu') return formatMoney(Number(value))
                      return Number(value).toLocaleString('vi-VN')
                    }}
                    labelFormatter={(label) => `Tháng ${label}`}
                  />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" name="Doanh thu" stroke="#2563eb" fill="url(#revenueFill)" strokeWidth={3} />
                  <Bar yAxisId="right" dataKey="bookings" name="Đơn đặt tour" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-100 bg-white shadow-sm xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-900">Tỷ lệ trạng thái đơn</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <EmptyState text="Đang tải dữ liệu trạng thái..." />}
            {isError && <ErrorState text="Không tải được dữ liệu trạng thái." />}
            {!isLoading && !isError && bookingStatusData.length === 0 && (
              <EmptyState text="Chưa có booking trong khoảng thời gian này" />
            )}
            {!isLoading && !isError && bookingStatusData.length > 0 && (
              <div className="grid gap-4 xl:grid-cols-2">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={bookingStatusData} dataKey="value" innerRadius={62} outerRadius={94} paddingAngle={3}>
                      {bookingStatusData.map((entry) => (
                        <Cell key={entry.key} fill={STATUS_COLORS[entry.key] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, _name: any, payload: any) => {
                        const percent = totalStatus > 0 ? ((Number(value) / totalStatus) * 100).toFixed(1) : '0.0'
                        return [`${Number(value).toLocaleString('vi-VN')} (${percent}%)`, payload?.payload?.name]
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {bookingStatusData.map((item) => {
                    const percent = totalStatus > 0 ? (item.value / totalStatus) * 100 : 0
                    return (
                      <div key={item.key} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.key] || '#94a3b8' }} />
                          <span className="font-medium text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {item.value.toLocaleString('vi-VN')} ({percent.toFixed(1)}%)
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-7">
        <Card className="border border-gray-100 bg-white shadow-sm xl:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black text-slate-900">Top 5 tour bán chạy</CardTitle>
            <button onClick={() => navigate('/admin/manage-tour')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Xem tất cả</button>
          </CardHeader>
          <CardContent>
            {isLoading && <EmptyState text="Đang tải top tour..." />}
            {!isLoading && (!overview?.topTours || overview.topTours.length === 0) && (
              <EmptyState text="Chưa có dữ liệu tour bán chạy" />
            )}
            {!isLoading && overview?.topTours && overview.topTours.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                      <th className="py-2">Tên tour</th>
                      <th className="py-2">Địa điểm</th>
                      <th className="py-2">Số booking</th>
                      <th className="py-2">Doanh thu</th>
                      <th className="py-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.topTours.map((tour) => (
                      <tr key={tour.tourId} className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-900">{tour.tourName}</td>
                        <td className="py-2 text-gray-600">{tour.destination || '-'}</td>
                        <td className="py-2 text-gray-900">{tour.bookingCount.toLocaleString('vi-VN')}</td>
                        <td className="py-2 font-semibold text-gray-900">{formatMoney(tour.totalRevenue)}</td>
                        <td className="py-2">
                          <span className={`rounded-full border px-2 py-1 text-xs ${TOUR_STATUS_CLASSES[tour.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                            {TOUR_STATUS_LABELS[tour.status] || tour.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-100 bg-white shadow-sm xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black text-slate-900">Việc cần xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <EmptyState text="Đang tải danh sách công việc..." />}
            {!isLoading && pendingTasks && (
              <div className="space-y-2">
                {[
                  {
                    key: 'bookingAwaitingConfirmation',
                    title: 'Booking chờ xác nhận',
                    value: pendingTasks.bookingAwaitingConfirmation,
                    icon: Clock3,
                    to: '/admin/manage-booking'
                  },
                  {
                    key: 'unrespondedMessages',
                    title: 'Tin nhắn chưa phản hồi',
                    value: pendingTasks.unrespondedMessages,
                    icon: MailWarning,
                    to: '/admin/contact-messages'
                  },
                  {
                    key: 'reviewsPendingApproval',
                    title: 'Review chờ duyệt',
                    value: pendingTasks.reviewsPendingApproval,
                    icon: Star,
                    to: '/admin/reviews'
                  },
                  {
                    key: 'refundRequests',
                    title: 'Yêu cầu hoàn tiền',
                    value: pendingTasks.refundRequests,
                    icon: ShieldAlert,
                    to: '/admin/manage-booking/canceled'
                  },
                  {
                    key: 'toursNearlySoldOut',
                    title: 'Tour sắp hết chỗ',
                    value: pendingTasks.toursNearlySoldOut,
                    icon: AlertCircle,
                    to: '/admin/manage-tour'
                  }
                ].map((task) => {
                  const Icon = task.icon
                  return (
                    <div key={task.key} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Icon size={15} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">{task.value.toLocaleString('vi-VN')}</span>
                        <button
                          onClick={() => navigate(task.to)}
                          className="rounded-md border border-blue-200 px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          Xem
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border border-gray-100 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black text-slate-900">Tour sắp khởi hành</CardTitle>
            <button onClick={() => navigate('/admin/manage-tour')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Xem tất cả</button>
          </CardHeader>
          <CardContent>
            {isLoading && <EmptyState text="Đang tải tour sắp khởi hành..." />}
            {!isLoading && (!overview?.upcomingTours || overview.upcomingTours.length === 0) && (
              <EmptyState text="Chưa có tour sắp khởi hành" />
            )}
            {!isLoading && overview?.upcomingTours && overview.upcomingTours.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                      <th className="py-2">Tên tour</th>
                      <th className="py-2">Ngày khởi hành</th>
                      <th className="py-2">Đã đặt / Tổng</th>
                      <th className="py-2">Còn lại</th>
                      <th className="py-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.upcomingTours.map((tour) => (
                      <tr key={tour.tourId} className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-900">{tour.tourName}</td>
                        <td className="py-2 text-gray-600">{new Date(tour.departureDate).toLocaleDateString('vi-VN')}</td>
                        <td className="py-2 text-gray-700">{tour.bookedSeats} / {tour.totalSeats}</td>
                        <td className="py-2 font-semibold text-gray-900">{tour.remainingSeats}</td>
                        <td className="py-2">
                          <span className={`rounded-full border px-2 py-1 text-xs ${tour.remainingSeats === 0 ? 'bg-red-50 text-red-700 border-red-200' : tour.remainingSeats <= 5 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {tour.remainingSeats === 0 ? 'Đã đầy' : tour.remainingSeats <= 5 ? 'Sắp hết chỗ' : 'Còn chỗ'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-100 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black text-slate-900">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <EmptyState text="Đang tải hoạt động..." />}
            {!isLoading && (!overview?.recentActivities || overview.recentActivities.length === 0) && (
              <EmptyState text="Chưa có hoạt động mới" />
            )}
            {!isLoading && overview?.recentActivities && overview.recentActivities.length > 0 && (
              <div className="space-y-2">
                {overview.recentActivities.slice(0, 8).map((activity, index) => (
                  <div key={`${activity.type}-${index}`} className="rounded-lg border border-gray-100 px-3 py-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.happenedAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{activity.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Không tải được dữ liệu dashboard. Vui lòng thử lại.
        </div>
      )}
    </div>
  )
}
