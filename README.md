# 🛒 S-Mobile – Product Website (E-commerce)

Ứng dụng web thương mại điện tử bán điện thoại và phụ kiện, xây dựng bằng
Node.js, Express.js và MongoDB theo mô hình MVC. Gồm hai phân hệ: Khách hàng (Client)
và Quản trị viên (Admin).

🔗 **Demo:** https://product-website-9kch.onrender.com

> Server dùng gói miễn phí nên tự "ngủ" khi không có người truy cập.
> Lần mở đầu có thể mất khoảng 1 phút để khởi động.

## 🚀 Công nghệ sử dụng

- **Backend:** Node.js, Express.js
- **Cơ sở dữ liệu:** MongoDB (Mongoose ODM), MongoDB Atlas
- **Giao diện:** Pug (template engine), HTML, CSS, JavaScript
- **Xác thực:** Session, Cookie (token lưu trong cookie), băm mật khẩu bằng md5
- **Triển khai:** Render, MongoDB Atlas
- **Công cụ:** Git, GitHub

## 🌟 Tính năng chính

### Khách hàng (Client)
- Trang chủ, danh sách và chi tiết sản phẩm, lọc theo thương hiệu và khoảng giá, tìm kiếm
- Giỏ hàng gắn với tài khoản (đồng bộ giữa các trình duyệt), đặt hàng
- Đăng ký, đăng nhập, lịch sử đơn hàng
- Các trang thông tin: giao hàng, chính sách, liên hệ

### Quản trị viên (Admin)
- Dashboard thống kê và doanh thu
- Quản lý sản phẩm (thêm, sửa, xóa, đổi trạng thái)
- Quản lý tài khoản, người dùng và phân quyền theo vai trò (Role-based)
- Quản lý đơn hàng và thông tin liên hệ

## 📂 Cấu trúc dự án

product-website/
├── config/ # Cấu hình kết nối database và hệ thống
├── controllers/ # Xử lý logic nghiệp vụ (admin, client)
├── middlewares/ # Xác thực, phân quyền, giỏ hàng
├── models/ # Schema Mongoose
├── public/ # Tài nguyên tĩnh (CSS, JS, ảnh)
├── routers/ # Định tuyến (admin, client)
├── views/ # Giao diện Pug
├── .env.example # Mẫu biến môi trường
└── index.js # Điểm khởi chạy ứng dụng


## ⚙️ Cài đặt và chạy

1. Clone và cài thư viện:
   ```bash
   git clone https://github.com/ThienSang112/product-website.git
   cd product-website
   npm install
   ```
2. Tạo file `.env` từ `.env.example` và điền giá trị:

PORT=5001
MONGO_URL=mongodb://localhost:27017/product-Website
COOKIE_SECRET=<chuỗi bí mật bất kỳ>
SESSION_SECRET=<chuỗi bí mật khác>

3. Chạy ở chế độ phát triển:
   ```bash
   npm run dev
   ```
   Mở http://localhost:5001

## ☁️ Triển khai

Ứng dụng chạy trên **Render**, kết nối cơ sở dữ liệu **MongoDB Atlas**. Các khóa bí mật
được cấu hình bằng biến môi trường, không đưa vào mã nguồn.

## 🔧 Hướng phát triển

- Thay md5 bằng bcrypt để băm mật khẩu an toàn hơn
- Chuyển xác thực sang JWT
- Thêm kiểm tra dữ liệu đầu vào (validation) và xử lý lỗi tập trung
- Viết tài liệu API (Swagger) và kiểm thử
