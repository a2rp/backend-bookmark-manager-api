const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        url: {
            type: String,
            required: [true, "URL is required"],
            trim: true,
            validate: {
                validator: (value) => {
                    try {
                        const parsedUrl = new URL(value);
                        return ["http:", "https:"].includes(parsedUrl.protocol);
                    } catch {
                        return false;
                    }
                },
                message: "URL must be a valid HTTP or HTTPS URL",
            },
        },
        tags: {
            type: [String],
            default: [],
        },
        category: {
            type: String,
            default: "General",
            trim: true,
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

bookmarkSchema.index({ user: 1, createdAt: -1 });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
