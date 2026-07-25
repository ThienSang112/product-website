const User = require("../../models/user.model");
const md5 = require("md5");

// [GET] /user/login (Hiển thị form đăng nhập)
module.exports.login = (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản"
    });
};

// [POST] /user/login (Xử lý khi bấm nút Đăng nhập)
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // 1. Tìm xem email này có tồn tại trong DB không
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        return res.send(`<script>alert("Email không tồn tại!"); window.history.back();</script>`);
    }

    // 2. Kiểm tra mật khẩu (so sánh mật khẩu khách nhập đã mã hóa MD5 với mật khẩu trong DB)
    if (md5(password) !== user.password) {
        return res.send(`<script>alert("Sai mật khẩu!"); window.history.back();</script>`);
    }

    // 3. Kiểm tra trạng thái tài khoản
    if (user.status === "inactive") {
        return res.send(`<script>alert("Tài khoản đang bị khóa!"); window.history.back();</script>`);
    }

    // 4. Nếu thành công -> Lưu tokenUser vào Cookie trên trình duyệt của khách
    res.cookie("tokenUser", user.tokenUser, {
        expires: new Date(Date.now() + 86400000) // Cookie tồn tại trong 1 ngày (86400000 ms)
    });

    // 5. Chuyển hướng về trang chủ
    res.redirect("/");
};

// [GET] /user/logout (Xử lý đăng xuất)
module.exports.logout = (req, res) => {
    // Xóa cái cookie chứa token đi là mất phiên đăng nhập
    res.clearCookie("tokenUser");
    res.redirect("/");
};

// [GET] /user/register (Hiển thị form đăng ký)
module.exports.register = (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    });
};

// [POST] /user/register (Xử lý lưu dữ liệu khi bấm nút Đăng ký)
module.exports.registerPost = async (req, res) => {
    try {
        // 1. Kiểm tra xem email khách nhập đã tồn tại trong Database chưa
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        });

        // Nếu đã tồn tại thì báo lỗi và quay lại trang trước
        if (existEmail) {
            return res.send(`<script>alert("Email này đã được sử dụng!"); window.history.back();</script>`);
        }

        // 2. Mã hóa mật khẩu người dùng nhập vào bằng MD5
        req.body.password = md5(req.body.password);

        // 3. Tạo ra một chuỗi tokenUser ngẫu nhiên (Dùng email ghép với thời gian hiện tại rồi mã hóa)
        req.body.tokenUser = md5(req.body.email + Date.now());

        // 4. Lưu thông tin tài khoản mới vào Database
        const user = new User(req.body);
        await user.save();

        // 5. Đăng ký xong thì tự động đăng nhập luôn bằng cách lưu token vào Cookie (thời hạn 1 ngày)
        res.cookie("tokenUser", user.tokenUser, {
            expires: new Date(Date.now() + 86400000)
        });

        // 6. Thông báo thành công và đẩy về trang chủ
        res.send(`<script>alert("Đăng ký tài khoản thành công!"); window.location.href = "/";</script>`);

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.send(`<script>alert("Có lỗi xảy ra, vui lòng thử lại!"); window.history.back();</script>`);
    }
};