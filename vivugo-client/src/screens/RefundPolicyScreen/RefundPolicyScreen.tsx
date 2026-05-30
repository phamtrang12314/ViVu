import { Link } from 'react-router-dom'
import { Clock, ShieldCheck, WalletCards } from 'lucide-react'

const policyRows = [
  { time: 'Trong 1 giờ đầu sau thanh toán', refund: 'Hoàn 100%' },
  { time: 'Trong 24 giờ sau thanh toán', refund: 'Hoàn 90%' },
  { time: 'Trước khởi hành từ 24 giờ trở lên', refund: 'Hoàn 70%' },
  { time: 'Trước khởi hành từ 12 đến dưới 24 giờ', refund: 'Hoàn 50%' },
  { time: 'Trước khởi hành từ 4 đến dưới 12 giờ', refund: 'Hoàn 20%' },
  { time: 'Dưới 4 giờ trước khởi hành', refund: 'Không thể hủy tour' }
]

export default function RefundPolicyScreen() {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
            <ShieldCheck size={16} />
            Chính sách hủy và hoàn tiền
          </p>
          <h1 className="text-3xl font-black text-slate-950 md:text-4xl">Quy định hoàn tiền ViVuGo</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Chính sách này áp dụng cho các đơn đã thanh toán. Đơn chưa thanh toán có thể hủy trực tiếp trong lịch sử đặt tour.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 bg-slate-900 px-5 py-4 text-sm font-bold text-white">
            <div>Thời điểm yêu cầu hủy</div>
            <div className="text-right">Mức hoàn tiền</div>
          </div>
          {policyRows.map((row) => (
            <div key={row.time} className="grid grid-cols-2 gap-4 border-t border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Clock className="shrink-0 text-blue-600" size={18} />
                <span>{row.time}</span>
              </div>
              <div className="text-right font-bold text-slate-950">{row.refund}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900">
          <div className="mb-2 flex items-center gap-2 font-bold">
            <WalletCards size={18} />
            Ghi chú xử lý
          </div>
          <p>
            Sau khi bạn gửi yêu cầu hủy đơn đã thanh toán, quản trị viên sẽ kiểm tra và duyệt hủy. Tiền hoàn sẽ được xử lý theo mốc thời gian hợp lệ tại thời điểm gửi yêu cầu.
          </p>
        </div>

        <div className="mt-8">
          <Link to="/account/historyTour" className="font-bold text-blue-600 hover:text-blue-800">
            Xem lịch sử đặt tour
          </Link>
        </div>
      </div>
    </div>
  )
}
