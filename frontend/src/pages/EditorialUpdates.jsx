import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// --- API config ---------------------------------------------------------
// Change this to wherever your backend is running / deployed.
const API_BASE = "http://localhost:5000/api";

// Fetch token from standard local storage key
const getAuthToken = () => localStorage.getItem("token");

async function apiRequest(path, { method = "GET", body, isForm = false } = {}) {
  const headers = {};
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

const PostsAPI = {
  list: (sellerId) => apiRequest(`/posts?seller=${sellerId}&limit=50`),
  createFromUrl: (payload) => apiRequest("/posts", { method: "POST", body: payload }),
  createFromFile: (file, fields) => {
    const form = new FormData();
    form.append("image", file);
    Object.entries(fields).forEach(([k, v]) => v !== undefined && form.append(k, v));
    return apiRequest("/posts", { method: "POST", body: form, isForm: true });
  },
  update: (id, payload) => apiRequest(`/posts/${id}`, { method: "PUT", body: payload }),
  remove: (id) => apiRequest(`/posts/${id}`, { method: "DELETE" }),
};

// --- Icons ---------------------------------------------------------------

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M5 6.66667H0V5H5V0H6.66667V5H11.6667V6.66667H6.66667V11.6667H5V6.66667Z" fill="#F2F0F0" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1.4 16L0 14.6L6.6 8L0 1.4L1.4 0L8 6.6L14.6 0L16 1.4L9.4 8L16 14.6L14.6 16L8 9.4L1.4 16Z" fill="#5F5E5E" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 16C3.45 16 2.97917 15.8042 2.5875 15.4125C2.19583 15.0208 2 14.55 2 14V3H1V1H5V0H11V1H15V3H14V14C14 14.55 13.8042 15.0208 13.4125 15.4125C13.0208 15.8042 12.55 16 12 16H4ZM12 3H4V14H12V3ZM6 12H8V5H6V12ZM10 12H12V5H10V12Z" fill="#FBF9F8" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
    <path d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0Z" fill="#FBF9F8" />
  </svg>
);

const ImageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 20 18" fill="none">
    <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V16C20 16.55 19.8042 17.0208 19.4125 17.4125C19.0208 17.8042 18.55 18 18 18H2ZM2 16H18V2H2V16ZM3 14H17L13 9L10 13L8 10.5L3 14Z" fill="#837560" />
  </svg>
);

const Spinner = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="animate-spin"
    style={{ animation: "spin 0.8s linear infinite" }}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M22 12C22 6.477 17.523 2 12 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// --- Helpers ---------------------------------------------------------------

function formatViews(n) {
  if (typeof n !== "number") return n ?? "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

// --- New / Edit Post Modal --------------------------------------------------

function PostModal({ initialPost, onClose, onSaved }) {
  const { user } = useContext(AuthContext);
  const isEdit = Boolean(initialPost);
  const [title, setTitle] = useState(initialPost?.title || "");
  const [caption, setCaption] = useState(initialPost?.caption || "");
  const [size, setSize] = useState(initialPost?.size || "normal");
  const [imageMode, setImageMode] = useState("upload"); // "upload" | "url"
  const [imageUrl, setImageUrl] = useState(initialPost?.image?.source === "url" ? initialPost.image.url : "");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialPost?.image?.url || null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const hasNewImage = imageMode === "upload" ? Boolean(file) : Boolean(imageUrl.trim());
    if (!isEdit && !hasNewImage) {
      setError("Please add an image to publish this post.");
      return;
    }

    setSubmitting(true);
    try {
      const sellerId = user?.id || user?._id;
      let saved;

      if (isEdit) {
        if (imageMode === "upload" && file) {
          const form = new FormData();
          form.append("image", file);
          form.append("title", title);
          form.append("caption", caption);
          form.append("size", size);
          saved = await apiRequest(`/posts/${initialPost._id}`, { method: "PUT", body: form, isForm: true });
        } else if (imageMode === "url" && imageUrl.trim() && imageUrl !== initialPost?.image?.url) {
          saved = await PostsAPI.update(initialPost._id, { title, caption, size, imageUrl: imageUrl.trim() });
        } else {
          saved = await PostsAPI.update(initialPost._id, { title, caption, size });
        }
      } else if (imageMode === "upload") {
        saved = await PostsAPI.createFromFile(file, {
          title,
          caption,
          size,
          status: "published",
          seller: sellerId,
        });
      } else {
        saved = await PostsAPI.createFromUrl({
          title,
          caption,
          size,
          status: "published",
          imageUrl: imageUrl.trim(),
        });
      }

      onSaved(saved.data, { isEdit });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(27,28,28,0.55)] backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FBF9F8] shadow-2xl border border-[rgba(213,196,171,0.30)]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(213,196,171,0.30)]">
          <h3 className="font-playfair text-xl font-semibold text-[#1B1C1C]">
            {isEdit ? "Edit Post" : "New Editorial Post"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#EFEDED] transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Image source toggle */}
          <div>
            <label className="block font-hanken text-sm font-medium text-[#1B1C1C] mb-2">Image</label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`px-4 py-1.5 rounded-full font-hanken text-sm transition-colors ${
                  imageMode === "upload"
                    ? "bg-[#1B1C1C] text-[#FBF9F8]"
                    : "bg-[#EFEDED] text-[#5F5E5E] hover:bg-[#E5E3E3]"
                }`}
              >
                Upload file
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`px-4 py-1.5 rounded-full font-hanken text-sm transition-colors ${
                  imageMode === "url"
                    ? "bg-[#1B1C1C] text-[#FBF9F8]"
                    : "bg-[#EFEDED] text-[#5F5E5E] hover:bg-[#E5E3E3]"
                }`}
              >
                Use a URL
              </button>
            </div>

            {imageMode === "upload" ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-40 rounded-xl border-2 border-dashed border-[#D5C4AB] bg-[#EFEDED] flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#7C5800] transition-colors"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#837560]">
                    <ImageIcon />
                    <span className="font-hanken text-sm">Click to choose an image</span>
                    <span className="font-hanken text-xs text-[#9B9B9B]">JPEG, PNG, WEBP, or GIF — max 5MB</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.example.com/photo.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-[rgba(213,196,171,0.50)] bg-[#FBF9F8] font-hanken text-sm text-[#1B1C1C] outline-none focus:border-[#7C5800] transition-colors"
                />
                {imageUrl && (
                  <div className="mt-3 h-32 rounded-lg overflow-hidden bg-[#EFEDED]">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.opacity = 0.2)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block font-hanken text-sm font-medium text-[#1B1C1C] mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Behind the Gala"
              maxLength={120}
              className="w-full px-4 py-2.5 rounded-lg border border-[rgba(213,196,171,0.50)] bg-[#FBF9F8] font-hanken text-sm text-[#1B1C1C] outline-none focus:border-[#7C5800] transition-colors"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block font-hanken text-sm font-medium text-[#1B1C1C] mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tell people what this post is about..."
              rows={3}
              maxLength={2000}
              className="w-full px-4 py-2.5 rounded-lg border border-[rgba(213,196,171,0.50)] bg-[#FBF9F8] font-hanken text-sm text-[#1B1C1C] outline-none focus:border-[#7C5800] transition-colors resize-none"
            />
          </div>

          {/* Size */}
          <div>
            <label className="block font-hanken text-sm font-medium text-[#1B1C1C] mb-2">Grid size</label>
            <div className="flex gap-2">
              {[
                { val: "normal", label: "Normal" },
                { val: "tall", label: "Tall (featured)" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSize(opt.val)}
                  className={`px-4 py-1.5 rounded-full font-hanken text-sm transition-colors ${
                    size === opt.val
                      ? "bg-[#FFB800] text-[#6B4C00] font-bold"
                      : "bg-[#EFEDED] text-[#5F5E5E] hover:bg-[#E5E3E3]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="font-hanken text-sm text-[#B3261E] bg-[rgba(179,38,30,0.08)] border border-[rgba(179,38,30,0.20)] rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#EFEDED] text-[#1B1C1C] font-hanken text-sm font-medium hover:bg-[#E5E3E3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#303031] text-[#F2F0F0] font-hanken text-sm font-bold hover:bg-[#1B1C1C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && <Spinner size={14} />}
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Publish post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Delete confirmation ----------------------------------------------------

function ConfirmDeleteDialog({ onConfirm, onCancel, deleting }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(27,28,28,0.55)] backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-[380px] rounded-2xl bg-[#FBF9F8] shadow-2xl border border-[rgba(213,196,171,0.30)] p-6">
        <h3 className="font-playfair text-lg font-semibold text-[#1B1C1C] mb-2">Delete this post?</h3>
        <p className="font-hanken text-sm text-[#5F5E5E] mb-5">
          This will remove it from your editorial grid. You can't undo this from here.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-5 py-2.5 rounded-lg bg-[#EFEDED] text-[#1B1C1C] font-hanken text-sm font-medium hover:bg-[#E5E3E3] transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B3261E] text-[#FBF9F8] font-hanken text-sm font-bold hover:bg-[#8F1E18] transition-colors disabled:opacity-60"
          >
            {deleting && <Spinner size={14} />}
            {deleting ? "Deleting..." : "Delete post"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Post tile (grid item with hover actions) -------------------------------

function PostTile({ post, isFeatured, onEdit, onDeleteRequest }) {
  return (
    <div
      className={`${isFeatured ? "row-span-2" : ""} relative rounded-xl overflow-hidden cursor-pointer group`}
    >
      <img
        src={post.image?.url}
        alt={post.title || "Editorial post"}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.65)] via-transparent to-transparent" />

      <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
        <span className="font-hanken text-white text-sm font-medium">
          {post.viewsFormatted ?? formatViews(post.views)}
        </span>
      </div>

      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(post);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(27,28,28,0.55)] hover:bg-[#7C5800] transition-colors"
          aria-label="Edit post"
        >
          <EditIcon />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(post);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(27,28,28,0.55)] hover:bg-[#B3261E] transition-colors"
          aria-label="Delete post"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

// --- Main component ----------------------------------------------------------

export default function EditorialUpdates() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null); // null = creating new
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    const sellerId = user?.id || user?._id;
    if (!sellerId) {
      setError("No seller is signed in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await PostsAPI.list(sellerId);
      setPosts(res.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load editorial posts.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openCreateModal = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const handleSaved = (savedPost, { isEdit }) => {
    setPosts((prev) =>
      isEdit ? prev.map((p) => (p._id === savedPost._id ? savedPost : p)) : [savedPost, ...prev]
    );
    setModalOpen(false);
    setEditingPost(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await PostsAPI.remove(deleteTarget._id);
      setPosts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Couldn't delete that post.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="max-w-[1280px] mx-auto px-8 lg:px-16 py-4 pb-12">
      <div className="flex justify-between items-center p-5 rounded-2xl border border-[rgba(213,196,171,0.30)] bg-[rgba(245,243,243,0.50)] mb-6">
        <h2 className="font-playfair text-2xl font-semibold text-[#1B1C1C]">Editorial Updates</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#303031] text-[#F2F0F0] font-hanken text-sm font-bold hover:bg-[#1B1C1C] transition-colors"
        >
          <PlusIcon />
          New Post
        </button>
      </div>

      {error && (
        <p className="font-hanken text-sm text-[#B3261E] bg-[rgba(179,38,30,0.08)] border border-[rgba(179,38,30,0.20)] rounded-lg px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40 text-[#837560]">
          <Spinner size={24} />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 h-52 rounded-xl border border-dashed border-[#D5C4AB] bg-[rgba(245,243,243,0.40)]">
          <ImageIcon />
          <p className="font-hanken text-sm text-[#5F5E5E]">No editorial posts yet.</p>
          <button
            onClick={openCreateModal}
            className="font-hanken text-sm font-bold text-[#7C5800] hover:underline"
          >
            Publish your first post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[240px]">
          {posts.map((post, i) => (
            <PostTile
              key={post._id}
              post={post}
              isFeatured={i === 0 && post.size === "tall"}
              onEdit={openEditModal}
              onDeleteRequest={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <PostModal
          initialPost={editingPost}
          onClose={() => {
            setModalOpen(false);
            setEditingPost(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteDialog
          deleting={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
