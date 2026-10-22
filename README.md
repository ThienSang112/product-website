# 🛒 Product Website (E-commerce Web Application)

Ứng dụng web thương mại điện tử full-stack được xây dựng bằng **Node.js, Express.js và MongoDB**, áp dụng mô hình kiến trúc **MVC (Model - View - Controller)**. Hệ thống bao gồm đầy đủ hai phân hệ chính dành cho Khách hàng (Client) và Quản trị viên (Admin).

---

## 🚀 Công nghệ sử dụng (Tech Stack)

* **Backend:** Node.js, Express.js
* **Database & ORM:** MongoDB, Mongoose
* **Template Engine:** Pug
* **Authentication & Security:** Session, Cookie, Password Hashing
* **Version Control:** Git, GitHub

---

## 🌟 Tính năng chính (Key Features)

### 1. Phân hệ Khách hàng (Client)
* **Trang chủ & Sản phẩm:** Hiển thị danh sách sản phẩm nổi bật, trang chi tiết sản phẩm, hệ thống tìm kiếm và phân loại theo danh mục (phụ kiện, sản phẩm chính,...).
* **Giỏ hàng & Đặt hàng (Cart & Checkout):** Thêm/sửa/xóa sản phẩm trong giỏ hàng, thực hiện quy trình thanh toán và đặt hàng trực tuyến.
* **Tài khoản người dùng:** Đăng ký, đăng nhập, quản lý thông tin cá nhân và theo dõi lịch sử đơn hàng.
* **Trang thông tin & Chính sách:** Các trang giới thiệu, tin tức, tuyển dụng, chính sách bảo hành, đổi trả và trả góp.

### 2. Phân hệ Quản trị viên (Admin Dashboard)
* **Bảng điều khiển (Dashboard):** Thống kê tổng quan dữ liệu hệ thống, doanh thu và hoạt động kinh doanh.
* **Quản lý sản phẩm (Products):** Thêm, sửa, xóa, cập nhật thông tin và trạng thái sản phẩm.
* **Quản lý tài khoản & Phân quyền (Accounts & Roles):** Quản lý nhân sự/admin hệ thống, thiết lập quyền hạn truy cập (phân quyền Role-based).
* **Quản lý đơn hàng & Liên hệ:** Tiếp nhận, xử lý đơn hàng của khách và quản lý các thông tin liên hệ gửi về hệ thống.

---

## 📂 Cấu trúc dự án (Project Structure)

```text
product-Website/
│
├── config/         # Cấu hình kết nối Database và hệ thống
├── controllers/    # Xử lý logic nghiệp vụ (Admin & Client)
├── middlewares/    # Bộ lọc trung gian (Xác thực quyền, kiểm tra bảo mật)
├── models/         # Định nghĩa schema và kết nối cơ sở dữ liệu MongoDB
├── public/         # Tài nguyên tĩnh (CSS, JavaScript, Hình ảnh)
├── routers/        # Định tuyến URL (Admin & Client routes)
├── views/          # Giao diện người dùng sử dụng Template Engine Pug
├── .env            # Biến môi trường
├── index.js        # File khởi chạy ứng dụng chính
└── package.json    # Quản lý dependencies và scripts
