// controllers/client/search.controller.js
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    try {
        // Lấy từ khóa từ ô input trên header (req.query.keyword)
        const keyword = req.query.keyword;
        let products = [];

        if (keyword) {
            // Tạo định dạng RegExp để tìm kiếm chữ gần đúng và không phân biệt hoa thường
            const regexKeyword = new RegExp(keyword, "i");

            // Tìm sản phẩm có tên khớp với từ khóa, trạng thái active và chưa xóa
            products = await Product.find({
                title: regexKeyword,
                status: "active",
                deleted: false
            });
        }

        // Render dữ liệu sang file giao diện tìm kiếm
        res.render("client/pages/search/index", {
            pageTitle: "Kết quả tìm kiếm",
            keyword: keyword,
            products: products
        });

    } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        res.redirect("/");
    }
};

module.exports.suggest = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        
        // Nếu ô tìm kiếm trống rỗng, trả về mảng rỗng luôn
        if (!keyword || keyword.trim() === "") {
            return res.json({ code: "success", products: [] });
        }

        const regexKeyword = new RegExp(keyword, "i");

        // Tìm nhanh sản phẩm khớp tên, chỉ chọn lấy title, thumbnail, price để tối ưu tốc độ
        const products = await Product.find({
            title: regexKeyword,
            status: "active",
            deleted: false
        })
        .limit(5)
        .select("title thumbnail price");

        res.json({
            code: "success",
            products: products
        });

    } catch (error) {
        res.json({ code: "error", message: "Lỗi hệ thống" });
    }
};