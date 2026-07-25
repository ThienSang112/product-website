const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: String,
    orderCode: {
      type: String,
      unique: true, // Đảm bảo không trùng lặp
      required: true
    },
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String
    },
    products: [
      {
        product_id: String,
        price: Number,
        quantity: Number
      }
    ],
    totalPrice: Number,
    paymentMethod: {
      type: String,
      default: "cash" // "cash" (Tiền mặt) hoặc "transfer" (Chuyển khoản)
    },
    status: {
      type: String,
      default: "pending" // Trạng thái đơn: pending (đang chờ), success (thành công)...
    },
    estimatedDeliveryDate: Date
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;