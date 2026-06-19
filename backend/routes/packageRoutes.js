// routes/packageRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const {
    getAllPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
    seedPackages,
} = require("../controllers/packageController");

// ── Dev seed route ─────────────────────────────────────────────────────
// POST /api/packages/seed
router.post("/seed", seedPackages);

// ── CRUD routes ────────────────────────────────────────────────────────
// GET    /api/packages           → list all (with optional ?category=&isActive=)
// POST   /api/packages           → create (supports multipart/form-data image upload)
// GET    /api/packages/:id       → single package
// PUT    /api/packages/:id       → update (supports multipart/form-data image upload)
// DELETE /api/packages/:id       → delete

router.route("/")
    .get(getAllPackages)
    .post(protect, upload.single("image"), createPackage);

router.route("/:id")
    .get(getPackageById)
    .put(protect, upload.single("image"), updatePackage)
    .delete(protect, deletePackage);

module.exports = router;