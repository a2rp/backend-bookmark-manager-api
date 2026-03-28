const Bookmark = require("../models/bookmark.model");

const createBookmark = async (req, res) => {
    try {
        const { title, url, tags, category, isFavorite } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                message: "Title and URL are required",
            });
        }

        const bookmark = await Bookmark.create({
            title,
            url,
            tags,
            category,
            isFavorite,
            user: req.user._id,
        });

        return res.status(201).json({
            message: "Bookmark created successfully",
            bookmark,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create bookmark",
            error: error.message,
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
        return res.status(500).json({
            message: "Failed to fetch bookmarks",
            error: error.message,
        });
    }
};

const getSingleBookmark = async (req, res) => {
    try {
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
        return res.status(500).json({
            message: "Failed to fetch bookmark",
            error: error.message,
        });
    }
};

const updateBookmark = async (req, res) => {
    try {
        const { title, url, tags, category, isFavorite } = req.body;

        const bookmark = await Bookmark.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!bookmark) {
            return res.status(404).json({
                message: "Bookmark not found",
            });
        }

        bookmark.title = title || bookmark.title;
        bookmark.url = url || bookmark.url;
        bookmark.tags = tags !== undefined ? tags : bookmark.tags;
        bookmark.category =
            category !== undefined ? category : bookmark.category;
        bookmark.isFavorite =
            isFavorite !== undefined ? isFavorite : bookmark.isFavorite;

        await bookmark.save();

        return res.status(200).json({
            message: "Bookmark updated successfully",
            bookmark,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update bookmark",
            error: error.message,
        });
    }
};

const deleteBookmark = async (req, res) => {
    try {
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
        return res.status(500).json({
            message: "Failed to delete bookmark",
            error: error.message,
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
