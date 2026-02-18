const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router();

/* 
* /api/auth/register
*/
authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const isUserAlreayExist = await userModel.findOne({ email });

    if (isUserAlreayExist) {
        return res.status(409).json({
            message: "User already exists with this email address"
        });
    }

    const hash = crypto.createHash("md5").update(password).digest("hex");

    const user = await userModel.create({
        name, email, password: hash
    });

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("jwt_token", token);

    res.status(201).json({
        message: "User registered successfully",
        user,
    });
});

module.exports = authRouter