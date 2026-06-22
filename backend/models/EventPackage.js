// models/EventPackage.js
const mongoose = require("mongoose");

const eventPackageSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["LIFESTYLE", "CULINARY", "CORPORATE", "WEDDING", "PARTY", "OFFICIAL", "FUNCTIONS"],
            uppercase: true,
            trim: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        image: {
            type: String,         // stores URL or local upload path
            default: "",
        },
        badge: {
            type: String,         // e.g. "PREMIUM" — optional
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        order: {
            type: Number,         // for manual drag-to-reorder later
            default: 0,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,       // createdAt, updatedAt auto fields
    }
);

module.exports = mongoose.model("EventPackage", eventPackageSchema);