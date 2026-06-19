// src/services/packageService.js
// Drop this in your Vite React project at src/services/packageService.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Helper ─────────────────────────────────────────────────────────────
const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
};

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── GET all packages (optional filters) ───────────────────────────────
// params: { category: "CULINARY", isActive: true }
export const fetchPackages = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/packages${query ? `?${query}` : ""}`);
    return handleResponse(res);
};

// ── GET single package ─────────────────────────────────────────────────
export const fetchPackageById = async (id) => {
    const res = await fetch(`${BASE_URL}/packages/${id}`);
    return handleResponse(res);
};

// ── CREATE package (supports image file upload) ────────────────────────
// data: { category, title, description, badge?, imageUrl? }
// imageFile: File object (optional — from <input type="file">)
export const createPackage = async (data, imageFile = null) => {
    const form = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined && val !== null) form.append(key, val);
    });
    if (imageFile) form.append("image", imageFile);

    const res = await fetch(`${BASE_URL}/packages`, {
        method: "POST",
        headers: getHeaders(), // send authorization token
        body: form, // don't set Content-Type — browser sets multipart boundary
    });
    return handleResponse(res);
};

// ── UPDATE package ─────────────────────────────────────────────────────
export const updatePackage = async (id, data, imageFile = null) => {
    const form = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined && val !== null) form.append(key, val);
    });
    if (imageFile) form.append("image", imageFile);

    const res = await fetch(`${BASE_URL}/packages/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: form,
    });
    return handleResponse(res);
};

// ── DELETE package ─────────────────────────────────────────────────────
export const deletePackage = async (id) => {
    const res = await fetch(`${BASE_URL}/packages/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });
    return handleResponse(res);
};

// ── SEED (dev only) ────────────────────────────────────────────────────
export const seedPackages = async () => {
    const res = await fetch(`${BASE_URL}/packages/seed`, { method: "POST" });
    return handleResponse(res);
};