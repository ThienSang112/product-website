// Bắt tất cả các nút Xóa trên màn hình
const buttonsDelete = document.querySelectorAll(".btn-delete-product");

if (buttonsDelete.length > 0) {
    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            // Hiển thị hộp thoại xác nhận mặc định của trình duyệt
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này?");
            
            if (isConfirm) {
                // Lấy ID sản phẩm từ thuộc tính data-id đã gán ở Pug
                const id = button.getAttribute("data-id");
                
                // Gọi API ngầm xuống Backend với method DELETE
                fetch(`/admin/products/delete/${id}`, {
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(data => {
                    if (data.code === "success") {
                        // Xóa xong thì tải lại trang để mất dòng dữ liệu đó
                        location.reload(); 
                    } else {
                        alert("Có lỗi xảy ra, không thể xóa!");
                    }
                });
            }
        });
    });
}

// ================= XỬ LÝ TÌM KIẾM TỰ ĐỘNG (LIVE SEARCH) =================
const formSearch = document.querySelector("#form-search");
const inputSearch = document.querySelector("#form-search input[name='keyword']");

if (inputSearch) {
    let timer;

    // Chặn hành vi nhấn phím Enter tự động tải lại trang của Form
    if (formSearch) {
        formSearch.addEventListener("submit", (e) => {
            e.preventDefault();
        });
    }

    inputSearch.addEventListener("input", (e) => {
        // Dòng này để test xem JS có nhận được chữ bạn gõ không
        console.log("Bạn vừa gõ: ", e.target.value); 

        clearTimeout(timer);

        timer = setTimeout(() => {
            const keyword = e.target.value.trim();
            const url = new URL(window.location.href);

            if (keyword) {
                url.searchParams.set("keyword", keyword);
            } else {
                url.searchParams.delete("keyword");
            }

            window.location.href = url.href;
        }, 500); 
    });

    // Tự động focus vào ô input
    inputSearch.focus();
    inputSearch.setSelectionRange(inputSearch.value.length, inputSearch.value.length);

} else {
    // Nếu HTML thiếu ID, nó sẽ báo lỗi đỏ lên đây cho bạn biết
    console.log("CẢNH BÁO: Không tìm thấy ô input tìm kiếm! Hãy kiểm tra lại file Pug.");
}

// ================= XỬ LÝ NÚT XÓA TÀI KHOẢN KHÁCH HÀNG =================
const buttonsDeleteUser = document.querySelectorAll(".btn-delete-user");

if (buttonsDeleteUser.length > 0) {
    buttonsDeleteUser.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa tài khoản khách hàng này?");
            
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                
                // Gửi API gọi hàm xóa bên Controller
                fetch(`/admin/users/delete/${id}`, {
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(data => {
                    if (data.code === "success") {
                        // Xóa thành công thì tải lại trang
                        location.reload(); 
                    } else {
                        alert("Có lỗi xảy ra, không thể xóa!");
                    }
                });
            }
        });
    });
}

// Xóa liên hệ
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      // Logic xác nhận trước khi xóa
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa liên hệ này không?");
      
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        
        // Gọi API xóa
        fetch(`/admin/contacts/delete/${id}`, {
          method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
          if(data.code === 200) {
            // Reload trang để cập nhật danh sách sau khi xóa thành công
            window.location.reload(); 
          } else {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
          }
        });
      }
    });
  });
}

// public/js/admin.js
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", () => {
        let permissions = [];
        const rows = tablePermissions.querySelectorAll("[data-name]");
        
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            
            if(name === "id") {
                inputs.forEach(input => {
                    permissions.push({ id: input.value, permissions: [] });
                });
            } else {
                inputs.forEach((input, index) => {
                    if(input.checked) {
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });

        // Gửi dữ liệu bằng fetch (PATCH)
        fetch("/admin/roles/permissions", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(permissions)
        })
        .then(res => res.json())
        .then(data => {
            if(data.code === 200) alert("Cập nhật phân quyền thành công!");
        });
    });
}

// ================= XỬ LÝ NÚT XÓA NHÓM QUYỀN (ROLES) =================
const listButtonDeleteRole = document.querySelectorAll("[button-delete-role]");
if (listButtonDeleteRole.length > 0) {
    listButtonDeleteRole.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa nhóm quyền này không?");
            
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                
                // Gửi request PATCH tới server
                fetch(`/admin/roles/delete/${id}?_method=PATCH`, {
                    method: "POST" // Hoặc "PATCH" tùy vào cấu hình method-override của bạn
                })
                .then(res => {
                    // Sau khi server xử lý xong, reload lại trang
                    window.location.reload(); 
                })
                .catch(err => {
                    alert("Có lỗi xảy ra, vui lòng thử lại!");
                });
            }
        });
    });
}