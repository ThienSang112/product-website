// models/cart.model.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // Giỏ hàng thuộc về tài khoản nào (null = giỏ của khách chưa đăng nhập)
    user_id: {
      type: String,
      default: null
    },
    // products là một mảng chứa ID sản phẩm và số lượng tương ứng
    products: [
      {
        product_id: String,
        quantity: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;