const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    product_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String
}, { timestamps: true });
const Review = mongoose.model("Review", reviewSchema, "reviews");
module.exports = Review;