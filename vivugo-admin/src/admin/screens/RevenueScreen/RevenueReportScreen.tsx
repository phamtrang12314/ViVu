import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { Bot, CalendarRange, DollarSign, Loader2, ShoppingBag, Sparkles, Trophy } from 'lucide-react'
import { dashboardApi } from '../../apis/dashboard.api'

const TIME_RANGES = [
  { label: '3 tháng', months: 3 },
  { label: '6 tháng', months: 6 },
  { label: '12 tháng', months: 12 }
]

const formatCurrency = (value: number) =>
  value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

export default function RevenueReportScreen() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonths, setSelectedMonths] = useState(12)
  const [aiQuestion, setAiQuestion] = useState('')

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-revenue-report', selectedYear, selectedMonths],
    queryFn: () => dashboardApi.getStats({ year: selectedYear, months: selectedMonths }).then((res) => res.data)
  })

  const aiMutation = useMutation({
    mutationFn: () =>
      dashboardApi.generateAiInsights({
        year: selectedYear,
        months: selectedMonths,
        question: aiQuestion.trim() || undefined
      }).then((res) => res.data)
  })

  const averageRevenue = useMemo(() => {
    if (!stats?.revenueTrend.length) return 0
    return stats.totalRevenue / stats.revenueTrend.length
  }, [stats])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    )
  }

  if (!stats) {
    return <div className='p-8 text-gray-500'>Không có dữ liệu doanh thu.</div>
  }

  return (
    <div className='min-h-screen space-y-6 bg-gray-50 p-8'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Thống kê doanh thu</h1>
          <p className='mt-1 text-sm text-gray-500'>Trang chi tiết doanh thu, tích hợp AI phân tích theo kỳ.</p>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm'>
            <CalendarRange size={18} className='text-blue-600' />
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className='bg-transparent text-sm font-semibold text-gray-700 outline-none'
            >
              {[2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className='flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm'>
            {TIME_RANGES.map((range) => (
              <button
                key={range.months}
                type='button'
                onClick={() => setSelectedMonths(range.months)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  selectedMonths === range.months ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <section className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'>
          <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
            <DollarSign size={22} />
          </div>
          <p className='text-sm font-semibold text-gray-500'>Tổng doanh thu</p>
          <p className='mt-2 text-2xl font-black text-gray-950'>{formatCurrency(stats.totalRevenue)}</p>
        </section>
        <section className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'>
          <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600'>
            <ShoppingBag size={22} />
          </div>
          <p className='text-sm font-semibold text-gray-500'>Booking trong kỳ</p>
          <p className='mt-2 text-2xl font-black text-gray-950'>{stats.totalBookings.toLocaleString('vi-VN')}</p>
        </section>
        <section className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'>
          <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
            <Trophy size={22} />
          </div>
          <p className='text-sm font-semibold text-gray-500'>Trung bình mỗi tháng</p>
          <p className='mt-2 text-2xl font-black text-gray-950'>{formatCurrency(averageRevenue)}</p>
        </section>
      </div>

      <section className='rounded-2xl border border-blue-100 bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='flex items-center gap-2 text-lg font-bold text-gray-900'>
              <Bot className='h-5 w-5 text-blue-600' />
              AI phân tích doanh thu
            </h2>
            <p className='mt-1 text-sm text-gray-500'>Tóm tắt xu hướng doanh thu, điểm mạnh và rủi ro theo dữ liệu hiện tại.</p>
          </div>
          <button
            onClick={() => aiMutation.mutate()}
            disabled={aiMutation.isPending}
            className='inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300'
          >
            {aiMutation.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Sparkles className='mr-2 h-4 w-4' />}
            Phân tích AI
          </button>
        </div>
        <input
          value={aiQuestion}
          onChange={(event) => setAiQuestion(event.target.value)}
          placeholder='Hỏi thêm cho AI: Tháng này nên tập trung tour nào để tăng doanh thu?'
          className='mt-4 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-400'
        />
        {aiMutation.data && (
          <div className='mt-4 grid gap-4 xl:grid-cols-3'>
            <div className='rounded-xl border border-blue-100 bg-blue-50/60 p-4 xl:col-span-2'>
              <h3 className='mb-2 text-sm font-black uppercase text-blue-700'>Nhận định AI</h3>
              <p className='whitespace-pre-wrap text-sm leading-6 text-slate-800'>{aiMutation.data.aiReport}</p>
            </div>
            <div className='space-y-3'>
              <div className='rounded-xl border border-emerald-100 bg-emerald-50/70 p-3'>
                <h4 className='text-sm font-black text-emerald-700'>Điểm chính</h4>
                <ul className='mt-2 space-y-1 text-sm text-slate-700'>
                  {aiMutation.data.highlights.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div className='rounded-xl border border-amber-100 bg-amber-50/70 p-3'>
                <h4 className='text-sm font-black text-amber-700'>Rủi ro</h4>
                <ul className='mt-2 space-y-1 text-sm text-slate-700'>
                  {aiMutation.data.risks.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-bold text-gray-900'>Doanh thu theo tháng</h2>
        <div className='mt-4 h-[360px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={stats.revenueTrend}>
              <defs>
                <linearGradient id='revenueReportGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#2563eb' stopOpacity={0.65} />
                  <stop offset='95%' stopColor='#2563eb' stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e5e7eb' />
              <XAxis dataKey='month' tickFormatter={(value) => `T${value}`} />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => `Tháng ${label}`} />
              <Area type='monotone' dataKey='revenue' name='Doanh thu' stroke='#2563eb' strokeWidth={3} fill='url(#revenueReportGradient)' />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-bold text-gray-900'>Top tour theo doanh thu</h2>
        <div className='mt-4 h-[320px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={stats.topSellingTours}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e5e7eb' />
              <XAxis dataKey='tourName' tickFormatter={(value: string) => (value.length > 18 ? `${value.slice(0, 18)}...` : value)} />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000000}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey='totalRevenue' name='Doanh thu' fill='#10b981' radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

