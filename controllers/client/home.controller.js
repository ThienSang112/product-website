const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active" ,
        deleted: false 
    });


    res.render("client/pages/home/index", {
        pageTitle: "Trang Chủ",
        products: products
    });
    
} 