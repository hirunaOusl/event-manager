// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
// ── Storage: saves to /uploads folder ─────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const unique = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
        cb(null, `file-${unique}${ext}`);
    },
});

// ── File filter: images only ───────────────────────────────────────────
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error("Only jpeg, jpg, png, webp images are allowed"), false);
    }
};

const maxFileSizeBytes = (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxFileSizeBytes },
});
module.exports = upload;