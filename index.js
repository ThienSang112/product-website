require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const session = require("express-session");

const systemConfig = require("./config/system");
const routeAdmin = require("./routers/admin/index.route");
const route = require("./routers/client/index.router");

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
app.use(cookieParser(process.env.COOKIE_SECRET)); // ĐÃ SỬA: đọc từ env

// --- CẤU HÌNH SESSION ---
app.use(session({
    secret: process.env.SESSION_SECRET,           // ĐÃ SỬA: đọc từ env
    resave: false,
    saveUninitialized: false,                     // ĐÃ SỬA: không tạo session rỗng
    cookie: { maxAge: 60 * 60 * 1000 }            // 1 giờ
}));
// ------------------------

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use((req, res, next) => {
    res.locals.prefixAdmin = systemConfig.prefixAdmin;
    next();
});


// Middleware User
app.use(async (req, res, next) => {
    try {                                          // ĐÃ SỬA: thêm try/catch
        const tokenUser = req.cookies.tokenUser;
        if (tokenUser) {
            const user = await User.findOne({ tokenUser: tokenUser, deleted: false }).select("-password");
            if (user) res.locals.user = user;
        }
    } catch (error) {
        console.error(error);
    }
    next();
});

routeAdmin(app);
route(app);

server.listen(port, () => {
    console.log(`Đang chạy tại port ${port}`);
});