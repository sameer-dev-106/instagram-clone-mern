const express = require("express");
const authController = require("../controllers/auth.controller");
const identifyUser = require("../middlewares/auth.middleware");

const multer = require("multer");
const { registerValidator, loginValidator } = require("../validators/auth.validator");
const upload = multer({ storage: multer.memoryStorage() });

const authRouter = express.Router();

/**
 * @route /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", registerValidator, authController.registerController);

/**
 * @route /api/auth/update-profile
 * @description Update the profile of the currently logged-in user
 * @access Private
 */
authRouter.put("/update-profile", upload.single("profileImage"), identifyUser, authController.updateProfileController);

/**
 * @route /api/auth/login
 * @description Log in a user
 * @access Public
 */
authRouter.post("/login", loginValidator, authController.loginController);

/**
 * @route /api/auth/logout
 * @description Log out the currently logged-in user
 * @access Private
 */
authRouter.post("/logout", identifyUser, authController.logoutController);

/**
 * @route /api/auth/get-me
 * @description Get the currently logged-in user's information
 * @access Private
 */
authRouter.get("/get-me", identifyUser, authController.getMeController);

module.exports = authRouter