
const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const accessoriesRouter = require("./accessories.route");
const contactRouter = require("./contact.route");
const cartRouter = require("./cart.route");
const searchRouter = require("./search.route"); 
const checkoutRouter = require("./checkout.route");
const userRouter = require("./user.route");
const deliveryRoutes = require("./delivery.route");
const userRoutes = require("./user.route");
const policyRoutes = require("./policy.route");
const infoRoutes = require("./info.route");

module.exports = (app) => {

    app.use("/", homeRouter);

    app.use("/products", productRouter);

    app.use("/accessories", accessoriesRouter);

    app.use("/contact", contactRouter);

    app.use("/cart", cartRouter);

    app.use("/search", searchRouter);

    app.use("/checkout", checkoutRouter);

    app.use("/user", userRouter);

    app.use("/giao-hang", deliveryRoutes);

    app.use("/chinh-sach", policyRoutes);


    app.use("/", infoRoutes);




}