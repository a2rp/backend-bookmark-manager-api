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

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
