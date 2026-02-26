const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
    const { username, email, password, bio, profileImage } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (isUserAlreadyExist) {
        let message = "User already exists";

        const emailMatch = isUserAlreadyExist.email === email;
        const usernameMatch = isUserAlreadyExist.username === username;

        if (emailMatch && usernameMatch) {
            message += " with this email and username";
        } else if (emailMatch) {
            message += " with this email address";
        } else if (usernameMatch) {
            message += " with this username";
        }

        res.status(409).json({ message });

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
}

async function loginController(req, res) {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (!user) {
        return res.status(404).json({
            message: "User note found"
        });
    }

    const hash = crypto.createHash("md5").update(password).digest("hex");

    const isPasswordMatched = hash === user.password

    if (!isPasswordMatched) {
        return res.status(401).json({
            message: "Invalid password"
        });
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" });

    res.cookie("jwt_token", token);

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        },
        token
    });
}

module.exports = {
    registerController,
    loginController
}