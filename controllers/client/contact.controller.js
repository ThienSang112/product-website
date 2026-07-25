const Contact = require("../../models/contact.model");

// [GET] /contact (Hàm cũ giữ nguyên)
module.exports.index = (req, res) => {
    res.render("client/pages/contact/index", {
        pageTitle: "Liên hệ"
    });
};

// [POST] /contact (Hàm mới xử lý lưu dữ liệu)
module.exports.postContact = async (req, res) => {
    try {
        // req.body chứa toàn bộ thông tin khách nhập từ Form (fullName, email, phone...)
        const newContact = new Contact(req.body);
        
        // Lưu vào MongoDB
        await newContact.save();

        // Trả về một đoạn script nhỏ để báo thành công bằng hộp thoại và tự tải lại trang
        res.send(`
            <script>
                alert("Cảm ơn bạn! Lời nhắn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.");
                window.location.href = "/contact";
            </script>
        `);

    } catch (error) {
        console.error("Lỗi gửi liên hệ:", error);
        res.send(`
            <script>
                alert("Có lỗi xảy ra, vui lòng thử lại sau!");
                window.location.href = "/contact";
            </script>
        `);
    }
};