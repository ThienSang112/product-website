// Đảm bảo file này có dòng này
module.exports.index = (req, res) => {
    res.render("client/pages/policy/warranty", {
        pageTitle: "Chính sách bảo hành"
    });
};
//chinh sach hoan doi
module.exports.returnPolicy = (req, res) => {
    res.render("client/pages/policy/return", {
        pageTitle: "Chính sách đổi trả"
    });
};

//huong dan mua tra gop 

module.exports.installment = (req, res) => {
    res.render("client/pages/policy/installment", {
        pageTitle: "Hướng dẫn mua trả góp"
    });
};