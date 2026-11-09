const express = require("express");
const { rateLimit } = require("express-rate-limit");
const {
    registerUser,
    loginUser,
    logoutUser,
} = require("../controllers/auth.controller");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many login attempts. Try again in 15 minutes." },
});

const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many registration attempts. Try again in one hour." },
});

router.post("/register", registrationLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);

module.exports = router;
