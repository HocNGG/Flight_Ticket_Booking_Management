# ✈️ Flight Ticket Booking Management System

Hệ thống quản lý và đặt vé máy bay toàn diện với giao diện hiện đại, hỗ trợ quản lý chuyến bay, vé, sân bay, lớp vé và báo cáo doanh thu.

A comprehensive flight ticket booking and management system with modern UI, supporting flight management, ticket booking, airport management, ticket class configuration, and revenue reporting.

---

## 📋 Mục Lục / Table of Contents

- [Tính Năng / Features](#-tính-năng--features)
- [Công Nghệ / Technology Stack](#-công-nghệ--technology-stack)
- [Cài Đặt / Installation](#-cài-đặt--installation)
- [Cấu Trúc Dự Án / Project Structure](#-cấu-trúc-dự-án--project-structure)
- [Hướng Dẫn Sử Dụng / Usage](#-hướng-dẫn-sử-dụng--usage)
- [Các Lệnh Khả Dụng / Available Scripts](#-các-lệnh-khả-dụng--available-scripts)
- [Các Route Chính / Main Routes](#-các-route-chính--main-routes)
- [Đóng Góp / Contributing](#-đóng-góp--contributing)

---

## ✨ Tính Năng / Features

### Dành cho Khách Hàng (Users) / Customer Features:
- 🏠 **Trang chủ** - Khám phá chuyến bay và quảng cáo
- 🔍 **Tìm kiếm và đặt chuyến bay** - Tìm chuyến bay theo điểm đi/đến, ngày
- 💺 **Chọn ghế** - Giao diện trực quan để lựa chọn ghế ngồi
- 💳 **Thanh toán** - Xử lý thanh toán an toàn
- 📱 **Quản lý đặt chỗ** - Xem lịch sử đặt vé

### Dành cho Quản Trị Viên (Admin) / Admin Features:
- ✈️ **Quản lý Chuyến Bay** - Tạo, cập nhật, xóa chuyến bay
- 🎫 **Quản lý Vé** - Theo dõi vé bán, trạng thái vé
- 🏢 **Quản lý Sân Bay** - Quản lý thông tin sân bay, mã IATA
- 📊 **Lớp Vé** - Cấu hình các loại ghế (Economy, Business, First Class)
- 📈 **Báo Cáo Doanh Thu** - Xem doanh thu theo tháng và năm
- ⚙️ **Quy Định** - Quản lý các quy định hành khách

---

## 🛠️ Công Nghệ / Technology Stack

### Frontend
- **React 18.2** - UI library
- **Vite 6.3** - Lightning fast build tool
- **React Router DOM 6.22** - Client-side routing
- **Bootstrap 5.3** - CSS framework
- **React Bootstrap 2.10** - Bootstrap components for React
- **Recharts 2.15** - Data visualization charts
- **SweetAlert2** - Elegant popup alerts
- **React Toastify** - Toast notifications
- **React Icons 5.5** - Icon library
- **Swiper 11.2** - Carousel/slider component
- **FontAwesome 6.7** - Icon fonts

### Development
- **ESLint 9.25** - Code quality & style checking
- **Vite plugins & React Refresh** - Fast HMR

---

## 📦 Cài Đặt / Installation

### Yêu cầu / Requirements
- Node.js (v16 hoặc cao hơn / v16 or higher)
- npm hoặc yarn

### Các bước cài đặt / Setup Steps

1. **Clone repository:**
```bash
git clone https://github.com/antss50/Flight-Ticket-Booking-Management.git
cd Flight-Ticket-Booking-Management
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Cấu hình API:**
- Kiểm tra file `src/utils/api.js` để cấu hình base URL của backend API
- Đảm bảo backend API đang chạy

4. **Khởi động development server:**
```bash
npm run dev
```

5. **Mở trình duyệt:**
```
http://localhost:5173
```

---

## 📁 Cấu Trúc Dự Án / Project Structure

```
src/
├── components/           # Các component tái sử dụng
│   ├── AdsCard.jsx      # Card quảng cáo
│   ├── FlightCard.jsx   # Card thông tin chuyến bay
│   ├── TicketCard.jsx   # Card thông tin vé
│   ├── Header.jsx       # Header navigation
│   ├── Footer.jsx       # Footer
│   ├── Sidebar.jsx      # Sidebar menu (admin)
│   ├── ImgSlide.jsx     # Image slider/carousel
│   └── ToastMessage.jsx # Toast notification component
│
├── pages/               # Trang/views
│   ├── Home.jsx         # Trang admin dashboard
│   ├── UserHome.jsx     # Trang chủ khách hàng
│   ├── Login.jsx        # Trang đăng nhập
│   ├── Flights.jsx      # Danh sách chuyến bay (admin)
│   ├── CreateFlight.jsx # Tạo chuyến bay mới
│   ├── BookTicket.jsx   # Đặt vé chuyến bay
│   ├── ChooseSeat.jsx   # Chọn ghế
│   ├── Tickets.jsx      # Danh sách vé (admin)
│   ├── CreateTicket.jsx # Tạo vé mới
│   ├── Airports.jsx     # Danh sách sân bay
│   ├── CreateAirport.jsx# Tạo sân bay mới
│   ├── TicketClasses.jsx# Quản lý lớp vé
│   ├── CreateTicketClass.jsx # Tạo lớp vé
│   ├── MonthRevenue.jsx # Báo cáo doanh thu tháng
│   ├── YearRevenue.jsx  # Báo cáo doanh thu năm
│   ├── Regulations.jsx  # Quản lý quy định
│   └── PaymentReturn.jsx# Trang xác nhận thanh toán
│
├── utils/               # Các utility functions
│   ├── api.js          # Cấu hình API & HTTP requests
│   └── authFetch.js    # Authenticated API calls
│
├── assets/              # Hình ảnh, fonts, etc.
├── App.jsx              # Root component & routes
├── main.jsx             # Entry point
├── App.css              # Global styles
└── index.css            # Global CSS
```

---

## 📖 Hướng Dẫn Sử Dụng / Usage

### Đậu Khách Hàng / For Normal Users:

1. **Truy cập trang chủ**: `http://localhost:5173`
2. **Tìm chuyến bay**: Chọn điểm đi/đến, ngày khởi hành
3. **Chọn chuyến bay**: Xem theo dõi và chọn chuyến bay phù hợp
4. **Đặt vé**: Nhập thông tin hành khách
5. **Chọn ghế**: Lựa chọn ghế ngồi trên máy bay
6. **Thanh toán**: Hoàn tất thanh toán vé

### Dành cho Quản Trị Viên / For Admins:

1. **Đăng nhập**: Truy cập `/login` với tài khoản admin
2. **Dashboard**: Truy cập `/admin` hoặc `/home`
3. **Quản lý chuyến bay**: `/flights` - Thêm, sửa, xóa chuyến bay
4. **Quản lý vé**: `/tickets` - Theo dõi vé bán
5. **Quản lý sân bay**: `/airports` - Cấu hình sân bay
6. **Quản lý lớp vé**: `/ticket-classes` - Thiết lập loại ghế
7. **Báo cáo doanh thu**: `/month-revenue`, `/year-revenue` - Phân tích doanh thu
8. **Quy định**: `/regulations` - Quản lý quy định hành khách

---

## 🚀 Các Lệnh Khả Dụng / Available Scripts

```bash
# Khởi động dev server / Start development server
npm run dev

# Build cho production / Build for production
npm run build

# Preview production build / Preview production build
npm run preview

# Kiểm tra code style / Check code style
npm lint
```

---

## 🗺️ Các Route Chính / Main Routes

| Route | Loại | Mô Tả | Access |
|-------|------|-------|--------|
| `/` | Public | Trang chủ khách hàng | Everyone |
| `/login` | Public | Trang đăng nhập | Everyone |
| `/book-ticket/:flightId` | Public | Đặt vé chuyến bay | Users |
| `/choose-seat/:flightId` | Public | Chọn ghế | Users |
| `/payment-return` | Public | Xác nhận thanh toán | Users |
| `/admin` or `/home` | Protected | Dashboard admin | Admin only |
| `/flights` | Protected | Quản lý chuyến bay | Admin only |
| `/create-flight` | Protected | Tạo chuyến bay | Admin only |
| `/tickets` | Protected | Quản lý vé | Admin only |
| `/create-ticket` | Protected | Tạo vé | Admin only |
| `/airports` | Protected | Quản lý sân bay | Admin only |
| `/create-airport` | Protected | Tạo sân bay | Admin only |
| `/ticket-classes` | Protected | Quản lý lớp vé | Admin only |
| `/create-ticket-class` | Protected | Tạo lớp vé | Admin only |
| `/month-revenue` | Protected | Doanh thu tháng | Admin only |
| `/year-revenue` | Protected | Doanh thu năm | Admin only |
| `/regulations` | Protected | Quy định | Admin only |

---

## 🔐 Xác Thực / Authentication

Hệ thống sử dụng JWT tokens để xác thực:
- Access token lưu trong `localStorage` với key `access_token`
- Các route được bảo vệ kiểm tra token trước khi cho phép truy cập
- Token tự động gửi trong request header qua `authFetch.js`

---

## 📞 Hỗ Trợ / Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub repository.

If you encounter any issues or have questions, please create an issue on the GitHub repository.
