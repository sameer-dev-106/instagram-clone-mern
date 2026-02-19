const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "User name already exists"],
        required: [true, "User name is required"]
    },
    email: {
        type: String,
        unique: [true, "With this email user account already exists"],
        required: [true, "Email is required"]
    },
    password: {
        type:String,
        required:[true,"Password is required"]
    },
    bio: String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/ifef0t8sn/default-user-img.webp"
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;