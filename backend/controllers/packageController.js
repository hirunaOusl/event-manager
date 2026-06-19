// controllers/packageController.js
const EventPackage = require("../models/EventPackage");
const fs = require("fs");
const path = require("path");

// ── Helper: build image URL ────────────────────────────────────────────
const getImageUrl = (req, filename) =>
    filename ? `${req.protocol}://${req.get("host")}/uploads/${filename}` : "";

// ─────────────────────────────────────────────────────────────────────
// @desc    Get all event packages
// @route   GET /api/packages
// @access  Public
// ─────────────────────────────────────────────────────────────────────
const getAllPackages = async (req, res, next) => {
    try {
        const { category, isActive, seller } = req.query;

        const filter = {};
        if (category) filter.category = category.toUpperCase();
        if (isActive !== undefined) filter.isActive = isActive === "true";
        if (seller) filter.seller = seller;

        const packages = await EventPackage.find(filter).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: packages.length,
            data: packages,
        });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Get single event package by ID
// @route   GET /api/packages/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────
const getPackageById = async (req, res, next) => {
    try {
        const pkg = await EventPackage.findById(req.params.id);

        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        res.status(200).json({ success: true, data: pkg });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Create new event package
// @route   POST /api/packages
// @access  Private (add auth middleware later)
// ─────────────────────────────────────────────────────────────────────
const createPackage = async (req, res, next) => {
    try {
        const { category, title, description, badge, isActive, order } = req.body;

        // If image file uploaded, use its path; else use imageUrl from body
        let image = req.body.imageUrl || "";
        if (req.file) {
            image = getImageUrl(req, req.file.filename);
        }

        const pkg = await EventPackage.create({
            category,
            title,
            description,
            image,
            badge: badge || null,
            isActive: isActive !== undefined ? isActive : true,
            order: order || 0,
            seller: req.seller._id,
        });

        res.status(201).json({ success: true, message: "Package created", data: pkg });
    } catch (error) {
        // If file was saved but DB failed, clean it up
        if (req.file) {
            fs.unlink(path.join(__dirname, "../uploads", req.file.filename), () => { });
        }
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Update event package
// @route   PUT /api/packages/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────
const updatePackage = async (req, res, next) => {
    try {
        const pkg = await EventPackage.findById(req.params.id);

        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        // Check ownership
        if (pkg.seller && pkg.seller.toString() !== req.seller._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this package" });
        }

        if (!pkg.seller) {
            pkg.seller = req.seller._id;
        }

        const { category, title, description, badge, isActive, order } = req.body;

        // Handle new image upload
        if (req.file) {
            // Delete old local image if it was a local upload
            if (pkg.image && pkg.image.includes("/uploads/")) {
                const oldFile = path.join(__dirname, "../uploads", path.basename(pkg.image));
                fs.unlink(oldFile, () => { }); // silently ignore if missing
            }
            pkg.image = getImageUrl(req, req.file.filename);
        } else if (req.body.imageUrl !== undefined) {
            // URL-based image update
            pkg.image = req.body.imageUrl;
        }

        if (category !== undefined) pkg.category = category;
        if (title !== undefined) pkg.title = title;
        if (description !== undefined) pkg.description = description;
        if (badge !== undefined) pkg.badge = badge || null;
        if (isActive !== undefined) pkg.isActive = isActive;
        if (order !== undefined) pkg.order = order;

        const updated = await pkg.save();

        res.status(200).json({ success: true, message: "Package updated", data: updated });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Delete event package
// @route   DELETE /api/packages/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────
const deletePackage = async (req, res, next) => {
    try {
        const pkg = await EventPackage.findById(req.params.id);

        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        // Check ownership
        if (pkg.seller && pkg.seller.toString() !== req.seller._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this package" });
        }

        // Delete uploaded image file if local
        if (pkg.image && pkg.image.includes("/uploads/")) {
            const imgFile = path.join(__dirname, "../uploads", path.basename(pkg.image));
            fs.unlink(imgFile, () => { });
        }

        await pkg.deleteOne();

        res.status(200).json({ success: true, message: "Package deleted", data: {} });
    } catch (error) {
        next(error);
    }
};

// ─────────────────────────────────────────────────────────────────────
// @desc    Seed sample packages (dev only)
// @route   POST /api/packages/seed
// @access  Dev
// ─────────────────────────────────────────────────────────────────────
const seedPackages = async (req, res, next) => {
    try {
        await EventPackage.deleteMany({});

        const samples = [
            {
                category: "LIFESTYLE",
                title: "Sunset Soirée",
                description: "Exclusive rooftop gathering with bespoke cocktails and live jazz ensemble.",
                image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
                badge: "PREMIUM",
                order: 1,
            },
            {
                category: "CULINARY",
                title: "Gourmet Gala",
                description: "A seven-course tasting menu curated by Michelin-starred guest chefs.",
                image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
                order: 2,
            },
            {
                category: "CORPORATE",
                title: "Innovate Summit",
                description: "Full-day executive networking experience in a state-of-the-art venue.",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
                order: 3,
            },
        ];

        const created = await EventPackage.insertMany(samples);

        res.status(201).json({
            success: true,
            message: `${created.length} packages seeded`,
            data: created,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
    seedPackages,
};