const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active" ,
        deleted: false ,
        product_category: "Phụ kiện"
    });

    console.log(products);  

    res.render("client/pages/accessories/index", {
        pageTitle: "Trang phụ kiện",
        products: products
    });
    
} 