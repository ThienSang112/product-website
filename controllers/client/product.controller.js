const Product = require("../../models/product.model");
const Review = require("../../models/review.model");
const Order = require("../../models/order.model");

module.exports.index = async (req, res) => {
    try {
        const find = {
            status: "active",
            deleted: false,
            product_category: "Điện thoại" 
        };

        // Lọc thương hiệu (đã có)
        if (req.query.brand) {
            find.brand = new RegExp(req.query.brand, "i");
        }

        // THÊM: Lọc theo khoảng giá
        if (req.query.priceMin || req.query.priceMax) {
            find.price = {};
            if (req.query.priceMin) find.price.$gte = parseInt(req.query.priceMin);
            if (req.query.priceMax) find.price.$lte = parseInt(req.query.priceMax);
        }

        // THÊM: Xử lý sắp xếp (Sort)
        let sort = { position: "desc" }; // Mặc định
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        }

        const products = await Product.find(find).sort(sort);

        res.render("client/pages/products/index", {
            pageTitle: "Danh sách sản phẩm",
            products: products,
            query: req.query // Truyền query sang view để giữ lại giá trị trên form
        });
        
    } catch (error) {
        res.redirect("/");
    }
};

// [GET] /products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Tìm sản phẩm chính
        const product = await Product.findOne({ 
            _id: id, 
            deleted: false, 
            status: "active" 
        });

        if (!product) {
            return res.redirect("/products");
        }

        // 2. Chạy song song các truy vấn để tăng tốc độ phản hồi (Promise.all)
        const [reviews, relatedProducts] = await Promise.all([
            // Lấy đánh giá
            Review.find({ product_id: id })
                .populate("user_id", "fullName")
                .sort({ createdAt: -1 }), // Sắp xếp đánh giá mới nhất lên đầu
            
            // Lấy sản phẩm tương tự cùng danh mục
            Product.find({
                product_category: product.product_category,
                _id: { $ne: product.id },
                deleted: false,
                status: "active"
            }).limit(4) // Chỉ lấy 4 sản phẩm
        ]);

        // 3. Kiểm tra quyền đánh giá (chỉ thực hiện nếu user đã đăng nhập)
        let isPurchased = false;
        if (res.locals.user) {
            isPurchased = await Order.exists({
                user_id: res.locals.user.id,
                "products.product_id": id,
                status: "success"
            });
        }

        // 4. Render
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product,
            reviews: reviews,
            isPurchased: isPurchased,
            relatedProducts: relatedProducts // Truyền thêm biến này sang view
        });

    } catch (error) {
        console.error("Lỗi trang chi tiết:", error);
        res.redirect("/products");
    }
};