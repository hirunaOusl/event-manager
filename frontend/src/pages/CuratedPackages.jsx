import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  fetchPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "../services/packageService";

// ── Icons ──────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
    <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#5F5E5E" />
  </svg>
);
const ChevronRight = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
    <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="#5F5E5E" />
  </svg>
);
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0Z" fill="#837560" />
  </svg>
);
const PlusCircle = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M18 30H22V22H30V18H22V10H18V18H10V22H18V30ZM20 40C17.2333 40 14.6333 39.475 12.2 38.425C9.76667 37.375 7.65 35.95 5.85 34.15C4.05 32.35 2.625 30.2333 1.575 27.8C0.525 25.3667 0 22.7667 0 20C0 17.2333 0.525 14.6333 1.575 12.2C2.625 9.76667 4.05 7.65 5.85 5.85C7.65 4.05 9.76667 2.625 12.2 1.575C14.6333 0.525 17.2333 0 20 0C22.7667 0 25.3667 0.525 27.8 1.575C30.2333 2.625 32.35 4.05 34.15 5.85C35.95 7.65 37.375 9.76667 38.425 12.2C39.475 14.6333 40 17.2333 40 20C40 22.7667 39.475 25.3667 38.425 27.8C37.375 30.2333 35.95 32.35 34.15 34.15C32.35 35.95 30.2333 37.375 27.8 38.425C25.3667 39.475 22.7667 40 20 40ZM20 36C24.4667 36 28.25 34.45 31.35 31.35C34.45 28.25 36 24.4667 36 20C36 15.5333 34.45 11.75 31.35 8.65C28.25 5.55 24.4667 4 20 4C15.5333 4 11.75 5.55 8.65 8.65C5.55 11.75 4 15.5333 4 20C4 24.4667 5.55 28.25 8.65 31.35C11.75 34.45 15.5333 36 20 36Z" fill="#837560" />
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" />
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
  </svg>
);

const CATEGORIES = ["LIFESTYLE", "CULINARY", "CORPORATE", "WEDDING", "PARTY", "OFFICIAL", "FUNCTIONS"];
const EMPTY_FORM = { category: "LIFESTYLE", title: "", description: "", badge: "", imageUrl: "" };

// ── Package Card ───────────────────────────────────────────────────────
function PackageCard({ pkg, onEdit, onDelete }) {
  return (
    <div className="flex flex-col rounded-xl bg-[#F5F3F3] overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
      <div className="relative overflow-hidden">
        <img
          src={pkg.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80"}
          alt={pkg.title}
          className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {pkg.badge && (
          <span className="absolute top-3 right-3 px-3 py-0.5 rounded-full bg-[#FFB800] text-[#6B4C00] font-hanken text-[10px] font-bold tracking-widest">
            {pkg.badge}
          </span>
        )}
        {/* Edit / Delete overlay */}
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.45)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(pkg)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#1B1C1C] font-hanken text-xs font-semibold hover:bg-[#FFB800] hover:text-[#6B4C00] transition-colors"
          >
            <EditIcon /> Edit
          </button>
          <button
            onClick={() => onDelete(pkg._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-red-600 font-hanken text-xs font-semibold hover:bg-red-600 hover:text-white transition-colors"
          >
            <TrashIcon /> Delete
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-1">
        <p className="font-hanken text-[10px] text-[#7C5800] tracking-[0.1em]">{pkg.category}</p>
        <h3 className="font-playfair text-lg text-[#1B1C1C] leading-7">{pkg.title}</h3>
        <p className="font-hanken text-sm text-[#5F5E5E] font-semibold leading-[1.5] tracking-wide line-clamp-2">
          {pkg.description}
        </p>
      </div>
    </div>
  );
}

// ── Package Form Modal ─────────────────────────────────────────────────
function PackageModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const isEdit = !!initial?._id;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category) {
      setError("Title, category and description are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        category: form.category,
        title: form.title,
        description: form.description,
        badge: form.badge || "",
        imageUrl: imageFile ? "" : form.imageUrl || form.image || "",
      };

      if (isEdit) {
        await updatePackage(initial._id, payload, imageFile);
      } else {
        await createPackage(payload, imageFile);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.55)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(213,196,171,0.30)]">
          <h2 className="font-playfair text-xl font-semibold text-[#1B1C1C]">
            {isEdit ? "Edit Package" : "New Package"}
          </h2>
          <button onClick={onClose} className="text-[#5F5E5E] hover:text-[#1B1C1C] transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <p className="text-red-600 font-hanken text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          {/* Image preview */}
          {preview && (
            <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-xl" />
          )}

          {/* Image upload */}
          <div className="flex flex-col gap-1">
            <label className="font-hanken text-xs text-[#5F5E5E] tracking-wide">Image (upload file)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="font-hanken text-sm text-[#1B1C1C] file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-[#E4E2E2] file:text-[#514532] file:font-semibold file:text-xs hover:file:bg-[#D5C4AB] cursor-pointer"
            />
          </div>

          {/* Or image URL */}
          <div className="flex flex-col gap-1">
            <label className="font-hanken text-xs text-[#5F5E5E] tracking-wide">Or paste image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl || form.image || ""}
              onChange={(e) => {
                handleChange(e);
                setPreview(e.target.value);
                setImageFile(null);
              }}
              placeholder="https://..."
              className="h-10 px-4 rounded-lg border border-[rgba(213,196,171,0.50)] bg-[#F5F3F3] font-hanken text-sm text-[#1B1C1C] outline-none focus:ring-2 focus:ring-[rgba(213,196,171,0.60)]"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="font-hanken text-xs text-[#5F5E5E] tracking-wide">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="h-10 px-4 rounded-lg border border-[rgba(213,196,171,0.50)] bg-[#F5F3F3] font-hanken text-sm text-[#1B1C1C] outline-none"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="font-hanken text-xs text-[#5F5E5E] tracking-wide">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Sunset Soirée"
              className="h-10 px-4 rounded-lg border border-[rgba(213,196,171,0.50)] bg-[#F5F3F3] font-hanken text-sm text-[#1B1C1C] outline-none focus:ring-2 focus:ring-[rgba(213,196,171,0.60)]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-hanken text-xs text-[#5F5E5E] tracking-wide">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the experience..."
              className="px-4 py-3 rounded-lg border border-[rgba(213,196,171,0.50)] bg-[#F5F3F3] font-hanken text-sm text-[#1B1C1C] outline-none focus:ring-2 focus:ring-[rgba(213,196,171,0.60)] resize-none"
            />
          </div>

          {/* Badge */}
          <div className="flex flex-col gap-1">
            <label className="font-hanken text-xs text-[#5F5E5E] tracking-wide">Badge (optional, e.g. PREMIUM)</label>
            <input
              name="badge"
              value={form.badge || ""}
              onChange={handleChange}
              placeholder="PREMIUM"
              className="h-10 px-4 rounded-lg border border-[rgba(213,196,171,0.50)] bg-[#F5F3F3] font-hanken text-sm text-[#1B1C1C] outline-none focus:ring-2 focus:ring-[rgba(213,196,171,0.60)]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[rgba(213,196,171,0.20)]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#EFEDED] text-[#1B1C1C] font-hanken text-sm font-medium hover:bg-[#E5E3E3] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-7 py-2 rounded-lg bg-[#FFB800] text-[#6B4C00] font-hanken text-sm font-bold shadow hover:bg-[#F0AC00] transition-colors disabled:opacity-60"
          >
            {loading ? "Saving…" : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.55)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 flex flex-col gap-5">
        <h2 className="font-playfair text-xl font-semibold text-[#1B1C1C]">Delete Package?</h2>
        <p className="font-hanken text-sm text-[#5F5E5E]">
          This action cannot be undone. The package will be permanently removed.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg bg-[#EFEDED] text-[#1B1C1C] font-hanken text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-hanken text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main CuratedPackages Component ────────────────────────────────────
export default function CuratedPackages() {
  const { user } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);        // null | "create" | { pkg object for edit }
  const [deleteId, setDeleteId] = useState(null);  // id to delete
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchPackages({ seller: user?.id || user?._id });
      setPackages(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePackage(deleteId);
      setDeleteId(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="max-w-[1280px] mx-auto px-8 lg:px-16 py-8">
      {/* Section header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-playfair text-2xl font-semibold text-[#1B1C1C]">
            Curated Event Packages
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full border border-[#D5C4AB] flex items-center justify-center hover:bg-[#EFEDED] transition-colors">
            <ChevronLeft />
          </button>
          <button className="w-10 h-10 rounded-full border border-[#D5C4AB] flex items-center justify-center hover:bg-[#EFEDED] transition-colors">
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[320px] rounded-xl bg-[#F0EDEA] animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <p className="font-hanken text-red-600 text-sm">{error}</p>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg._id}
              pkg={pkg}
              onEdit={(p) => setModal(p)}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}

          {/* New Package card */}
          <div
            onClick={() => setModal("create")}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[rgba(213,196,171,0.60)] bg-[#F5F3F3] min-h-[300px] gap-3 cursor-pointer hover:border-[#7C5800] hover:bg-[#F0EDE9] transition-all duration-200 p-8 text-center"
          >
            <PlusCircle />
            <p className="font-playfair text-lg text-[#5F5E5E]">New Package</p>
            <p className="font-hanken text-sm text-[#837560] font-semibold tracking-wide">
              Create a new curated experience for your clients.
            </p>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <PackageModal
          initial={modal === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <DeleteConfirm
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </section>
  );
}