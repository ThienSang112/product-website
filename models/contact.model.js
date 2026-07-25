const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    status: {
      type: String,
      default: "pending" // Mặc định là "chưa xử lý" để sau này Admin dễ quản lý
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Tự động lưu thời gian gửi (createdAt, updatedAt)
  }
);

const Contact = mongoose.model("Contact", contactSchema, "contacts");

module.exports = Contact;