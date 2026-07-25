// models/cart.model.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
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