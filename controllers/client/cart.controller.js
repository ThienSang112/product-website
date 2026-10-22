// controllers/client/cart.controller.js
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// Hàm dùng chung: tìm giỏ theo cookie cartId, chưa có thì tạo mới và lưu cookie
const getOrCreateCart = async (req, res) => {
  const cartId = req.cookies.cartId;
  let cart = cartId ? await Cart.findOne({ _id: cartId }) : null;

  if (!cart) {
    cart = await Cart.create({ products: [] });
    res.cookie("cartId", cart._id.toString(), {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
  }

  return cart;
};

// [GET] /cart
module.exports.index = async (req, res) => {
  try {
    // Xóa session mua ngay nếu người dùng quay lại trang giỏ hàng bình thường
    if (req.session.buyNowProduct) {
      req.session.buyNowProduct = null;
    }

    const cart = await getOrCreateCart(req, res);
    console.log("CART PAGE:", cart.products.length, "dòng |", JSON.stringify(cart.products));

    let totalPrice = 0;

    if (cart.products && cart.products.length > 0) {
      for (const item of cart.products) {
        const productInfo = await Product.findOne({
          _id: item.product_id,
          deleted: false
        });

        if (productInfo) {
          item.productInfo = productInfo;
          totalPrice += productInfo.price * item.quantity;
        }
      }
    }

    res.render("client/pages/cart/index", {
      pageTitle: "Giỏ hàng",
      cart: cart,
      totalPrice: totalPrice
    });

  } catch (error) {
    console.error("Lỗi giỏ hàng:", error);
    res.redirect("/");
  }
};

// [GET] /cart/add/:productId
module.exports.add = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    if (!tokenUser) {
      return res.json({
        code: "unauth",
        message: "Vui lòng đăng nhập để mua hàng!"
      });
    }

    const productId = req.params.productId;
    const cart = await getOrCreateCart(req, res);

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const indexExistProduct = cart.products.findIndex(
      item => String(item.product_id) === productId
    );

    if (indexExistProduct !== -1) {
      // Đã có -> tăng số lượng lên 1
      cart.products[indexExistProduct].quantity += 1;
    } else {
      // Chưa có -> thêm mới với số lượng là 1
      cart.products.push({
        product_id: productId,
        quantity: 1
      });
    }
    console.log("ADD productId:", productId, "| cart:", JSON.stringify(cart.products));

    // Cập nhật lại database
    await Cart.updateOne(
      { _id: cart._id },
      { products: cart.products }
    );

    // Tổng số lượng của tất cả sản phẩm trong giỏ để hiển thị lên Header
    const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      code: "success",
      message: "Thêm vào giỏ hàng thành công!",
      totalCartItems: totalQuantity
    });

  } catch (error) {
    console.error("Lỗi thêm giỏ hàng:", error);
    res.json({ code: "error", message: "Có lỗi xảy ra!" });
  }
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  try {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;

    const cart = cartId ? await Cart.findOne({ _id: cartId }) : null;

    if (cart) {
      const newProducts = cart.products.filter(
        item => String(item.product_id) !== productId
      );

      await Cart.updateOne(
        { _id: cart._id },
        { products: newProducts }
      );

      res.json({
        code: "success",
        message: "Đã xóa sản phẩm khỏi giỏ hàng thành công!"
      });
    } else {
      res.json({ code: "error", message: "Giỏ hàng không tồn tại!" });
    }

  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
    res.json({ code: "error", message: "Có lỗi xảy ra khi xóa sản phẩm!" });
  }
};