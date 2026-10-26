const Role = require("../../models/role.model");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({ deleted: false });
    res.render("admin/pages/roles/index", {
        pageTitle: "Danh sách chức vụ",
        records: records
    });
};

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await Role.findOne({ _id: id, deleted: false });

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        });
    } catch (error) {
        res.redirect(`${res.locals.prefixAdmin}/roles`);
    }
};

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    // redirect cứng, không cộng thêm biến gì cả
    res.redirect("/admin/roles"); 
};


module.exports.deletePatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, { deleted: true });
        res.json({ code: 200 }); // Trả về JSON để fetch nhận được
    } catch (error) {
        res.json({ code: 400 });
    }
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Thêm nhóm quyền"
    });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();
    res.redirect(`${res.locals.prefixAdmin}/roles`);
};