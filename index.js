require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
// Thêm thư viện session
const session = require("express-session"); 

const systemConfig = require("./config/system");
const routeAdmin = require("./routers/admin/index.route");
const route = require("./routers/client/index.router");

const Cart = require("./models/cart.model"); 
const User = require("./models/user.model");

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);
app.set("io", io);

database.connect();

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));
app.use(cookieParser("MY_SECRET_KEY")); // Cấu hình secret cho cookie

// --- CẤU HÌNH SESSION (Thêm vào đây) ---
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // Session tồn tại 60 giây (tùy chỉnh)
}));
// --------------------------------------

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use((req, res, next) => {
    res.locals.prefixAdmin = systemConfig.prefixAdmin;
    next();
});

// Middleware Cart
app.use(async (req, res, next) => {
    try {
        const cart = await Cart.findOne();
        res.locals.globalCartCount = cart ? cart.products.length : 0;
    } catch (error) {
        res.locals.globalCartCount = 0;
    }
    next();
});

// Middleware User
app.use(async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;
    if (tokenUser) {
        const user = await User.findOne({ tokenUser: tokenUser, deleted: false }).select("-password");
        if (user) res.locals.user = user;
    }
    next();
});

routeAdmin(app);
route(app);

server.listen(port, () => {
    console.log(`Đang chạy tại port ${port}`);
});