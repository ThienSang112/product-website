// controllers/client/checkout.controller.js
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const generate = require("../../helpers/generate");

// [GET] /checkout
module.exports.index = async (req, res) => {
    try {
        let products = [];
        let totalPrice = 0;
        let isBuyNow = false;

        // 🔥 Phân định tường minh bằng query type=buynow và kiểm tra session tồn tại
        if (req.query.type === "buynow" && req.session.buyNowProduct) {
            const item = req.session.buyNowProduct;
            products = [item];
            totalPrice = item.productInfo.price * item.quantity;
            isBuyNow = true;
        } else {
            // Nếu không phải mua ngay, ép xóa session cũ để tránh bị kẹt dữ liệu
            if (req.session.buyNowProduct) {
                req.session.buyNowProduct = null;
            }

            const cart = await Cart.findOne({ _id: req.cookies.cartId });
            
            if (!cart || cart.products.length === 0) {
                return res.redirect("/cart");
            }

            for (const item of cart.products) {
                const productInfo = await Product.findOne({ _id: item.product_id, deleted: false });
                if (productInfo) {
                    item.productInfo = productInfo;
                    totalPrice += productInfo.price * item.quantity;
                }
            }
            products = cart.products;
        }

        res.render("client/pages/checkout/index", {
            pageTitle: "Thanh toán đơn hàng",
            products: products,
            totalPrice: totalPrice,
            isBuyNow: isBuyNow
        });
    } catch (error) {
        console.error("Lỗi trang thanh toán:", error);
        res.redirect("/cart");
    }
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const orderCode = "DH" + generate.generateRandomString(8); 
    
    try {
        let orderProducts = [];
        let totalPrice = 0;
        let cartId = null;

        if (req.session.buyNowProduct) {
            const item = req.session.buyNowProduct;
            orderProducts.push({
                product_id: item.product_id,
                price: item.productInfo.price,
                quantity: item.quantity
            });
            totalPrice = item.productInfo.price * item.quantity;
        } else {
            const cart = await Cart.findOne({ _id: req.cookies.cartId });
            if (!cart) return res.redirect("/cart");
            cartId = cart._id;
            
            for (const item of cart.products) {
                const productInfo = await Product.findOne({ _id: item.product_id });
                if (productInfo) {
                    totalPrice += productInfo.price * item.quantity;
                    orderProducts.push({
                        product_id: item.product_id,
                        price: productInfo.price,
                        quantity: item.quantity
                    });
                }
            }
        }

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 4);

        const orderData = {
            user_id: res.locals.user ? res.locals.user.id : null,
            orderCode: orderCode,
            cart_id: cartId,
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

        const order = new Order(orderData);
        await order.save();

        const io = req.app.get("io");
        if (io) {
            io.emit("SERVER_NEW_ORDER", {
                message: `Có đơn hàng mới! Mã đơn: ${orderCode}`,
                orderId: order.id
            });
        }

        if (req.session.buyNowProduct) {
            req.session.buyNowProduct = null; 
        } else if (cartId) {
            await Cart.updateOne({ _id: cartId }, { products: [] }); 
        }

        res.redirect(`/checkout/success/${order.id}`);

    } catch (error) {
        console.error("Lỗi đặt hàng:", error);
        res.redirect("/checkout");
    }
};

module.exports.success = async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order
    });
};

// [GET] /checkout/buy-now/:id
module.exports.buyNow = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId });

    if (!product) return res.redirect("/products");

    req.session.buyNowProduct = {
        product_id: productId,
        productInfo: product,
        quantity: 1
    };

    // 🔥 Gắn thêm ?type=buynow để trang checkout nhận diện chính xác
    res.redirect("/checkout?type=buynow");
};