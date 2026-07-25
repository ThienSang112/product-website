const Review = require("../../models/review.model");
const Order = require("../../models/order.model");

module.exports.addReview = async (req, res) => {
    const { product_id, rating, comment } = req.body;
    const user_id = res.locals.user.id; // Giả sử bạn lưu user vào res.locals khi đăng nhập

    // Kiểm tra xem user đã mua sản phẩm này chưa
    const isPurchased = await Order.findOne({
        "products.product_id": product_id,
        user_id: user_id,
        status: "success" // Chỉ cho đánh giá khi đơn hàng đã hoàn tất
    });

    if (!isPurchased) {
        req.flash("error", "Bạn cần mua sản phẩm này mới được đánh giá!");
        return res.redirect("back");
    }

    const newReview = new Review({ product_id, user_id, rating, comment });
    await newReview.save();
    
    req.flash("success", "Đánh giá thành công!");
    res.redirect("back");
};