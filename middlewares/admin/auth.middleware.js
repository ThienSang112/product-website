const Account = require("../../models/account.model");
const Role = require("../../models/role.model"); // Import model Role

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect("/admin/auth/login");
        return;
    }

    const account = await Account.findOne({ token: req.cookies.token }).select("-password");
    if (!account) {
        res.redirect("/admin/auth/login");
        return;
    }

    // Lấy thông tin nhóm quyền của tài khoản này
    const role = await Role.findOne({ _id: account.role_id });
    
    // Gán thông tin account và quyền vào biến locals
    res.locals.user = account;
    res.locals.role = role; // Giờ đây view có thể dùng biến 'role'
    
    next();
};