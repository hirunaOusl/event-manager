const EditorialPost = require("../models/EditorialPost");

/**
 * Loads the post by :id and verifies it belongs to req.seller.
 * Attaches the loaded post to req.post so controllers don't re-query.
 * Must run after `protect`.
 */
const loadOwnedPost = async (req, res, next) => {
  try {
    const post = await EditorialPost.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.seller.toString() !== req.seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to modify this post",
      });
    }

    req.post = post;
    next();
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid post id" });
    }
    next(err);
  }
};

module.exports = { loadOwnedPost };
