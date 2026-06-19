const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * EditorialPost
 * Represents a single "Editorial Update" post shown on a seller's dashboard,
 * e.g. the masonry grid of images with view counts in EditorialUpdates.jsx.
 */
const editorialPostSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: [true, "Post must belong to a seller"],
      index: true,
    },

    title: {
      type: String,
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
      default: "",
    },

    caption: {
      type: String,
      trim: true,
      maxlength: [2000, "Caption cannot exceed 2000 characters"],
      default: "",
    },

    // Image can come from an uploaded file (servedPath) or an external URL.
    image: {
      url: {
        type: String,
        required: [true, "Post must have an image"],
      },
      source: {
        type: String,
        enum: ["upload", "url"],
        required: true,
      },
      // Only set when source === "upload", lets us delete the file later
      storageKey: {
        type: String,
        default: null,
      },
    },

    // Layout hint used by the masonry grid on the frontend ("tall" spans 2 rows)
    size: {
      type: String,
      enum: ["normal", "tall"],
      default: "normal",
    },

    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        Array.isArray(tags)
          ? [...new Set(tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))]
          : [],
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Soft delete so accidental deletes are recoverable and analytics stay intact
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Common query: a seller's non-deleted posts, newest first
editorialPostSchema.index({ seller: 1, isDeleted: 1, createdAt: -1 });

// Virtual: human-friendly view count, e.g. 1200 -> "1.2k" (mirrors frontend formatting)
editorialPostSchema.virtual("viewsFormatted").get(function () {
  const v = this.views;
  if (v >= 1000) {
    return `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(v);
});

editorialPostSchema.set("toJSON", { virtuals: true });
editorialPostSchema.set("toObject", { virtuals: true });

// Query helper to exclude soft-deleted docs by default
editorialPostSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

module.exports = mongoose.model("EditorialPost", editorialPostSchema);
