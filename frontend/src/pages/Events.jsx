import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = ["Home", "Events", "Contact Us"];

const EVENTS = [
    {
        id: 1,
        image: "/CeylonMomentsStudio.png",
        category: "Photography",
        categoryLabel: "PHOTOGRAPHER",
        title: "Ceylon Moments Studio",
        location: "Colombo 07, Sri Lanka",
        rating: 4.9,
        reviews: 128,
        priceLabel: "STARTING FROM",
        price: "LKR 45,000",
        cta: "View Portfolio",
        popular: false,
    },
    {
        id: 2,
        image: "/GrandHeritageGarden.png",
        category: "Hotel / Venue",
        categoryLabel: "VENUE",
        title: "Grand Heritage Garden",
        location: "Mount Lavinia",
        rating: 4.8,
        reviews: 244,
        priceLabel: "STARTING FROM",
        price: "LKR 120,000",
        cta: "View Venue",
        popular: true,
    },
    {
        id: 3,
        image: "/SpicesOfLanka.png",
        category: "Catering",
        categoryLabel: "CATERING",
        title: "Spices of Lanka Fusion",
        location: "Dehiwala",
        rating: 5.0,
        reviews: 62,
        priceLabel: "PER PLATE",
        price: "LKR 2,800",
        cta: "See Menu",
        popular: false,
    },
    {
        id: 4,
        image: "/SilverLensMedia.png",
        category: "Photography",
        categoryLabel: "PHOTOGRAPHER",
        title: "Silver Lens Media",
        location: "Battaramulla",
        rating: 4.7,
        reviews: 56,
        priceLabel: "STARTING FROM",
        price: "LKR 35,000",
        cta: "View Portfolio",
        popular: false,
    },
    {
        id: 5,
        image: "/SonicBeatsDJ.png",
        category: "Music",
        categoryLabel: "MUSIC & SOUND",
        title: "Sonic Beats DJ Services",
        location: "Negombo",
        rating: 4.6,
        reviews: 34,
        priceLabel: "STARTING FROM",
        price: "LKR 25,000",
        cta: "Book Now",
        popular: false,
    },
    {
        id: 6,
        image: "/IslandBloomFlorals.png",
        category: "Decoration",
        categoryLabel: "DECOR",
        title: "Island Bloom Florals",
        location: "Kandy",
        rating: 4.9,
        reviews: 81,
        priceLabel: "STARTING FROM",
        price: "LKR 60,000",
        cta: "View Designs",
        popular: false,
    },
    {
        id: 7,
        image: "/GlowBySarah.png",
        category: "Salon",
        categoryLabel: "BEAUTY",
        title: "Glow by Sarah",
        location: "Colombo 03",
        rating: 4.8,
        reviews: 112,
        priceLabel: "BRIDAL PACKAGE",
        price: "LKR 55,000",
        cta: "Inquire Now",
        popular: false,
    },
    {
        id: 8,
        image: "/RhythmBeats.png",
        category: "Music",
        categoryLabel: "ENTERTAINMENT",
        title: "Rhythm Beats Entertainment",
        location: "Wattala",
        rating: 4.5,
        reviews: 29,
        priceLabel: "STARTING FROM",
        price: "LKR 30,000",
        cta: "Book Now",
        popular: false,
    },
];

const CITIES = [
    "All Cities", "Colombo", "Kandy", "Galle", "Negombo",
    "Jaffna", "Trincomalee", "Anuradhapura", "Polonnaruwa", "Matara", "Kurunegala",
];

const CATEGORIES = [
    "All Categories", "Decoration", "Photography", "Music", "Hotel / Venue",
    "Catering", "Jewelry", "Salon", "Dress Designer", "Cake Designer", "Event Planner",
];

const PRICES = ["Any Price", "$", "$$", "$$$", "$$$$"];
const SORTS = ["Most Recent", "Price: Low to High", "Price: High to Low", "Alphabetical"];

/* ── Icons ───────────────────────────────────────── */
function StarIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#FFB800" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0.5L7.545 4.045L11.427 4.427L8.6 6.955L9.427 10.773L6 8.75L2.573 10.773L3.4 6.955L0.573 4.427L4.455 4.045L6 0.5Z" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 0C2.79 0 1 1.79 1 4C1 7 5 13 5 13C5 13 9 7 9 4C9 1.79 7.21 0 5 0ZM5 5.5C4.17 5.5 3.5 4.83 3.5 4C3.5 3.17 4.17 2.5 5 2.5C5.83 2.5 6.5 3.17 6.5 4C6.5 4.83 5.83 5.5 5 5.5Z" fill="#B8955A" />
        </svg>
    );
}

function ChevronDown() {
    return (
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="#8C7B60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ── EventCard ───────────────────────────────────── */
function EventCard({ event }) {
    const [wishlist, setWishlist] = useState(false);
    const navigate = useNavigate();

    const handleViewProfile = () => {
        if (event.isDynamic) {
            navigate(`/seller-profile?sellerId=${event.id}`);
        } else {
            navigate(`/seller-profile?sellerId=mock-${event.id}`);
        }
    };

    return (
        <div
            onClick={handleViewProfile}
            className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)] transition-all duration-300 cursor-pointer group border border-[#F0EDE8]"
        >

            {/* Image */}
            <div className="relative h-[180px] overflow-hidden bg-[#F5F3F0]">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Popular badge */}
                {event.popular && (
                    <span className="absolute top-3 left-3 bg-[#FFB800] text-[#3D2900] text-[9px] font-extrabold tracking-[0.1em] uppercase px-2.5 py-1 rounded-md shadow-sm">
                        POPULAR
                    </span>
                )}

                {/* Wishlist heart */}
                <button
                    onClick={(e) => { e.stopPropagation(); setWishlist(!wishlist); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                    <svg width="14" height="13" viewBox="0 0 14 13" fill={wishlist ? "#E8365D" : "none"} xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 12C7 12 1 8.2 1 4C1 2.34 2.34 1 4 1C5.08 1 6.04 1.58 6.6 2.46L7 3.06L7.4 2.46C7.96 1.58 8.92 1 10 1C11.66 1 13 2.34 13 4C13 8.2 7 12 7 12Z"
                            stroke={wishlist ? "#E8365D" : "#9CA3AF"} strokeWidth="1.3" />
                    </svg>
                </button>
            </div>

            {/* Body */}
            <div className="p-4">

                {/* Category + Rating row */}
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#B8955A] text-[9.5px] font-extrabold tracking-[0.12em] uppercase">
                        {event.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1">
                        <StarIcon />
                        <span className="text-[12px] font-bold text-[#1B1C1C] leading-none">{event.rating.toFixed(1)}</span>
                        <span className="text-[11px] text-[#9CA3AF] leading-none">({event.reviews})</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-[15px] font-bold text-[#1B1C1C] leading-snug mb-2 font-serif group-hover:text-[#7C5800] transition-colors line-clamp-1">
                    {event.title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 mb-3">
                    <PinIcon />
                    <span className="text-[12px] text-[#6B7280]">{event.location}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-[#F0EDE8] mb-3" />

                {/* Price Row */}
                {event.price && (
                    <div className="flex items-center justify-between mb-3 font-sans">
                        <span className="text-[10px] text-[#8C7B60] font-extrabold tracking-[0.05em] uppercase">
                            {event.priceLabel || "STARTING FROM"}
                        </span>
                        <span className="text-[13px] font-bold text-[#1B1C1C]">
                            {event.price}
                        </span>
                    </div>
                )}

                {/* CTA */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleViewProfile(); }}
                    className="w-full bg-[#FFB800] hover:bg-[#e6a600] active:bg-[#cc9200] text-[#3D2900] text-[12px] font-bold py-2.5 rounded-lg transition-colors duration-150 shadow-sm"
                >
                    View Profile
                </button>

            </div>
        </div>
    );
}

/* ── FilterSelect ────────────────────────────────── */
function FilterSelect({ label, options, value, onChange, icon }) {
    return (
        <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
            <label className="text-[10px] font-bold tracking-[0.12em] text-[#8C7B60] uppercase font-sans">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#E8E0D5] rounded-lg px-4 py-3 pr-9
                     text-[14px] text-[#1B1C1C] font-sans cursor-pointer
                     focus:outline-none focus:border-[#B8955A] focus:ring-2 focus:ring-[#FFB800]/20
                     hover:border-[#B8955A] transition-colors duration-150"
                >
                    {options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                    ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    {icon || <ChevronDown />}
                </span>
            </div>
        </div>
    );
}

/* ── Page ────────────────────────────────────────── */
export default function EventsPage() {
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("All Cities");
    const [category, setCategory] = useState("All Categories");
    const [price, setPrice] = useState("Any Price");
    const [sort, setSort] = useState("Most Recent");
    const [activeNav, setActiveNav] = useState("Events");
    const [dynamicSellers, setDynamicSellers] = useState([]);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/sellers");
                if (res.ok) {
                    const data = await res.json();
                    setDynamicSellers(data);
                }
            } catch (err) {
                console.error("Error fetching sellers:", err);
            }
        };
        fetchSellers();
    }, []);

    const mappedSellers = dynamicSellers.map((seller) => {
        const cat = seller.businessDetails?.category || "Photography";

        let categoryLabel = "PHOTOGRAPHER";
        if (cat) {
            const catUpper = cat.toUpperCase();
            if (catUpper.includes("PHOTOGRAPHY")) categoryLabel = "PHOTOGRAPHER";
            else if (catUpper.includes("VENUE")) categoryLabel = "VENUE";
            else if (catUpper.includes("CATERING")) categoryLabel = "CATERING";
            else if (catUpper.includes("DECOR")) categoryLabel = "DECOR";
            else if (catUpper.includes("SALON") || catUpper.includes("BEAUTY")) categoryLabel = "BEAUTY";
            else if (catUpper.includes("MUSIC") || catUpper.includes("DJ") || catUpper.includes("SOUND")) categoryLabel = "MUSIC & SOUND";
            else if (catUpper.includes("JEWELRY")) categoryLabel = "JEWELRY";
            else if (catUpper.includes("DRESS") || catUpper.includes("DESIGNER")) categoryLabel = "DESIGNER";
            else if (catUpper.includes("CAKE")) categoryLabel = "CAKE";
            else if (catUpper.includes("PLANNER")) categoryLabel = "PLANNER";
            else categoryLabel = catUpper;
        }

        return {
            id: seller._id || seller.id,
            isDynamic: true,
            image: seller.businessDetails?.profileImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
            category: cat,
            categoryLabel: categoryLabel,
            title: seller.businessDetails?.businessName || seller.username || "Luxury Event Service",
            location: seller.businessDetails?.city || "Battaramulla",
            rating: 4.7,
            reviews: 56,
            priceLabel: "STARTING FROM",
            price: "LKR 35,000",
            cta: "View Profile",
            popular: false,
        };
    });

    const combinedEvents = [...mappedSellers, ...EVENTS];

    const filteredEvents = combinedEvents.filter((event) => {
        if (search) {
            const query = search.toLowerCase();
            const matchesTitle = event.title.toLowerCase().includes(query);
            const matchesCategory = event.category.toLowerCase().includes(query);
            const matchesLocation = event.location.toLowerCase().includes(query);
            if (!matchesTitle && !matchesCategory && !matchesLocation) return false;
        }
        if (city !== "All Cities") {
            const matchesCity = event.location.toLowerCase().includes(city.toLowerCase());
            if (!matchesCity) return false;
        }
        if (category !== "All Categories") {
            const matchesCategory = event.category.toLowerCase() === category.toLowerCase();
            if (!matchesCategory) return false;
        }
        return true;
    });

    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (sort === "Alphabetical") {
            return a.title.localeCompare(b.title);
        }
        if (sort === "Price: Low to High") {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
            const priceB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
            return priceA - priceB;
        }
        if (sort === "Price: High to Low") {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
            const priceB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
            return priceB - priceA;
        }
        return 0;
    });

    const activeTags = [
        city !== "All Cities" && city,
        category !== "All Categories" && category,
        price !== "Any Price" && price,
        search && `"${search}"`,
    ].filter(Boolean);

    const clearAll = () => {
        setCity("All Cities");
        setCategory("All Categories");
        setPrice("Any Price");
        setSearch("");
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] font-sans">

            {/* ── NAVBAR ──────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#E8E0D5]/60">
                <div className="max-w-[1280px] mx-auto px-10 h-16 flex items-center justify-between">
                    <button className="text-[22px] font-bold tracking-tight text-[#1B1C1C] font-serif hover:text-[#7C5800] transition-colors">
                        LuxeDiscovery
                    </button>
                    <div className="flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link}
                                onClick={() => setActiveNav(link)}
                                className={`text-[14px] font-medium tracking-wide transition-colors duration-150 pb-0.5 ${activeNav === link
                                    ? "text-[#7C5800] border-b-2 border-[#7C5800]"
                                    : "text-[#5F5E5E] hover:text-[#1B1C1C]"
                                    }`}
                            >
                                {link}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#E8E0D5] bg-white hover:border-[#B8955A] transition-colors cursor-pointer">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E8E0D5] bg-[#F0EDE8]">
                            <img src="/UserProfile.png" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[14px] font-medium text-[#1B1C1C]">Alex Rivera</span>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path d="M1 1L5 5L9 1" stroke="#5F5E5E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </nav>

            {/* ── SEARCH BAR ──────────────────────────── */}
            <div className="pt-28 pb-3 px-10 max-w-[1280px] mx-auto">
                <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="#8C7B60" strokeWidth="1.6" />
                            <path d="M13 13L16.5 16.5" stroke="#8C7B60" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search venues, photographers, decorators..."
                        className="w-full bg-white border border-[#E8E0D5] rounded-xl pl-12 pr-12 py-4
                       text-[15px] text-[#1B1C1C] placeholder-[#B0A898]
                       focus:outline-none focus:border-[#B8955A] focus:ring-2 focus:ring-[#FFB800]/20
                       hover:border-[#B8955A] transition-all duration-200 shadow-sm"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#E8E0D5] hover:bg-[#D5C9BA] flex items-center justify-center transition-colors"
                        >
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1 1L7 7M7 1L1 7" stroke="#5F5E5E" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* ── FILTER BAR ──────────────────────────── */}
            <div className="pb-6 px-10 max-w-[1280px] mx-auto">
                <div className="bg-white border border-[#E8E0D5] rounded-2xl px-6 py-5 shadow-sm">
                    <div className="flex items-end gap-4 flex-wrap">
                        <FilterSelect label="City" options={CITIES} value={city} onChange={setCity} />
                        <FilterSelect label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
                        <FilterSelect label="Price Range" options={PRICES} value={price} onChange={setPrice} />
                        <FilterSelect
                            label="Sort By"
                            options={SORTS}
                            value={sort}
                            onChange={setSort}
                            icon={
                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                    <path d="M0 9h14M0 5h10M0 1h6" stroke="#8C7B60" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            }
                        />
                        <button className="flex items-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] text-[#3D2900] text-[13px] font-bold tracking-[0.06em] uppercase px-6 py-3 rounded-lg transition-colors duration-150 whitespace-nowrap shadow-sm">
                            <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                                <path d="M0 10h16M2 5.5h12M4 1h8" stroke="#3D2900" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* ── RESULTS BAR ─────────────────────────── */}
            <div className="max-w-[1280px] mx-auto px-10 mb-6 flex items-center justify-between flex-wrap gap-3">
                <p className="text-[14px] text-[#5F5E5E]">
                    Showing <span className="text-[#1B1C1C] font-semibold">{sortedEvents.length}</span> exclusive experiences
                </p>
                {activeTags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {activeTags.map((tag) => (
                            <span key={tag} className="bg-[#FFF3D6] text-[#7C5800] text-[12px] font-semibold px-3 py-1 rounded-full border border-[#FFD98A]/60">
                                {tag} ×
                            </span>
                        ))}
                        <button onClick={clearAll} className="bg-[#F0EDE8] text-[#5F5E5E] text-[12px] font-semibold px-3 py-1 rounded-full hover:bg-[#E8E0D5] transition-colors">
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {/* ── CARD GRID ───────────────────────────── */}
            <div className="max-w-[1280px] mx-auto px-10 pb-20">
                <div className="grid grid-cols-4 gap-5">
                    {sortedEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>

            {/* ── FOOTER ──────────────────────────────── */}
            <footer className="border-t border-[#E8E0D5] bg-[#F2EFE9]">
                <div className="max-w-[1280px] mx-auto px-16 py-10 flex items-end justify-between gap-8">
                    <div className="flex flex-col gap-3 max-w-sm">
                        <p className="text-[20px] font-bold text-[#7C5800] font-serif">LuxeDiscovery</p>
                        <p className="text-[14px] text-[#7A7875] leading-relaxed">
                            Curating the finest moments in life, from intimate gatherings to grand celebrations. Experience the extraordinary.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex gap-8">
                            {["Privacy Policy", "Terms of Service", "FAQ", "About Us"].map((link) => (
                                <button key={link} className="text-[13px] font-medium text-[#5F5E5E] hover:text-[#7C5800] transition-colors tracking-wide">
                                    {link}
                                </button>
                            ))}
                        </div>
                        <p className="text-[12px] text-[#A09D9A] tracking-wide">© 2024 LuxeDiscovery. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}