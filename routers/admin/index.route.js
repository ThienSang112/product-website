const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const accountRoutes = require("./account.route");
const userRoutes = require("./user.route");
const revenueRoutes = require("./revenue.route");
const roleRoutes = require("./role.route");
const contactRoutes = require("./contact.route");
const authRoutes = require("./auth.route");
const systemConfig = require("../../config/system");


module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    // Phân luồng: Nếu gõ /admin/dashboard thì chạy vào dashboardRoutes
    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);

    app.use(PATH_ADMIN + "/products", productRoutes);

    app.use(PATH_ADMIN + "/accounts", accountRoutes);

    app.use(PATH_ADMIN + "/users", userRoutes);

    app.use(PATH_ADMIN + "/revenue", revenueRoutes);

    app.use(PATH_ADMIN + "/roles", roleRoutes);

    app.use(PATH_ADMIN + "/auth", authRoutes);

    app.use(PATH_ADMIN + "/contacts", contactRoutes);



}