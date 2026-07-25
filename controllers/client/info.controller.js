// controllers/client/info.controller.js
module.exports.about = (req, res) => {
    res.render("client/pages/info/about", { pageTitle: "Giới thiệu công ty" });
};

module.exports.recruitment = (req, res) => {
    res.render("client/pages/info/recruitment", { pageTitle: "Tuyển dụng" });
};

module.exports.news = (req, res) => {
    res.render("client/pages/info/news", { pageTitle: "Tin tức công nghệ" });
};

module.exports.contact = (req, res) => {
    res.render("client/pages/info/contact", { pageTitle: "Liên hệ" });
};

//ham post lien he:controllers/client/info.controller.js
module.exports.contactPost = async (req, res) => {
    try {
        // 1. Tạo bản ghi mới từ dữ liệu form (req.body)
        const contact = new Contact(req.body);
        
        // 2. Lưu vào MongoDB
        await contact.save();

        // 3. Thông báo cho người dùng
        console.log("Đã lưu liên hệ thành công!");
        
        // Nếu bạn có dùng flash message:
        req.flash("success", "Cảm ơn bạn đã liên hệ, chúng tôi sẽ sớm phản hồi!");
        res.redirect("/lien-he");
        
    } catch (error) {
        console.error("Lỗi khi lưu liên hệ:", error);
        res.send("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
};