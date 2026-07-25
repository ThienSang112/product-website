const Account = require("../../models/account.model");
const md5 = require("md5");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render("admin/pages/auth/login", { pageTitle: "Đăng nhập Admin" });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const account = await Account.findOne({ email: email, deleted: false });

    if (!account) {
        return res.send(`<script>alert("Email không tồn tại!"); window.history.back();</script>`);
    }

    if (md5(password) !== account.password) {
        return res.send(`<script>alert("Sai mật khẩu!"); window.history.back();</script>`);
    }

    if (account.status === "inactive") {
        return res.send(`<script>alert("Tài khoản đã bị khóa!"); window.history.back();</script>`);
    }

    // Lưu token vào cookie để xác thực phiên làm việc
    res.cookie("token", account.token);
    res.redirect("/admin/dashboard");
};
// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    // Xóa cookie token
    res.clearCookie("token");
    // Chuyển hướng về trang đăng nhập
    res.redirect(`/admin/auth/login`);
};