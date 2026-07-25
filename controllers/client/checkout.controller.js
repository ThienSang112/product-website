const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const generate = require("../../helpers/generate"); // Đảm bảo đường dẫn đúng

// [GET] /checkout (Hiển thị trang thanh toán)
module.exports.index = async (req, res) => {
    try {
        let products = [];
        let totalPrice = 0;
        let isBuyNow = false;

        // 1. Kiểm tra xem có đang Mua ngay không
        if (req.session.buyNowProduct) {
            const item = req.session.buyNowProduct;
            products = [item]; // Tạo mảng chứa 1 sản phẩm mua ngay
            totalPrice = item.productInfo.price * item.quantity;
            isBuyNow = true;
        } else {
            // 2. Nếu không, lấy từ giỏ hàng như cũ
            const cart = await Cart.findOne({ _id: req.cookies.cartId });
            
            if (!cart || cart.products.length === 0) {
                return res.redirect("/cart");
            }

            // Lấy chi tiết sản phẩm
            for (const item of cart.products) {
                const productInfo = await Product.findOne({ _id: item.product_id });
                item.productInfo = productInfo;
                totalPrice += productInfo.price * item.quantity;
            }
            products = cart.products;
        }

        // 3. Render trang checkout với dữ liệu đã xử lý
        res.render("client/pages/checkout/index", {
            pageTitle: "Thanh toán đơn hàng",
            products: products, // Thay vì truyền 'cart', ta truyền 'products'
            totalPrice: totalPrice,
            isBuyNow: isBuyNow
        });
    } catch (error) {
        console.error("Lỗi trang thanh toán:", error);
        res.redirect("/cart");
    }
};

// [POST] /checkout/order (Xử lý khi bấm nút Đặt hàng)
module.exports.order = async (req, res) => {
    const orderCode = "DH" + generate.generateRandomString(8); 
    
    try {
        let orderProducts = [];
        let totalPrice = 0;
        let cartId = null; // Để dùng khi xóa giỏ hàng nếu là mua bình thường

        // --- LỰA CHỌN LOGIC: MUA NGAY (SESSION) HOẶC MUA TỪ GIỎ HÀNG ---
        if (req.session.buyNowProduct) {
            // Mua ngay
            const item = req.session.buyNowProduct;
            orderProducts.push({
                product_id: item.product_id,
                price: item.productInfo.price,
                quantity: item.quantity
            });
            totalPrice = item.productInfo.price * item.quantity;
        } else {
            // Mua từ giỏ hàng
            const cart = await Cart.findOne({ _id: req.cookies.cartId });
            cartId = cart._id;
            
            for (const item of cart.products) {
                const productInfo = await Product.findOne({ _id: item.product_id });
                totalPrice += productInfo.price * item.quantity;
                
                orderProducts.push({
                    product_id: item.product_id,
                    price: productInfo.price,
                    quantity: item.quantity
                });
            }
        }

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 4);

        const orderData = {
            user_id: res.locals.user.id,
            orderCode: orderCode,
            cart_id: cartId, // Sẽ là null nếu là mua ngay
            userInfo: {
                fullName: req.body.fullName,
                phone: req.body.phone,
                address: req.body.address
            },
            products: orderProducts,
            totalPrice: totalPrice,
            paymentMethod: req.body.paymentMethod,
            estimatedDeliveryDate: deliveryDate
        };

        // 3. Lưu đơn hàng vào MongoDB
        const order = new Order(orderData);
        await order.save();

        // 4. Phát tín hiệu Socket.io cho Admin
        const io = req.app.get("io");
        io.emit("SERVER_NEW_ORDER", {
            message: `Có đơn hàng mới! Mã đơn: ${orderCode}`,
            orderId: order.id
        });

        // 5. Dọn dẹp sau khi lưu thành công
        if (req.session.buyNowProduct) {
            req.session.buyNowProduct = null; // Xóa dữ liệu mua ngay tạm thời
        } else if (cartId) {
            await Cart.updateOne({ _id: cartId }, { products: [] }); // Xóa giỏ hàng
        }

        // 6. Chuyển hướng sang trang thành công
        res.redirect(`/checkout/success/${order.id}`);

    } catch (error) {
        console.error("Lỗi đặt hàng:", error);
        res.redirect("/checkout");
    }
};

module.exports.success = async (req, res) => {
    // Tìm đơn hàng dựa trên ID mà bạn đã redirect tới
    const order = await Order.findById(req.params.id);
    
    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order // <-- Truyền cả object order sang để view lấy mã
    });
};

// controllers/client/buyNow/checkout.controller.js
module.exports.buyNow = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId });

    if (!product) return res.redirect("/products");

    // Lưu tạm vào session
    req.session.buyNowProduct = {
        product_id: productId,
        productInfo: product,
        quantity: 1
    };

    res.redirect("/checkout");
};