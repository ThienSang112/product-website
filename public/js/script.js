// Bắt tất cả các nút Thêm vào giỏ
const buttonsAddCart = document.querySelectorAll(".btn-add-cart");
// Tìm thẻ chứa số lượng trên thanh Header (chính là cái bạn khoanh đỏ)
const cartCountElement = document.querySelector(".cart-count");
const buttonsDeleteCartItem = document.querySelectorAll(".btn-delete");

if (buttonsAddCart.length > 0) {
    buttonsAddCart.forEach(button => {
        button.addEventListener("click", (event) => {
            // Chặn không cho web tải lại trang
            event.preventDefault(); 
            
            const href = button.getAttribute("href"); 

            // Gọi API ngầm lên server
            fetch(href)
                .then(res => res.json())
                .then(data => {
                    if (data.code === "success") {
                        // BƯỚC 1: CẬP NHẬT SỐ LƯỢNG MỚI LÊN HEADER
                        if (cartCountElement) {
                            cartCountElement.innerHTML = `(${data.totalCartItems})`;
                        }

                        // BƯỚC 2: HIỆN THÔNG BÁO THÀNH CÔNG
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công!',
                            text: data.message,
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    } else if (data.code === "warning") {
                        // BƯỚC 3: HIỆN THÔNG BÁO KHI BỊ TRÙNG
                        Swal.fire({
                            icon: 'warning',
                            title: 'Lưu ý!',
                            text: data.message,
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    } else if (data.code === "unauth") {
                        // BƯỚC 4: BẮT LỖI KHI CHƯA ĐĂNG NHẬP (MỚI THÊM)
                        Swal.fire({
                            icon: 'info',
                            title: 'Yêu cầu đăng nhập',
                            text: data.message,
                            showCancelButton: true,
                            confirmButtonText: 'Đăng nhập ngay',
                            cancelButtonText: 'Đóng',
                            confirmButtonColor: '#e60000'
                        }).then((result) => {
                            // Nếu khách hàng bấm nút "Đăng nhập ngay" -> Chuyển trang
                            if (result.isConfirmed) {
                                window.location.href = "/user/login";
                            }
                        });
                    }
                });
        });
    });
}

if (buttonsDeleteCartItem.length > 0) {
    buttonsDeleteCartItem.forEach(button => {
        button.addEventListener("click", (event) => {
            // Chặn không cho thẻ <a> tự chuyển trang ngay lập tức
            event.preventDefault(); 

            const href = button.getAttribute("href");

            // Bật popup hỏi xác nhận của SweetAlert2
            Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa?',
                text: "Sản phẩm này sẽ không còn nằm trong giỏ hàng của bạn!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#e60000', // Màu đỏ thương hiệu
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Đồng ý xóa',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                // Nếu khách hàng bấm nút "Đồng ý xóa"
                if (result.isConfirmed) {
                    // Gọi API ngầm đến route xóa của Backend
                    fetch(href)
                        .then(res => res.json())
                        .then(data => {
                            if (data.code === "success") {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Đã xóa thành công!',
                                    text: data.message,
                                    timer: 1500,
                                    showConfirmButton: false
                                }).then(() => {
                                    // Tải lại trang để giao diện tính lại tiền và ẩn dòng sản phẩm đi
                                    window.location.reload();
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Thất bại!',
                                    text: data.message
                                });
                            }
                        });
                }
            });
        });
    });
}

// ================= XỬ LÝ GỢI Ý TÌM KIẾM NHANH (LIVE SEARCH) =================
const searchInput = document.querySelector(".search-form input[name='keyword']");
const suggestBox = document.querySelector(".search-suggest-box");

if (searchInput && suggestBox) {
    searchInput.addEventListener("input", (event) => {
        const keyword = event.target.value.trim();

        // Nếu xóa hết chữ trong ô input thì ẩn hộp gợi ý đi luôn
        if (keyword.length === 0) {
            suggestBox.classList.remove("active");
            suggestBox.innerHTML = "";
            return;
        }

        // Gọi hàm Fetch API chạy ngầm gửi từ khóa lên Server
        fetch(`/search/suggest?keyword=${keyword}`)
            .then(res => res.json())
            .then(data => {
                if (data.code === "success" && data.products.length > 0) {
                    let htmlElements = "";
                    
                    // Lặp qua danh sách sản phẩm nhận được để dựng chuỗi HTML
                    data.products.forEach(item => {
                        htmlElements += `
                            <a href="/products/detail/${item._id}" class="suggest-item">
                                <img src="${item.thumbnail}" alt="${item.title}">
                                <div class="suggest-info">
                                    <span class="suggest-title">${item.title}</span>
                                    <span class="suggest-price">${item.price.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </a>
                        `;
                    });

                    suggestBox.innerHTML = htmlElements;
                    suggestBox.classList.add("active"); // Hiện hộp thoại lên màn hình
                } else {
                    // Trường hợp gõ chữ nhưng không có máy nào khớp tên
                    suggestBox.innerHTML = `<div style="padding: 12px; color: #999; text-align: center; font-size: 13px;">Không tìm thấy sản phẩm</div>`;
                    suggestBox.classList.add("active");
                }
            })
            .catch(err => console.error("Lỗi live search:", err));
    });

    // Sự kiện ẩn hộp gợi ý đi nếu người dùng click chuột ra ngoài vùng tìm kiếm
    document.addEventListener("click", (event) => {
        if (!searchInput.contains(event.target) && !suggestBox.contains(event.target)) {
            suggestBox.classList.remove("active");
        }
    });
}