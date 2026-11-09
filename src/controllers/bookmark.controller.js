const Bookmark = require("../models/bookmark.model");
const mongoose = require("mongoose");

const isValidBookmarkId = (id) => mongoose.isValidObjectId(id);

const isValidHttpUrl = (value) => {
    try {
        const parsedUrl = new URL(value);
        return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
        return false;
    }
};

const getInvalidFieldMessage = ({ title, url, tags, category, isFavorite }, partial = false) => {
    if (!partial && (typeof title !== "string" || !title.trim())) {
        return "Title is required";
    }

    if (!partial && (typeof url !== "string" || !url.trim())) {
        return "URL is required";
    }

    if (title !== undefined && (typeof title !== "string" || !title.trim() || title.trim().length > 200)) {
        return "Title must be a non-empty string of at most 200 characters";
    }

    if (url !== undefined && (typeof url !== "string" || !url.trim() || url.trim().length > 2048)) {
        return "URL must be a non-empty string of at most 2048 characters";
    }

    if (url !== undefined && !isValidHttpUrl(url.trim())) {
        return "URL must be a valid HTTP or HTTPS URL";
    }

    if (
        tags !== undefined &&
        (!Array.isArray(tags) || tags.length > 30 || tags.some((tag) => typeof tag !== "string" || tag.trim().length > 50))
    ) {
        return "Tags must be an array of at most 30 strings, each no longer than 50 characters";
    }

    if (category !== undefined && (typeof category !== "string" || category.trim().length > 100)) {
        return "Category must be a string of at most 100 characters";
    }

    if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
        return "isFavorite must be a boolean";
    }

    return null;
};

const createBookmark = async (req, res) => {
    try {
        const { title, url, tags, category, isFavorite } = req.body || {};

        const invalidFieldMessage = getInvalidFieldMessage(
            { title, url, tags, category, isFavorite },
            false,
        );

        if (invalidFieldMessage) {
            return res.status(400).json({
                message: invalidFieldMessage,
            });
        }

        const bookmark = await Bookmark.create({
            title: title.trim(),
            url: url.trim(),
            tags: tags?.map((tag) => tag.trim()).filter(Boolean),
            category: category?.trim(),
            isFavorite,
            user: req.user._id,
        });

        return res.status(201).json({
            message: "Bookmark created successfully",
            bookmark,
        });
    } catch (error) {
        console.error("Failed to create bookmark:", error);
        return res.status(500).json({
            message: "Failed to create bookmark",
        });
    }
};

const getMyBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user._id }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            message: "Bookmarks fetched successfully",
            bookmarks,
        });
    } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        return res.status(500).json({
            message: "Failed to fetch bookmarks",
        });
    }
};

const getSingleBookmark = async (req, res) => {
    try {
        if (!isValidBookmarkId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid bookmark id",
            });
        }

        const bookmark = await Bookmark.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!bookmark) {
            return res.status(404).json({
                message: "Bookmark not found",
            });
        }

        return res.status(200).json({
            message: "Bookmark fetched successfully",
            bookmark,
        });
    } catch (error) {
        console.error("Failed to fetch bookmark:", error);
        return res.status(500).json({
            message: "Failed to fetch bookmark",
        });
    }
};

const updateBookmark = async (req, res) => {
    try {
        const { title, url, tags, category, isFavorite } = req.body || {};

        if (!isValidBookmarkId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid bookmark id",
            });
        }

        const invalidFieldMessage = getInvalidFieldMessage(
            { title, url, tags, category, isFavorite },
            true,
        );

        if (invalidFieldMessage) {
            return res.status(400).json({
                message: invalidFieldMessage,
            });
        }

        const bookmark = await Bookmark.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!bookmark) {
            return res.status(404).json({
                message: "Bookmark not found",
            });
        }

        bookmark.title = title !== undefined ? title.trim() : bookmark.title;
        bookmark.url = url !== undefined ? url.trim() : bookmark.url;
        bookmark.tags = tags !== undefined ? tags.map((tag) => tag.trim()).filter(Boolean) : bookmark.tags;
        bookmark.category =
            category !== undefined ? category.trim() : bookmark.category;
        bookmark.isFavorite =
            isFavorite !== undefined ? isFavorite : bookmark.isFavorite;

        await bookmark.save();

        return res.status(200).json({
            message: "Bookmark updated successfully",
            bookmark,
        });
    } catch (error) {
        console.error("Failed to update bookmark:", error);
        return res.status(500).json({
            message: "Failed to update bookmark",
        });
    }
};

const deleteBookmark = async (req, res) => {
    try {
        if (!isValidBookmarkId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid bookmark id",
            });
        }

        const bookmark = await Bookmark.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!bookmark) {
            return res.status(404).json({
                message: "Bookmark not found",
            });
        }

        await bookmark.deleteOne();

        return res.status(200).json({
            message: "Bookmark deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete bookmark:", error);
        return res.status(500).json({
            message: "Failed to delete bookmark",
        });
    }
};

module.exports = {
    createBookmark,
    getMyBookmarks,
    getSingleBookmark,
    updateBookmark,
    deleteBookmark,
};
