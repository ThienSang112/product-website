const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: String,
    product_category: String,
    brand:String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock : Number,
    thumbnail:String,
    status: String,
    deleted:Boolean
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;