const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const crypto = require("crypto");

/* 
* /api/auth/register
*/
authRouter.post("/register", async (req, res) => {
    const { username, email, password, bio, profileImage } = req.body;

    const isUserAlreayExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserAlreayExist) {
        return res.status(409).json({
            message: "User already exists" + (isUserAlreayExist.email == email ? "Email already exists" : "Username already exists")
        });
    }

    const hash = crypto.createHash("md5").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password: hash
    });

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("jwt_token", token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage
        },
    });
});

module.exports = authRouter