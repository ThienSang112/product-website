const Account = require("../../models/account.model");
const Product = require("../../models/product.model");
// ... import các model khác của bạn

module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: { total: 0 },
        product: { total: 0 },
        account: { total: 0 },
        user: { total: 0 }
    };

    // Đếm số lượng từ Mongoose
    statistic.product.total = await Product.countDocuments({ deleted: false });
    statistic.account.total = await Account.countDocuments({ deleted: false });
    // ... thêm các model khác

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    });
};