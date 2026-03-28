const express = require("express");
const {
    createBookmark,
    getMyBookmarks,
    getSingleBookmark,
    updateBookmark,
    deleteBookmark,
} = require("../controllers/bookmark.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, createBookmark);
router.get("/", protect, getMyBookmarks);
router.get("/:id", protect, getSingleBookmark);
router.put("/:id", protect, updateBookmark);
router.delete("/:id", protect, deleteBookmark);

module.exports = router;
