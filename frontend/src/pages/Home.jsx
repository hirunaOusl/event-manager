import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ── Icons ──────────────────────────────────────────────────────────────
const ChevronLeft = () => (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
        <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="white" />
    </svg>
);

const ChevronRight = () => (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
        <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="white" />
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 24" fill="none">
        <path
            d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z"
            fill="#5F5E5E"
        />
    </svg>
);

const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
            d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0Z"
            fill="#514532"
        />
    </svg>
);

const ChevronDown = () => (
    <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
        <path d="M4.5 5.55L0 1.05L1.05 0L4.5 3.45L7.95 0L9 1.05L4.5 5.55Z" fill="#1B1C1C" />
    </svg>
);

// ── Data ───────────────────────────────────────────────────────────────
const sliderImages = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=85",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=85",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1400&q=85",
];

const categories = ["All", "wedding", "party", "official", "functions"];

const allPosts = [
    {
        id: 1,
        category: "party",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
        height: "h-[340px]",
    },
    {
        id: 2,
        category: "wedding",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
        height: "h-[220px]",
    },
    {
        id: 3,
        category: "official",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
        height: "h-[340px]",
    },
    {
        id: 4,
        category: "functions",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
        height: "h-[220px]",
    },
    {
        id: 5,
        category: "wedding",
        image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80",
        height: "h-[380px]",
    },
    {
        id: 6,
        category: "official",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
        height: "h-[280px]",
    },
    {
        id: 7,
        category: "party",
        image: "https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?w=600&q=80",
        height: "h-[300px]",
    },
    {
        id: 8,
        category: "functions",
        image: "https://images.unsplash.com/photo-1560523159-4a9692d222ef?w=600&q=80",
        height: "h-[360px]",
    },
    {
        id: 9,
        category: "wedding",
        image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
        height: "h-[260px]",
    },
];

const dropdownItems = [
    { section: null, items: ["Home", "Business Hub"] },
    { section: null, items: ["Profile", "Setting"] },
    { section: null, items: ["Logout"] },
];

const footerLinks = ["Privacy Policy", "Terms of Service", "FAQ", "About Us"];

// ── Navbar ─────────────────────────────────────────────────────────────
function Navbar() {
    const { user } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navLinks = ["Home", "Events", "Contact Us"];

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-[rgba(213,196,171,0.30)] bg-white shadow-sm">
            <div className="max-w-[1280px] mx-auto px-8 lg:px-16 flex justify-between items-center h-[64px]">
                {/* Logo + Nav links */}
                <div className="flex items-center gap-10">
                    <span className="font-playfair text-2xl font-bold text-[#1B1C1C] tracking-tight cursor-pointer">
                        LuxeDiscovery
                    </span>
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link}
                                className="font-hanken text-[15px] font-medium text-[#1B1C1C] tracking-wide hover:text-[#7C5800] transition-colors"
                            >
                                {link}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right — user pill */}
                <div className="relative flex items-center gap-3">
                    <div className="flex justify-center items-center rounded-full border border-[rgba(213,196,171,0.30)] bg-[#E4E2E2] w-10 h-10 overflow-hidden">
                        <UserIcon />
                    </div>
                    <button
                        onClick={() => setDropdownOpen((p) => !p)}
                        className="flex items-center gap-1 font-hanken text-sm font-semibold text-[#1B1C1C] tracking-wide hover:text-[#7C5800] transition-colors animate-fade-in"
                    >
                        {user?.username || "Luxe Explorer"}
                        <ChevronDown />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-12 rounded-2xl bg-[#5F5E5E] shadow-xl w-56 z-50 overflow-hidden">
                            {/* Profile row */}
                            <div className="flex items-center gap-3 p-4">
                                <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.20)] flex items-center justify-center">
                                    <UserIcon />
                                </div>
                                <span className="font-hanken text-sm font-semibold text-white tracking-wide">
                                    {user?.username || "Luxe Explorer"}
                                </span>
                            </div>
                            <div className="mx-4 h-px bg-[rgba(255,255,255,0.20)]" />
                            {/* Links group 1 */}
                            <div className="py-2">
                                {["Home", "Business Hub"].map((item) => (
                                    <button
                                        key={item}
                                        className="w-full text-left px-6 py-2 font-hanken text-base text-white hover:bg-[rgba(255,255,255,0.10)] transition-colors"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                            <div className="mx-4 h-px bg-[rgba(255,255,255,0.20)]" />
                            {/* Links group 2 */}
                            <div className="py-2">
                                {["Profile", "Setting"].map((item) => (
                                    <button
                                        key={item}
                                        className="w-full text-left px-6 py-2 font-hanken text-base text-white hover:bg-[rgba(255,255,255,0.10)] transition-colors"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                            <div className="mx-4 h-px bg-[rgba(255,255,255,0.20)]" />
                            {/* Logout */}
                            <div className="py-2">
                                <button className="w-full text-left px-6 py-3 font-hanken text-base text-white hover:bg-[rgba(255,255,255,0.10)] transition-colors">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

// ── Image Slider ───────────────────────────────────────────────────────
function ImageSlider() {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((p) => (p === 0 ? sliderImages.length - 1 : p - 1));
    const next = () => setCurrent((p) => (p === sliderImages.length - 1 ? 0 : p + 1));

    return (
        <div className="max-w-[1280px] mx-auto px-8 lg:px-16 pt-6">
            <div className="relative w-full h-[384px] rounded-2xl overflow-hidden">
                {/* Slide image */}
                <img
                    src={sliderImages[current]}
                    alt="Event Slide"
                    className="w-full h-full object-cover transition-all duration-700"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.15)]" />

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="font-playfair text-5xl md:text-[64px] font-bold text-white leading-tight tracking-tight text-center drop-shadow-lg">
                        Curated Experiences
                    </p>
                </div>

                {/* Prev button */}
                <button
                    onClick={prev}
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[rgba(255,255,255,0.20)] hover:bg-[rgba(255,255,255,0.35)] flex items-center justify-center transition-colors"
                >
                    <ChevronLeft />
                </button>

                {/* Next button */}
                <button
                    onClick={next}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[rgba(255,255,255,0.20)] hover:bg-[rgba(255,255,255,0.35)] flex items-center justify-center transition-colors"
                >
                    <ChevronRight />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {sliderImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-5" : "bg-[rgba(255,255,255,0.50)]"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Filter Bar ─────────────────────────────────────────────────────────
function FilterBar({ active, setActive, search, setSearch }) {
    return (
        <div className="max-w-[1280px] mx-auto px-8 lg:px-16 py-5 flex flex-wrap justify-between items-center gap-4">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`px-5 py-1.5 rounded-full font-hanken text-sm font-semibold tracking-wide transition-colors ${active === cat
                            ? "bg-[#5F5E5E] text-white"
                            : "bg-[#E4E2E2] text-[#514532] hover:bg-[#D5C4AB]"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-72">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search events..."
                    className="w-full h-11 rounded-full bg-[#E9E8E7] pl-5 pr-12 font-hanken text-sm text-[#1B1C1C] placeholder:text-[#5F5E5E] outline-none focus:ring-2 focus:ring-[rgba(213,196,171,0.60)]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <SearchIcon />
                </span>
            </div>
        </div>
    );
}

// ── Masonry Grid ───────────────────────────────────────────────────────
function MasonryGrid({ posts, navigate }) {
    if (posts.length === 0) {
        return (
            <div className="max-w-[1280px] mx-auto px-8 lg:px-16 py-16 text-center">
                <p className="font-hanken text-[#5F5E5E] text-base">No events found.</p>
            </div>
        );
    }

    // Split posts into 3 columns
    const cols = [[], [], []];
    posts.forEach((post, i) => cols[i % 3].push(post));

    return (
        <div className="max-w-[1280px] mx-auto px-8 lg:px-16 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cols.map((col, ci) => (
                    <div key={ci} className="flex flex-col gap-4">
                        {col.map((post) => {
                            const postId = post._id || post.id;
                            const postImage = post.image?.url || post.image;
                            const postHeight = post.height || (post.size === "tall" ? "h-[380px]" : "h-[260px]");
                            const postCategory = post.category || "party";
                            const sellerId = post.seller?._id || post.seller;

                            return (
                                <div
                                    key={postId}
                                    className={`relative rounded-xl overflow-hidden cursor-pointer group shadow-sm ${postHeight}`}
                                >
                                    <img
                                        src={postImage}
                                        alt={post.title || `Event ${postId}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.60)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Category badge on hover */}
                                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <span className="font-hanken text-[10px] font-bold text-white tracking-[0.1em] uppercase bg-[rgba(124,88,0,0.85)] px-2.5 py-1 rounded-full">
                                            {postCategory}
                                        </span>
                                    </div>

                                    {/* Seller profile link button on hover */}
                                    {sellerId && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/seller-profile?sellerId=${sellerId}`);
                                                }}
                                                className="font-hanken text-xs font-bold text-[#7C5800] uppercase bg-white hover:bg-[#F2EFE9] px-4 py-2.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                            >
                                                View Seller Profile
                                            </button>
                                            {post.seller?.businessDetails?.businessName && (
                                                <span className="text-white font-hanken text-xs font-semibold drop-shadow-md">
                                                    by {post.seller.businessDetails.businessName}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Footer ─────────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="w-full border-t border-[rgba(213,196,171,0.20)] bg-[#F5F3F3]">
            <div className="max-w-[1280px] mx-auto px-8 lg:px-16 py-14 flex flex-col items-center gap-8 text-center">
                {/* Brand */}
                <div className="flex flex-col items-center gap-3">
                    <p className="font-playfair text-2xl font-bold text-[#7C5800]">LuxeDiscovery</p>
                    <p className="font-hanken text-base text-[#5F5E5E] leading-relaxed max-w-[420px]">
                        Curating the finest moments in life, from intimate gatherings to grand celebrations.
                        Experience the extraordinary.
                    </p>
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-10">
                    {footerLinks.map((link) => (
                        <a
                            key={link}
                            href="#"
                            className="font-hanken text-sm font-semibold text-[#5F5E5E] tracking-wide hover:text-[#7C5800] transition-colors"
                        >
                            {link}
                        </a>
                    ))}
                </div>

                {/* Copyright */}
                <p className="font-hanken text-sm font-semibold text-[rgba(95,94,94,0.60)] tracking-wide">
                    © 2024 LuxeDiscovery. All rights reserved.
                </p>
            </div>
        </footer>
    );
}


export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5000/api/posts")
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching posts:", err);
                setLoading(false);
            });
    }, []);

    const filtered = posts.filter((post) => {
        const matchCat = activeCategory === "All" || post.category === activeCategory;
        const matchSearch =
            (post.title || "").toLowerCase().includes(search.toLowerCase()) ||
            (post.category || "").toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="pt-20">
            <div className="min-h-screen bg-[#FBF9F8]">
                <Navbar />
                <ImageSlider />
                <FilterBar
                    active={activeCategory}
                    setActive={setActiveCategory}
                    search={search}
                    setSearch={setSearch}
                />
                {loading ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <p className="font-hanken text-[#5F5E5E] text-base animate-pulse">Loading events...</p>
                    </div>
                ) : (
                    <MasonryGrid posts={filtered} navigate={navigate} />
                )}
                <Footer />
            </div>
        </div>
    );
}

