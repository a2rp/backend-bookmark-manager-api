const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const bookmarkRoutes = require("./routes/bookmark.routes");

const app = express();
app.disable("x-powered-by");
app.use(helmet());

const allowedOrigins = (
    process.env.CLIENT_ORIGIN ||
    (process.env.NODE_ENV === "production" ? "" : "http://localhost:5173")
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use(
    cors({
        origin: (origin, callback) => {
            callback(null, !origin || allowedOrigins.includes(origin));
        },
        credentials: true,
    }),
);

app.get("/", (req, res) => {
    res.json({
        message: "Bookmark Manager API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({ message: "Request body is too large" });
    }

    if (error instanceof SyntaxError && Object.hasOwn(error, "body")) {
        return res.status(400).json({ message: "Request body must contain valid JSON" });
    }

    console.error("Unhandled request error:", error);
    return res.status(500).json({ message: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 1206;

const startServer = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        throw new Error("JWT_SECRET must contain at least 32 characters");
    }

    if (/^(change_me|replace_with|your[_-])/i.test(process.env.JWT_SECRET)) {
        throw new Error("Replace the example JWT_SECRET with a unique random secret");
    }

    if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
        throw new Error("CLIENT_ORIGIN must be configured in production");
    }

    if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
        throw new Error("PORT must be an integer from 1 to 65535");
    }

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
});
