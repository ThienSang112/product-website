const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String, // Bắt buộc phải có để Admin đăng nhập
        token: String,    // Dùng để xác thực phiên đăng nhập
        phone: String,    // Số điện thoại (như thiết kế ban đầu của bạn)
        avatar: String,
        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role" // Trỏ tới collection "roles"
        },
        status: {
            type: String,
            default: "active"
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema, "accounts");