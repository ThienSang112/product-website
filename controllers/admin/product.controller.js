// Cần import Model Product vào để chọc xuống Database
const Product = require("../../models/product.model"); 

// [GET] /admin/products
module.exports.index = async (req, res) => {
    try {
        // Tạo một object chứa các điều kiện lọc
        let find = {};
        
        // Bắt lấy từ khóa người dùng gõ trên thanh địa chỉ (ví dụ: ?keyword=samsung)
        const keyword = req.query.keyword;

        if (keyword) {
            // Dùng Regex để tìm kiếm chuỗi chứa từ khóa, 'i' là không phân biệt hoa/thường
            const regex = new RegExp(keyword, "i");
            find.title = regex;
        }

        // Đưa object find vào để Database lọc dữ liệu
        const products = await Product.find(find);

        // Gửi dữ liệu sang View (nhớ gửi kèm keyword để nhét lại vào ô input giữ trạng thái)
        res.render("admin/pages/products/index", {
            pageTitle: "Danh sách sản phẩm",
            products: products,
            keyword: keyword || "" // Nếu không có thì gửi chuỗi rỗng
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
        res.redirect("back");
    }
};

// [GET] /admin/products/create
module.exports.create = (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        old: {},      // dữ liệu đã nhập (rỗng khi mới mở form)
        error: ""
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    const old = req.body; // giữ lại dữ liệu đã nhập để hiện lại nếu có lỗi

    try {
        const title = (req.body.title || "").trim();
        const price = Number(req.body.price);
        const stock = Number(req.body.stock) || 0;
        const discountPercentage = Number(req.body.discountPercentage) || 0;

        // Kiểm tra dữ liệu đầu vào
        let error = "";
        if (!title) error = "Vui lòng nhập tên sản phẩm.";
        else if (Number.isNaN(price) || price < 0) error = "Giá phải là số từ 0 trở lên.";
        else if (stock < 0) error = "Tồn kho không được âm.";
        else if (discountPercentage < 0 || discountPercentage > 100) error = "Giảm giá phải từ 0 đến 100.";

        if (error) {
            return res.render("admin/pages/products/create", {
                pageTitle: "Thêm mới sản phẩm",
                old: old,
                error: error
            });
        }

        // Chỉ lấy những trường cho phép, không đưa nguyên req.body vào database
        await Product.create({
            title: title,
            product_category: req.body.product_category,
            brand: (req.body.brand || "").trim(),
            description: (req.body.description || "").trim(),
            price: price,
            discountPercentage: discountPercentage,
            stock: stock,
            thumbnail: (req.body.thumbnail || "").trim(),
            status: req.body.status === "inactive" ? "inactive" : "active",
            deleted: false
        });

        // Thêm thành công thì quay lại bảng danh sách
        res.redirect("/admin/products");
    } catch (error) {
        console.error("Lỗi thêm sản phẩm:", error);
        res.render("admin/pages/products/create", {
            pageTitle: "Thêm mới sản phẩm",
            old: old,
            error: "Có lỗi xảy ra, vui lòng thử lại."
        });
    }
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Lệnh xóa vĩnh viễn sản phẩm khỏi Database
        await Product.deleteOne({ _id: id });
        
        res.json({ code: "success", message: "Đã xóa thành công!" });
    } catch (error) {
        res.json({ code: "error", message: "Xóa thất bại!" });
    }
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Tìm sản phẩm trong DB theo ID
        const product = await Product.findOne({ _id: id });
        
        // Render ra file edit.pug và gửi data sản phẩm sang
        res.render("admin/pages/products/edit", {
            pageTitle: "Sửa sản phẩm",
            product: product
        });
    } catch (error) {
        // Nếu người dùng nhập linh tinh ID trên thanh địa chỉ thì đẩy về trang danh sách
        res.redirect("/admin/products"); 
    }
};

// [POST] /admin/products/edit/:id
module.exports.editPost = async (req, res) => {
    try {
        const id = req.params.id;
        
        // req.body chính là toàn bộ dữ liệu mới mà bạn vừa gõ vào Form
        // Hàm updateOne sẽ tìm sản phẩm có _id đó và ghi đè dữ liệu mới lên
        await Product.updateOne({ _id: id }, req.body);
        
        // Cập nhật thành công thì tự động chuyển hướng về lại bảng danh sách
        res.redirect("/admin/products");
    } catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        res.redirect("back");
    }
};