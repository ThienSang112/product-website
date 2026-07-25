const Order = require("../../models/order.model");

module.exports.index = async (req, res) => {
    try {
        // 1. Lấy dữ liệu cho bảng chi tiết và tính toán tổng quát
        const orders = await Order.find({});

        let totalRevenue = 0;
        let totalItemsSold = 0;

        orders.forEach(order => {
            totalRevenue += order.totalPrice || 0;
            order.products.forEach(item => {
                totalItemsSold += item.quantity || 0;
            });
        });

        // 2. Lấy dữ liệu thống kê theo Ngày (Aggregation)
        const statsByDay = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        // 3. Lấy dữ liệu thống kê theo Tháng (Aggregation)
        const statsByMonth = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        // 4. Render tất cả ra View
        res.render("admin/pages/revenue/index", {
            pageTitle: "Thống kê doanh thu",
            totalOrders: orders.length,          // Biến bạn đang cần
            totalRevenue: totalRevenue.toLocaleString(), // Biến bạn đang cần
            totalItemsSold: totalItemsSold,       // Biến bạn đang cần
            statsByDay,
            statsByMonth,
            orders
        });
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
};