const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  permanentlyDeletePost,
} = require("../controllers/postController");
const { protect, optionalAuth } = require("../middleware/auth");
const { loadOwnedPost } = require("../middleware/ownership");
const upload = require("../middleware/upload");

const router = express.Router();

// Public (with optional auth to reveal drafts/archived to the owner)
router.get("/", optionalAuth, getPosts);
router.get("/:id", getPost);

// Protected: create
router.post("/", protect, upload.single("image"), createPost);

// Protected + ownership-checked: update / delete
router.put("/:id", protect, loadOwnedPost, upload.single("image"), updatePost);
router.delete("/:id", protect, loadOwnedPost, deletePost);
router.delete("/:id/permanent", protect, loadOwnedPost, permanentlyDeletePost);

module.exports = router;
