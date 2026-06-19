// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error("🔴 Error:", err.message);

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: messages.join(", ") });
    }

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    // Multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File too large. Max 5MB." });
    }

    // Default
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error",
    });
};

module.exports = errorHandler;