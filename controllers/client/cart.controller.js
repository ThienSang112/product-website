// controllers/client/cart.controller.js
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    // Giả lập lấy một giỏ hàng cụ thể (Sau này bạn sẽ dùng cartId lưu ở Cookie)
    // Ở đây tạm thời tìm giỏ hàng đầu tiên hoặc tạo mới nếu chưa có để test giao diện
    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }

    let totalPrice = 0;

    // Lặp qua từng sản phẩm trong giỏ để lấy thông tin chi tiết (tên, ảnh, giá) từ bảng Product
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productInfo = await Product.findOne({
          _id: item.product_id,
          deleted: false
        });
        
        // Nhúng kèm thông tin sản phẩm vào object item để dùng bên file Pug
        item.productInfo = productInfo;
        
        // Tính tổng tiền của sản phẩm đó và cộng dồn vào tổng giỏ hàng
        totalPrice += productInfo.price * item.quantity;
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

//hàm xử lý thêm sản phầm vào giỏ hàng
module.exports.add = async (req, res) => {
    
    try {
        // ==========================================
        // 1. KIỂM TRA ĐĂNG NHẬP (CHÈN VÀO ĐÂY)
        // ==========================================
        const tokenUser = req.cookies.tokenUser;
        
        // Nếu không có token (chưa đăng nhập) -> Trả về mã lỗi "unauth"
        if (!tokenUser) {
            return res.json({
                code: "unauth",
                message: "Vui lòng đăng nhập để mua hàng!"
            });
        }
        // ==========================================

        const productId = req.params.productId;

        // 2. Tìm hoặc tạo giỏ hàng
        let cart = await Cart.findOne();
        if (!cart) {
            cart = await Cart.create({ products: [] });
        }

        // 3. Kiểm tra xem sản phẩm đã có trong giỏ chưa
        const existProduct = cart.products.find(item => item.product_id === productId);

        // NẾU ĐÃ CÓ (TRÙNG) -> Dừng lại và báo lỗi cảnh báo
        if (existProduct) {
            return res.json({
                code: "warning",
                message: "Sản phẩm này đã có trong giỏ hàng!"
            });
        }

        // NẾU CHƯA CÓ -> Thêm mới vào giỏ
        cart.products.push({
            product_id: productId,
            quantity: 1
        });

        await Cart.updateOne(
            { _id: cart._id },
            { products: cart.products }
        );

        // 4. Đếm số lượng sản phẩm trong giỏ để gửi về giao diện
        const totalCartItems = cart.products.length;

        res.json({
            code: "success",
            message: "Thêm vào giỏ hàng thành công!",
            totalCartItems: totalCartItems 
        });

    } catch (error) {
        res.json({ code: "error", message: "Có lỗi xảy ra!" });
    }
};

module.exports.delete = async (req, res) => {
    try {
        const productId = req.params.productId;

        // 1. Tìm giỏ hàng hiện tại
        const cart = await Cart.findOne();

        if (cart) {
            // 2. Lọc bỏ sản phẩm có id trùng với productId truyền lên từ mảng products
            const newProducts = cart.products.filter(item => item.product_id !== productId);

            // 3. Cập nhật lại danh sách sản phẩm mới vào Database
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
        res.json({ code: "error", message: "Có lỗi xảy ra khi xóa sản phẩm!" });
    }
};