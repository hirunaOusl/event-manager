const fs = require("fs");
const path = require("path");
const EditorialPost = require("../models/EditorialPost");
const asyncHandler = require("../middleware/asyncHandler");

const URL_REGEX = /^https?:\/\/.+/i;

/** Builds the publicly servable URL for a locally-uploaded file. */
const buildUploadUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/${filename}`;

/** Removes an uploaded file from disk; swallows errors (best-effort cleanup). */
const deleteUploadedFile = (storageKey) => {
  if (!storageKey) return;
  const filePath = path.join(__dirname, "..", "uploads", storageKey);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error(`Failed to delete file ${filePath}:`, err.message);
    }
  });
};

/**
 * Resolves the image field from either:
 *  - req.file (multer, multipart/form-data upload), or
 *  - req.body.imageUrl (plain JSON / form field with an external URL)
 * Exactly one must be provided.
 */
const resolveImageInput = (req) => {
  if (req.file) {
    return {
      url: buildUploadUrl(req, req.file.filename),
      source: "upload",
      storageKey: req.file.filename,
    };
  }

  if (req.body.imageUrl) {
    if (!URL_REGEX.test(req.body.imageUrl)) {
      const err = new Error("imageUrl must be a valid http(s) URL");
      err.statusCode = 400;
      throw err;
    }
    return { url: req.body.imageUrl, source: "url", storageKey: null };
  }

  return null;
};

// -----------------------------------------------------------------------
// POST /api/posts            Create a new editorial post
// -----------------------------------------------------------------------
const createPost = asyncHandler(async (req, res) => {
  const image = resolveImageInput(req);

  if (!image) {
    return res.status(400).json({
      success: false,
      message: "Provide either an image file (field 'image') or an 'imageUrl'",
    });
  }

  const { title, caption, size, tags, status, category } = req.body;

  const post = await EditorialPost.create({
    seller: req.seller._id,
    title,
    caption,
    size,
    status,
    category,
    tags: tags
      ? Array.isArray(tags)
        ? tags
        : String(tags).split(",")
      : [],
    image,
  });

  res.status(201).json({ success: true, data: post });
});

// -----------------------------------------------------------------------
// GET /api/posts              List posts (paginated, filterable)
// Public: returns only published posts for a given seller unless the
// requester is authenticated as that seller (then drafts/archived too).
// -----------------------------------------------------------------------
const getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false };

  if (req.query.seller) {
    filter.seller = req.query.seller;
  }

  // Only show non-published posts to the owning, authenticated seller
  const isOwner =
    req.seller && req.query.seller && req.seller._id.toString() === req.query.seller;

  filter.status = isOwner ? { $in: ["draft", "published", "archived"] } : "published";

  if (req.query.status && isOwner) {
    filter.status = req.query.status;
  }

  if (req.query.tag) {
    filter.tags = req.query.tag.toLowerCase();
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    mostViewed: { views: -1 },
  };
  const sort = sortMap[req.query.sort] || sortMap.newest;

  const [posts, total] = await Promise.all([
    EditorialPost.find(filter).populate("seller", "username email businessDetails").sort(sort).skip(skip).limit(limit),
    EditorialPost.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

// -----------------------------------------------------------------------
// GET /api/posts/:id           Get a single post, increments view count
// -----------------------------------------------------------------------
const getPost = asyncHandler(async (req, res) => {
  const post = await EditorialPost.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  res.status(200).json({ success: true, data: post });
});

// -----------------------------------------------------------------------
// PUT /api/posts/:id            Update a post (owner only)
// req.post is pre-loaded + ownership-checked by `loadOwnedPost` middleware
// -----------------------------------------------------------------------
const updatePost = asyncHandler(async (req, res) => {
  const post = req.post;

  const { title, caption, size, tags, status, category, removeImage } = req.body;

  if (title !== undefined) post.title = title;
  if (caption !== undefined) post.caption = caption;
  if (size !== undefined) post.size = size;
  if (status !== undefined) post.status = status;
  if (category !== undefined) post.category = category;
  if (tags !== undefined) {
    post.tags = Array.isArray(tags) ? tags : String(tags).split(",");
  }

  // Replace image if a new file or URL was provided
  const newImage = resolveImageInput(req);
  if (newImage) {
    if (post.image.source === "upload") {
      deleteUploadedFile(post.image.storageKey);
    }
    post.image = newImage;
  } else if (removeImage === "true" || removeImage === true) {
    return res.status(400).json({
      success: false,
      message: "Cannot remove image without providing a replacement",
    });
  }

  await post.save();

  res.status(200).json({ success: true, data: post });
});

// -----------------------------------------------------------------------
// DELETE /api/posts/:id          Soft-delete a post (owner only)
// -----------------------------------------------------------------------
const deletePost = asyncHandler(async (req, res) => {
  const post = req.post;

  post.isDeleted = true;
  post.deletedAt = new Date();
  await post.save();

  res.status(200).json({ success: true, message: "Post deleted", data: { id: post._id } });
});

// -----------------------------------------------------------------------
// DELETE /api/posts/:id/permanent   Hard-delete (owner only) - also removes file
// -----------------------------------------------------------------------
const permanentlyDeletePost = asyncHandler(async (req, res) => {
  const post = req.post;

  if (post.image.source === "upload") {
    deleteUploadedFile(post.image.storageKey);
  }

  await EditorialPost.deleteOne({ _id: post._id });

  res.status(200).json({ success: true, message: "Post permanently deleted", data: { id: post._id } });
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  permanentlyDeletePost,
};
