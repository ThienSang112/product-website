const User = require("../../models/user.model");

// [GET] /admin/users
module.exports.index = async (req, res) => {
    try {
        // Lấy tất cả user chưa bị xóa
        const records = await User.find({ deleted: false });

        // Trả về giao diện pug tương ứng
        res.render("admin/pages/users/index", {
            pageTitle: "Quản lý khách hàng",
            records: records
        });
    } catch (error) {
        console.log("Lỗi lấy danh sách khách hàng:", error);
        res.redirect("back");
    }
};

// [DELETE] /admin/users/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Xóa mềm: Không xóa mất data mà chỉ cập nhật trường deleted thành true
        await User.updateOne({ _id: id }, { deleted: true });
        
        res.json({ code: "success", message: "Đã xóa thành công!" });
    } catch (error) {
        res.json({ code: "error", message: "Xóa thất bại!" });
    }
};

// [GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Tìm thông tin khách hàng trong Database
        const user = await User.findOne({ _id: id, deleted: false });
        
        // Render ra file edit.pug và gửi cục data 'user' sang
        res.render("admin/pages/users/edit", {
            pageTitle: "Sửa khách hàng",
            user: user
        });
    } catch (error) {
        res.redirect("/admin/users"); 
    }
};

// [POST] /admin/users/edit/:id
module.exports.editPost = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Nếu người dùng không nhập mật khẩu mới, ta phải xóa trường password đi 
        // để tránh việc cập nhật mật khẩu thành chuỗi rỗng
        if(req.body.password == "") {
            delete req.body.password;
        } else {
            // Lưu ý: Nếu bạn có dùng MD5 mã hóa mật khẩu thì thêm bước mã hóa ở đây nhé
            // Ví dụ: req.body.password = md5(req.body.password);
        }
        
        // Cập nhật dữ liệu mới vào DB
        await User.updateOne({ _id: id }, req.body);
        
        // Sửa xong thì quay lại trang danh sách khách hàng
        res.redirect("/admin/users");
    } catch (error) {
        console.log("Lỗi cập nhật người dùng:", error);
        res.redirect("back");
    }
};

