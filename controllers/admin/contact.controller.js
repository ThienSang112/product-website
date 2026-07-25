const Contact = require("../../models/contact.model");

// [GET] /admin/contacts
module.exports.index = async (req, res) => {
  const contacts = await Contact.find({ deleted: false }).sort({ createdAt: -1 });
  res.render("admin/pages/contacts/index", {
    pageTitle: "Quản lý liên hệ",
    contacts: contacts
  });
};

// [GET] /admin/contacts/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const contact = await Contact.findOne({ _id: id, deleted: false });
    
    res.render("admin/pages/contacts/detail", {
        pageTitle: "Chi tiết liên hệ",
        contact: contact
    });
};

// [DELETE] /admin/contacts/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Contact.updateOne({ _id: id }, { deleted: true });
    res.json({ code: 200, message: "Xóa thành công!" });
};