# Bộ Testcase Dự Án ViVuGo

Tài liệu này gom các testcase chức năng chính cho client, admin và backend. Các testcase tự động đã được thêm ở `vivugo-backend/src/test/java`.

## Cách Chạy Test Tự Động

```powershell
cd D:\Ktruc\ViVuGo\vivugo-backend
.\mvnw test
```

## Backend - Unit Test Đã Có

| Mã | Khu vực | Mục tiêu | Kết quả mong đợi |
| --- | --- | --- | --- |
| BE-UT-01 | PaymentCodeUtils | Chuẩn hóa mã booking dạng `TBBK-...` | Trả về mã `tbbk-...` chữ thường đúng format |
| BE-UT-02 | PaymentCodeUtils | Trích mã booking dạng compact sau tiền tố ngân hàng | Trả về mã booking có gạch nối |
| BE-UT-03 | PaymentCodeUtils | Tìm mã booking đầu tiên trong nhiều nguồn text | Bỏ qua text rỗng/sai, lấy mã hợp lệ đầu tiên |
| BE-UT-04 | BookingService | Lấy trạng thái payment mới nhất | Trạng thái trả về theo `paymentDate` mới nhất |
| BE-UT-05 | BookingService | Tính thời gian còn lại cho booking hết hạn | Trả về `0` giây |
| BE-UT-06 | BookingService | Tính hoàn tiền trong 1 giờ sau thanh toán | Trả về `100%` |
| BE-UT-07 | BookingService | Tính hoàn tiền sát giờ khởi hành | Trả về `0%` |
| BE-UT-08 | BookingService | Webhook thanh toán đủ tiền | Booking `CONFIRMED`, lưu payment `SUCCESS`, gửi email |
| BE-UT-09 | BookingService | Webhook thanh toán thiếu tiền | Ném lỗi, không lưu payment |
| BE-UT-10 | BookingService | Webhook trùng mã giao dịch | Bỏ qua, không cập nhật booking |
| BE-UT-11 | BookingService | Hủy booking chưa thanh toán | Booking chuyển sang `CANCELED` |
| BE-UT-12 | BookingService | Hủy booking đã thanh toán còn được hoàn | Booking chuyển sang `CANCELLATION_REQUESTED`, refund `PENDING` |
| BE-UT-13 | AuthService | Đăng nhập bằng email khi username lookup không thấy | Trả về token Bearer và thông tin user |
| BE-UT-14 | AuthService | Đăng nhập tài khoản bị khóa | Trả về `success=false` |
| BE-UT-15 | AuthService | Đổi mật khẩu hợp lệ | Mã hóa mật khẩu mới và lưu account |

## Client - Testcase Thủ Công

| Mã | Chức năng | Tiền điều kiện | Bước test | Kết quả mong đợi |
| --- | --- | --- | --- | --- |
| CL-01 | Trang chủ | Backend chạy, có dữ liệu tour | Mở client, xem hero, danh mục, tour nổi bật | Trang load không lỗi, dữ liệu hiển thị đúng |
| CL-02 | Tìm/lọc tour | Có nhiều tour | Nhập từ khóa, chọn bộ lọc loại tour/địa điểm | Danh sách tour cập nhật theo tiêu chí |
| CL-03 | Chi tiết tour | Có tour active | Mở một tour | Hiển thị ảnh, lịch trình, giá, review, nút đặt tour |
| CL-04 | Đăng ký | Email/SĐT chưa tồn tại, có OTP hợp lệ | Nhập thông tin hợp lệ và OTP | Tài khoản được tạo, đăng nhập thành công |
| CL-05 | Đăng nhập | Có tài khoản customer | Nhập email/SĐT và mật khẩu đúng | Lưu token, chuyển về trang tài khoản/trang chủ |
| CL-06 | Đăng nhập sai | Có tài khoản customer | Nhập mật khẩu sai | Hiển thị thông báo lỗi, không lưu token |
| CL-07 | Đặt tour | Đã đăng nhập | Chọn tour, nhập số khách và thông tin người tham gia | Booking được tạo, chuyển sang bước thanh toán |
| CL-08 | Thanh toán | Booking đang `PROCESSING` | Mở màn thanh toán | Hiển thị mã booking, số tiền, QR/thông tin chuyển khoản |
| CL-09 | Lịch sử tour | Đã có booking | Vào tài khoản > lịch sử tour | Danh sách booking đúng trạng thái và số tiền |
| CL-10 | Hủy tour | Booking hợp lệ để hủy | Nhập lý do tối thiểu 5 ký tự và gửi | Booking hủy hoặc tạo yêu cầu hoàn tiền theo trạng thái thanh toán |
| CL-11 | Yêu thích | Đã đăng nhập | Thêm/xóa tour yêu thích | Danh sách yêu thích cập nhật đúng |
| CL-12 | Liên hệ | Không cần đăng nhập | Gửi form liên hệ hợp lệ | Thông báo gửi thành công, admin nhận được message |

## Admin - Testcase Thủ Công

| Mã | Chức năng | Tiền điều kiện | Bước test | Kết quả mong đợi |
| --- | --- | --- | --- | --- |
| AD-01 | Admin login | Có tài khoản admin | Nhập SĐT và mật khẩu đúng | Vào dashboard admin |
| AD-02 | Dashboard | Admin đã đăng nhập | Mở dashboard | Thống kê doanh thu, booking, tour hiển thị đúng |
| AD-03 | Quản lý tour | Có dữ liệu destination/type | Tạo tour mới hợp lệ | Tour được lưu và xuất hiện trong danh sách |
| AD-04 | Cập nhật tour | Có tour tồn tại | Sửa giá, lịch trình, trạng thái | Dữ liệu tour cập nhật đúng |
| AD-05 | Quản lý loại tour | Admin đã đăng nhập | Tạo/sửa/xóa loại tour | Danh sách loại tour cập nhật đúng |
| AD-06 | Quản lý destination | Admin đã đăng nhập | Tạo destination kèm ảnh | Destination lưu đúng ảnh và mô tả |
| AD-07 | Quản lý booking | Có booking | Lọc theo trạng thái, mở chi tiết | Thông tin khách, tour, payment đúng |
| AD-08 | Duyệt hủy/hoàn tiền | Có booking `CANCELLATION_REQUESTED` | Xử lý yêu cầu hoàn tiền | Trạng thái refund/booking cập nhật đúng |
| AD-09 | Quản lý review | Có review pending/approved | Duyệt hoặc ẩn review | Review hiển thị/ẩn đúng ở client |
| AD-10 | Tin nhắn liên hệ | Có message từ client | Mở chi tiết, phản hồi | Message chuyển trạng thái đã xử lý |

## Backend/API - Testcase Tích Hợp Gợi Ý

| Mã | API | Dữ liệu test | Kết quả mong đợi |
| --- | --- | --- | --- |
| API-01 | `POST /api/auth/login` | Email/SĐT đúng, password đúng | HTTP 200, `success=true`, có token |
| API-02 | `POST /api/auth/login` | Password sai | HTTP 200/401 theo controller, `success=false` |
| API-03 | `POST /api/bookings` | Token customer, tourID hợp lệ, số khách hợp lệ | Tạo booking `PROCESSING`, tổng tiền đúng |
| API-04 | `POST /api/sepay/webhook` | Nội dung có mã booking compact, số tiền đủ | Booking `CONFIRMED`, payment `SUCCESS` |
| API-05 | `POST /api/sepay/webhook` | Nội dung không có bookingID | Trả success để webhook không retry, không cập nhật booking |
| API-06 | `GET /api/tours` | Không filter | Trả danh sách tour active |
| API-07 | `GET /api/tours/{id}` | TourID tồn tại | Trả chi tiết tour, ảnh, lịch trình |
| API-08 | `POST /api/reviews` | Customer đã đi tour | Tạo review đúng rating/content |
| API-09 | `POST /api/contact` | Form liên hệ hợp lệ | Lưu message mới |
| API-10 | `GET /api/admin/bookings` | Token admin | Trả danh sách booking phân trang |
