import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ─── Icons ────────────────────────────────────────────────────────────────────
const StarIcon = ({ filled }) => (
    <svg
        viewBox="0 0 20 20"
        className={`w-4 h-4 ${filled ? "text-amber-400" : "text-stone-300"}`}
        fill="currentColor"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.957z" />
    </svg>
);

const Stars = ({ rating, max = 5, interactive = false, onRate }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
            <button
                key={i}
                onClick={() => interactive && onRate && onRate(i + 1)}
                className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
                aria-label={interactive ? `Rate ${i + 1} star${i !== 0 ? "s" : ""}` : undefined}
            >
                <StarIcon filled={i < rating} />
            </button>
        ))}
    </div>
);

const ChevronIcon = ({ dir = "right" }) => (
    <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={dir === "right" ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
        />
    </svg>
);

const ShareIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);

const LikeIcon = ({ liked }) => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const testimonials = [
    {
        id: 1,
        rating: 5,
        quote:
            "The Sunset Soirée was beyond anything we imagined. The attention to detail and the atmosphere are truly world-class.",
        name: "Julian Thorne",
        title: "PRIVATE COLLECTOR",
    },
    {
        id: 2,
        rating: 5,
        quote:
            "A masterclass in exquisite hospitality. The Innovate Summit provided the perfect backdrop for our executive networking.",
        name: "Elena Rodriguez",
        title: "CEO, NOVA TECH",
    },
    {
        id: 3,
        rating: 5,
        quote:
            "The Gourmet Gala was a sensory awakening. Every detail conveyed a story of craftsmanship and luxury.",
        name: "Marcus Sterling",
        title: "LIFESTYLE JOURNALIST",
    },
    {
        id: 4,
        rating: 4,
        quote:
            "Flawless execution from start to finish. Our guests are still talking about the Crystal Gala two months later.",
        name: "Sophia Wren",
        title: "BRAND DIRECTOR",
    },
    {
        id: 5,
        rating: 5,
        quote:
            "LuxeDiscovery delivered an evening that felt genuinely once-in-a-lifetime. Worth every penny and beyond.",
        name: "Ravi Mehta",
        title: "ENTREPRENEUR",
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function PackageCard({ pkg }) {
    const img = pkg.image || pkg.img || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80";
    const tag = pkg.category || pkg.tag || "party";
    const desc = pkg.description || pkg.desc || "";
    return (
        <div className="group flex-shrink-0 w-56 rounded-xl overflow-hidden border border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="relative h-36 overflow-hidden">
                <img
                    src={img}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {pkg.badge && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-semibold tracking-widest px-2 py-0.5 rounded-full uppercase">
                        {pkg.badge}
                    </span>
                )}
            </div>
            <div className="p-3">
                <p className="text-[9px] tracking-[0.18em] text-amber-600 font-semibold uppercase mb-0.5">
                    {tag}
                </p>
                <h3 className="text-sm font-semibold text-stone-800 mb-1 leading-tight">{pkg.title}</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2">{desc}</p>
            </div>
        </div>
    );
}

function TestimonialCard({ t }) {
    return (
        <div className="bg-stone-50 border border-stone-100 rounded-xl p-5 flex flex-col gap-3">
            <Stars rating={t.rating} />
            <p className="text-sm text-stone-600 italic leading-relaxed">"{t.quote}"</p>
            <div>
                <p className="text-sm font-semibold text-stone-800">{t.name}</p>
                <p className="text-[10px] tracking-widest text-amber-600 uppercase">{t.title}</p>
            </div>
        </div>
    );
}

function EditorialCard({ post }) {
    const [liked, setLiked] = useState(false);
    const img = post.image?.url || post.image || post.img || "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80";
    return (
        <div className="relative overflow-hidden rounded-xl aspect-video bg-stone-100 group cursor-pointer">
            <img
                src={img}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <div className="flex items-end justify-between gap-2">
                    <p className="text-white text-xs font-semibold leading-snug drop-shadow">
                        {post.title}
                    </p>
                    <button
                        onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
                        className={`flex-shrink-0 p-1.5 rounded-full backdrop-blur-sm transition-colors duration-200 ${liked ? "text-red-400 bg-white/20" : "text-white/80 bg-white/10 hover:text-red-400 hover:bg-white/20"}`}
                        aria-label="Like post"
                    >
                        <LikeIcon liked={liked} />
                    </button>
                </div>
            </div>
        </div>
    );
}

const MOCK_SELLERS = {
    "mock-1": {
        username: "Ceylon Moments Studio",
        email: "ceylonmoments@example.com",
        businessDetails: {
            businessName: "Ceylon Moments Studio",
            businessAddress: "Colombo 07, Sri Lanka",
            phone: "+94 77 128 3456",
            category: "Photography",
            city: "Colombo",
            description: "Capturing the essence of your premium moments. Ceylon Moments Studio specializes in luxury wedding cinematography and high-end portrait photography."
        }
    },
    "mock-2": {
        username: "Grand Heritage Garden",
        email: "heritagegarden@example.com",
        businessDetails: {
            businessName: "Grand Heritage Garden",
            businessAddress: "Mount Lavinia",
            phone: "+94 11 244 5678",
            category: "Hotel / Venue",
            city: "Mount Lavinia",
            description: "A breathtaking outdoor garden venue overlooking the ocean, perfect for elegant celebrations, corporate receptions, and unforgettable gatherings."
        }
    },
    "mock-3": {
        username: "Spices of Lanka Fusion",
        email: "spicesoflanka@example.com",
        businessDetails: {
            businessName: "Spices of Lanka Fusion",
            businessAddress: "Dehiwala",
            phone: "+94 11 555 6262",
            category: "Catering",
            city: "Dehiwala",
            description: "Offering premium fusion catering services that combine traditional Sri Lankan spices with contemporary international cuisine."
        }
    },
    "mock-4": {
        username: "Silver Lens Media",
        email: "silverlens@example.com",
        businessDetails: {
            businessName: "Silver Lens Media",
            businessAddress: "Battaramulla",
            phone: "+94 77 345 6789",
            category: "Photography",
            city: "Battaramulla",
            description: "Cinematic photography and videography for events, weddings, and commercials. Bringing a storytelling aspect to every frame we capture."
        }
    },
    "mock-5": {
        username: "Sonic Beats DJ Services",
        email: "sonicbeats@example.com",
        businessDetails: {
            businessName: "Sonic Beats DJ Services",
            businessAddress: "Negombo",
            phone: "+94 31 777 8888",
            category: "Music",
            city: "Negombo",
            description: "State-of-the-art sound systems and premium DJ services to keep your dance floor packed all night. Catering to weddings and corporate parties."
        }
    },
    "mock-6": {
        username: "Island Bloom Florals",
        email: "islandbloom@example.com",
        businessDetails: {
            businessName: "Island Bloom Florals",
            businessAddress: "Kandy",
            phone: "+94 81 222 3333",
            category: "Decoration",
            city: "Kandy",
            description: "Bespoke floral arrangements and luxury venue decorations. Transforming event spaces into absolute botanical wonderlands."
        }
    },
    "mock-7": {
        username: "Glow by Sarah",
        email: "glowbysarah@example.com",
        businessDetails: {
            businessName: "Glow by Sarah",
            businessAddress: "Colombo 03",
            phone: "+94 77 112 3456",
            category: "Salon",
            city: "Colombo",
            description: "Bridal make-up and premium beauty services designed to make you look and feel extraordinary on your most memorable days."
        }
    },
    "mock-8": {
        username: "Rhythm Beats Entertainment",
        email: "rhythmbeats@example.com",
        businessDetails: {
            businessName: "Rhythm Beats Entertainment",
            businessAddress: "Wattala",
            phone: "+94 77 999 1111",
            category: "Music",
            city: "Wattala",
            description: "High-energy live music bands and entertainment planning to light up any corporate summit or wedding celebration."
        }
    }
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SellerProfilePage() {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sellerIdParam = searchParams.get("sellerId");
    const sellerId = sellerIdParam || user?._id || user?.id;

    const [sellerInfo, setSellerInfo] = useState(null);
    const [sellerPackages, setSellerPackages] = useState([]);
    const [sellerPosts, setSellerPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [pkgIndex, setPkgIndex] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [review, setReview] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [showReviews, setShowReviews] = useState(true);

    const maxScroll = Math.max(0, sellerPackages.length - 3);

    useEffect(() => {
        if (!sellerId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        if (typeof sellerId === "string" && sellerId.startsWith("mock-")) {
            const mockSeller = MOCK_SELLERS[sellerId] || {
                username: "Artisan Gala Events",
                email: "artisan@example.com",
                businessDetails: {
                    businessName: "Artisan Gala Events",
                    businessAddress: "Battaramulla, Sri Lanka",
                    phone: "+94 77 999 8888",
                    category: "Event Planner",
                    city: "Battaramulla",
                    description: "Premium event planner specializing in high-end corporate retreats and luxury weddings."
                }
            };
            setSellerInfo(mockSeller);
            setSellerPackages([]);
            setSellerPosts([]);
            setLoading(false);
            return;
        }

        const fetchInfo = fetch(`http://localhost:5000/api/auth/users/${sellerId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Could not fetch seller details.");
                return res.json();
            });

        const fetchPkgs = fetch(`http://localhost:5000/api/packages?seller=${sellerId}`)
            .then((res) => res.json())
            .then((data) => data.data || []);

        const fetchPosts = fetch(`http://localhost:5000/api/posts?seller=${sellerId}`)
            .then((res) => res.json())
            .then((data) => data.data || []);

        Promise.all([fetchInfo, fetchPkgs, fetchPosts])
            .then(([info, pkgs, posts]) => {
                setSellerInfo(info);
                setSellerPackages(pkgs);
                setSellerPosts(posts);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading seller profile:", err);
                setError(err.message || "Failed to load seller profile.");
                setLoading(false);
            });
    }, [sellerId]);

    const handleSubmit = () => {
        if (userRating === 0) return;
        setSubmitted(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 font-sans pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                <p className="text-stone-500 text-sm mt-4 animate-pulse">Loading seller profile...</p>
            </div>
        );
    }

    if (error || !sellerInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 font-sans px-6 text-center pt-20">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-lg font-bold text-stone-900">Seller Profile Not Found</h2>
                <p className="text-stone-500 text-sm mt-1 max-w-md">
                    {error || "The requested seller profile could not be loaded."}
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-6 bg-stone-800 text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-stone-700 transition"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const businessName = sellerInfo?.businessDetails?.businessName || sellerInfo?.username || "Artisan Gala Events";

    return (
        <div className="min-h-screen bg-white font-sans text-stone-800 pt-20">
            {/* ── Hero ── */}
            <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                    src={sellerInfo?.businessDetails?.coverImage || "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1400&q=80"}
                    alt={`${businessName} cover`}
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>

            {/* ── Profile Bar ── */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="relative flex flex-col items-center pb-5 border-b border-stone-100">
                    {/* Avatar */}
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden flex-shrink-0 bg-stone-100 flex items-center justify-center text-4xl font-bold text-stone-600 -mt-14 z-10">
                        {sellerInfo?.businessDetails?.profileImage || sellerInfo?.businessDetails?.taxFile ? (
                            <img
                                src={sellerInfo.businessDetails.profileImage || sellerInfo.businessDetails.taxFile}
                                alt={businessName}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                        ) : null}
                        <span style={{ display: (sellerInfo?.businessDetails?.profileImage || sellerInfo?.businessDetails?.taxFile) ? 'none' : 'block' }}>
                            {businessName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    {/* Share button top-right */}
                    <button className="absolute right-0 top-4 flex items-center gap-1.5 text-xs text-stone-600 border border-stone-200 px-3 py-1.5 rounded-full hover:border-amber-400 hover:text-amber-600 transition-colors">
                        <ShareIcon />
                        Share
                    </button>
                    {/* Name & stats */}
                    <div className="mt-3 text-center">
                        <h1 className="text-xl font-bold text-stone-900 leading-tight">
                            {businessName}
                        </h1>
                        <p className="text-xs text-stone-500 mt-1">
                            {sellerInfo?.businessDetails?.businessAddress || "London, UK"}
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-2.5 text-xs text-stone-500">
                            {sellerInfo?.email && (
                                <span><strong>Email:</strong> {sellerInfo.email}</span>
                            )}
                            {sellerInfo?.businessDetails?.phone && (
                                <span><strong>Phone:</strong> {sellerInfo.businessDetails.phone}</span>
                            )}
                            <span className="flex items-center gap-1">
                                <StarIcon filled />
                                <strong className="text-stone-700">4.9</strong>
                                <span className="text-stone-400">(133 reviews)</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Curated Event Packages ── */}
            <section className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-semibold text-stone-800 tracking-tight">
                        Curated Event Packages
                    </h2>
                    {sellerPackages.length > 3 && (
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPkgIndex((p) => Math.max(0, p - 1))}
                                disabled={pkgIndex === 0}
                                className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 transition-colors"
                            >
                                <ChevronIcon dir="left" />
                            </button>
                            <button
                                onClick={() => setPkgIndex((p) => Math.min(maxScroll, p + 1))}
                                disabled={pkgIndex >= maxScroll}
                                className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 transition-colors"
                            >
                                <ChevronIcon dir="right" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden">
                    {sellerPackages.length === 0 ? (
                        <div className="w-full text-center py-10 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                            <p className="text-stone-500 text-sm">No curated packages listed by this seller yet.</p>
                        </div>
                    ) : (
                        <div
                            className="flex gap-4 transition-transform duration-400 ease-in-out"
                            style={{ transform: `translateX(calc(-${pkgIndex * (224 + 16)}px))` }}
                        >
                            {sellerPackages.map((pkg) => (
                                <PackageCard key={pkg._id || pkg.id} pkg={pkg} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Client Experiences ── */}
            <section className="max-w-4xl mx-auto px-4 py-8 border-t border-stone-100">
                <h2 className="text-base font-semibold text-stone-800 mb-1">Client Experiences</h2>
                <p className="text-xs text-stone-400 mb-6">
                    What our distinguished guests have to say about their curated journeys.
                </p>

                {/* First 3 always visible */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {testimonials.slice(0, 3).map((t) => (
                        <TestimonialCard key={t.id} t={t} />
                    ))}
                </div>

                {/* Reviews 4 & 5 — slide open when showReviews is true */}
                <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden transition-all duration-500 ease-in-out ${showReviews ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
                        }`}
                >
                    {testimonials.slice(3).map((t) => (
                        <TestimonialCard key={t.id} t={t} />
                    ))}
                </div>

                {/* Chevron toggle */}
                <div className="flex justify-center mt-5">
                    <button
                        onClick={() => setShowReviews((v) => !v)}
                        className="flex flex-col items-center gap-1 text-stone-400 hover:text-amber-500 transition-colors"
                        aria-label={showReviews ? "Show fewer reviews" : "Show all reviews"}
                    >
                        <span className="text-[11px] tracking-widest uppercase">
                            {showReviews ? "Show Less" : "Show All 5 Reviews"}
                        </span>
                        <svg
                            viewBox="0 0 24 24"
                            className={`w-5 h-5 transition-transform duration-300 ${showReviews ? "rotate-180" : "rotate-0"}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                </div>
            </section>

            {/* ── Editorial Updates ── */}
            <section className="max-w-4xl mx-auto px-4 py-8 border-t border-stone-100">
                <h2 className="text-base font-semibold text-stone-800 mb-5">Editorial Updates</h2>
                {sellerPosts.length === 0 ? (
                    <div className="w-full text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                        <p className="text-stone-500 text-sm">No editorial updates published by this seller yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {sellerPosts.map((post) => (
                            <EditorialCard key={post._id || post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Share Your Experience ── */}
            <section className="max-w-4xl mx-auto px-4 py-8 border-t border-stone-100">
                <div className="max-w-md mx-auto text-center">
                    <h2 className="text-base font-semibold text-stone-800 mb-1">Share Your Experience</h2>
                    <p className="text-xs text-stone-400 mb-6">
                        Your feedback helps us refine our world-class offerings.
                    </p>

                    {submitted ? (
                        <div className="py-10 text-center">
                            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-stone-700">Thank you for your review!</p>
                            <p className="text-xs text-stone-400 mt-1">Your experience means everything to us.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 text-left">
                            {/* Star Rating */}
                            <div className="text-center">
                                <p className="text-[11px] tracking-widest uppercase text-stone-400 mb-2">Your Rating</p>
                                <div className="flex justify-center">
                                    <Stars rating={userRating} interactive onRate={setUserRating} max={5} />
                                </div>
                            </div>

                            {/* Review Text */}
                            <div>
                                <label className="block text-[11px] tracking-widest uppercase text-stone-400 mb-2">
                                    Review Details
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about your journey..."
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleSubmit}
                                    disabled={userRating === 0}
                                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-medium px-8 py-2.5 rounded-full transition-colors duration-200"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-stone-100 bg-stone-50 mt-4">
                <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between gap-6">
                    <div>
                        <p className="text-sm font-bold tracking-widest text-stone-800 mb-1">LuxeDiscovery</p>
                        <p className="text-xs text-stone-400">Curating the world's most exclusive experiences.</p>
                    </div>
                    <div>
                        <p className="text-[10px] tracking-widest uppercase text-stone-400 font-semibold mb-2">Explore</p>
                        <ul className="space-y-1 text-xs text-stone-500">
                            <li><a href="#" className="hover:text-amber-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-amber-600 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-[10px] tracking-widest uppercase text-stone-400 font-semibold mb-2">Contact</p>
                        <p className="text-xs text-stone-500">114 Luxury Way</p>
                        <p className="text-xs text-stone-500">Manhattan, NY 10001</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}