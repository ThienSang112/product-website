const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String, // Mật khẩu sẽ được mã hóa MD5
    tokenUser: String, // Chuỗi ký tự ngẫu nhiên dùng để nhận diện người dùng lưu vào cookie
    status: {
      type: String,
      default: "active"
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;