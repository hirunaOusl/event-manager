import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GlobalNavBar() {
    const { user, logout } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        const clickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", clickOutside);
        return () => { window.removeEventListener("scroll", handleScroll); document.removeEventListener("mousedown", clickOutside); };
    }, []);

    const forceDarkText = location.pathname === "/profile" || location.pathname === "/seller-dashboard";

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${scrolled || forceDarkText ? "bg-white shadow-sm border-b border-gray-100" : "bg-transparent"
            }`}>
            <Link to="/" className={`text-xl md:text-2xl font-bold tracking-wide transition-colors ${scrolled || forceDarkText ? "text-[#7C5800]" : "text-black"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                LuxeDiscovery
            </Link>

            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer outline-none">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${scrolled || forceDarkText ? "bg-[#E8E1D9] text-[#7C5800]" : "bg-white/20 text-black"}`}>
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className={`hidden md:block text-sm font-semibold ${scrolled || forceDarkText ? "text-[#1B1C1C]" : "text-black"}`}>{user?.username}</span>
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 top-[calc(100%+12px)] w-64 rounded-2xl overflow-hidden shadow-xl z-50 p-2" style={{ background: "#4A4A4A" }}>
                        <button onClick={() => { setDropdownOpen(false); navigate("/"); }} className="w-full text-left px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10 rounded-xl">🏠 Home Layout</button>
                        <button onClick={() => { setDropdownOpen(false); navigate("/profile"); }} className="w-full text-left px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10 rounded-xl">👤 User Profile</button>
                        {user?.role === "seller" && (
                            <button onClick={() => { setDropdownOpen(false); navigate("/seller-dashboard"); }} className="w-full text-left px-4 py-3 text-sm font-medium text-purple-300 hover:bg-white/10 rounded-xl">💼 Business Dashboard</button>
                        )}
                        <div className="h-px bg-white/10 my-1 mx-2" />
                        <button onClick={() => { logout(); navigate("/login"); }} className="w-full text-left px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/15 rounded-xl">↩ Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
}