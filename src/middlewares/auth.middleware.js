const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
    try {
        const token = req.cookies && req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, no token found",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET, {
                algorithms: ["HS256"],
            });
        } catch {
            return res.status(401).json({
                message: "Not authorized, invalid token",
            });
        }

        if (!decoded || typeof decoded.userId !== "string" || !mongoose.isValidObjectId(decoded.userId)) {
            return res.status(401).json({
                message: "Not authorized, invalid token",
            });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return next(error);
    }
};

module.exports = protect;
