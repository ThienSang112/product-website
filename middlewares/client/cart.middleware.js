const mongoose = require("mongoose");
const Cart = require("../../models/cart.model");

const COOKIE_OPTIONS = { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true };

module.exports.cartId = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const cookieCartId = req.cookies.cartId;
        const validCookie = cookieCartId && mongoose.isValidObjectId(cookieCartId);
        let cart = null;

        if (user) {
            // Đã đăng nhập: giỏ hàng gắn với tài khoản
            cart = await Cart.findOne({ user_id: user.id });

            // Lần đầu: nếu trình duyệt đang giữ giỏ chưa thuộc ai thì gắn vào tài khoản
            if (!cart && validCookie) {
                cart = await Cart.findOne({ _id: cookieCartId, user_id: null });
                if (cart) {
                    cart.user_id = user.id;
                    await cart.save();
                }
            }

            // Vẫn chưa có thì tạo mới cho tài khoản
            if (!cart) {
                cart = await Cart.findOneAndUpdate(
                    { user_id: user.id },
                    { $setOnInsert: { products: [] } },
                    { upsert: true, new: true }
                );
            }

            // Đồng bộ cookie để các controller cũ (dùng req.cookies.cartId) vẫn chạy đúng
            if (cookieCartId !== cart.id) {
                res.cookie("cartId", cart.id, COOKIE_OPTIONS);
                req.cookies.cartId = cart.id;
            }
        } else {
            // Chưa đăng nhập: chỉ dùng giỏ chưa thuộc tài khoản nào
            if (validCookie) {
                cart = await Cart.findOne({ _id: cookieCartId, user_id: null });
            }

            // Cookie trỏ tới giỏ của người khác (vừa đăng xuất) hoặc giỏ không tồn tại -> bỏ cookie
            if (!cart && cookieCartId) {
                res.clearCookie("cartId");
                delete req.cookies.cartId;
            }
        }

        res.locals.globalCartCount = cart
            ? cart.products.reduce((sum, item) => sum + item.quantity, 0)
            : 0;
    } catch (error) {
        console.error("Lỗi middleware giỏ hàng:", error);
        res.locals.globalCartCount = 0;
    }
    next();
};