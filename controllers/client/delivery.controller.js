const Order = require("../../models/order.model");

// [GET] /giao-hang
module.exports.index = async (req, res) => {
    // Lấy mã từ URL (nếu có)
    const orderCode = req.query.orderCode; 
    
    let order = null;
    if (orderCode) {
        order = await Order.findOne({ orderCode: orderCode });
    }

    res.render("client/pages/delivery/index", {
        pageTitle: "Tra cứu đơn hàng",
        order: order,
        orderCode: orderCode
    });
};
module.exports.tracking = async (req, res) => {
    const orderCode = req.body.orderCode; // Lấy từ ô input nhập mã
    const order = await Order.findOne({ orderCode: orderCode });

    res.render("client/pages/delivery/index", {
        pageTitle: "Tra cứu đơn hàng",
        order: order,
        orderCode: orderCode
    });
};