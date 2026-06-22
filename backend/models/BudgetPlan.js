// models/BudgetPlan.js
const mongoose = require("mongoose");

const budgetPlanSchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventPackage",
      required: [true, "Package reference is required"],
      unique: true, // Every event package has exactly one budget plan searchable record
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller reference is required"],
    },
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },
    subCategory: {
      type: String,
      required: [true, "Sub-category is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    rating: {
      type: String,
      default: "0.0",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BudgetPlan", budgetPlanSchema);
