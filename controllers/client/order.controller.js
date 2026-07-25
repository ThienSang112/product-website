const Order = require("../../models/order.model");
const generate = require("../../helpers/generate");
const Product = require("../../models/product.model");


module.exports.create = async (req, res) => {
    // 1. Tạo mã đơn hàng mới
    const orderCode = "DH" + generate.generateRandomString(8);

    // 2. Lưu vào database (dữ liệu lấy từ form thanh toán)
    const dataOrder = {
        orderCode: orderCode,
        // ... các trường khác như userInfo, products, totalPrice...
        status: "pending"
    };

    const order = new Order(dataOrder);
    await order.save();

    // 3. Chuyển hướng sang trang thành công
    res.redirect(`/order/success/${order.id}`);
};

module.exports.success = async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.render("client/pages/order/success", {
        pageTitle: "Đặt hàng thành công",
        order: order
    });
};

// controllers/client/order.controller.js
module.exports.list = async (req, res) => {
    // Tìm các đơn hàng của user đã đăng nhập
    const orders = await Order.find({ user_id: res.locals.user.id }).sort({ createdAt: -1 });

    // Lấy thông tin sản phẩm (tên và ảnh) cho từng đơn hàng
    for (const order of orders) {
        for (const item of order.products) {
            const product = await Product.findOne({ _id: item.product_id }).select("title thumbnail price");
            item.productInfo = product;
        }
    }

    res.render("client/pages/order/list", {
        pageTitle: "Lịch sử đặt hàng",
        orders: orders
    });
};

// Sửa lại hàm này trong controllers/client/order.controller.js
module.exports.orders = async (req, res) => {
    // 1. Kiểm tra đăng nhập
    if (!res.locals.user) {
        return res.redirect("/user/login");
    }

    // 2. Tìm theo user_id (Đã lưu khi đặt hàng)
    const orders = await Order.find({ user_id: res.locals.user.id }).sort({ createdAt: -1 });

    // 3. Lấy thông tin sản phẩm
    for (const order of orders) {
        for (const item of order.products) {
            const product = await Product.findOne({ _id: item.product_id }).select("title thumbnail");
            item.productInfo = product || { title: "Sản phẩm đã xóa", thumbnail: "" };
        }
    }

    // 4. Render đúng file pug
    res.render("client/pages/order/list", {
        pageTitle: "Lịch sử đặt hàng",
        orders: orders
    });
};