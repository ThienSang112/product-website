const Account = require("../../models/account.model");
const Role = require("../../models/role.model"); 
const md5 = require("md5");

// [GET] /admin/accounts/index
// [GET] /admin/accounts/index
module.exports.index = async (req, res) => {
    const records = await Account.find({ deleted: false });
    const roles = await Role.find({ deleted: false });

    for (const record of records) {
        const role = roles.find(item => item.id == record.role_id);
        record.roleTitle = role ? role.title : "Chưa phân quyền";
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Quản lý tài khoản Admin",
        records: records
    });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo tài khoản mới",
        roles: roles
    });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    if (req.body.password) {
        req.body.password = md5(req.body.password);
    }
    const account = new Account(req.body);
    await account.save();
    res.redirect(`${res.locals.prefixAdmin}/accounts`); // Nên dùng biến prefixAdmin thay vì hardcode "/admin"
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    const account = await Account.findOne({ _id: req.params.id, deleted: false });
    
    // Lấy danh sách các nhóm quyền (Role) để Admin chọn
    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        account: account,
        roles: roles // Truyền roles vào view
    });
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Chỉ lấy những trường được phép chỉnh sửa
    const data = {
      fullName: req.body.fullName,
      email: req.body.email,
      role_id: req.body.role_id,
      status: req.body.status
    };

    // 2. Xử lý mật khẩu
    if (req.body.password !== "") {
      data.password = md5(req.body.password);
    }

    // 3. Cập nhật
    await Account.updateOne({ _id: id }, data);
    
    // Gợi ý: Nếu có cài connect-flash thì mới dùng dòng dưới
    // req.flash("success", "Cập nhật tài khoản thành công!");
    
    res.redirect(`${res.locals.prefixAdmin}/accounts`);
  } catch (error) {
    console.error("Lỗi khi cập nhật account:", error);
    // req.flash("error", "Có lỗi xảy ra!"); 
    res.redirect("back");
  }
};