const express = require("express");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error.middleware");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

/* API Routes */
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

/* Using Routes */
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

/* Frontend Static Files */
app.use(express.static(path.join(__dirname, "../public")));

/* React Routes */
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Error Middleware
app.use(errorHandler);

module.exports = app;