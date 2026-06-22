import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CuratedPackages from "./CuratedPackages";
import EditorialUpdates from "./EditorialUpdates";
import BusinessSetting from "./BusinessSetting";
import SellerSidebar from "../components/SellerSidebar";

const ShareIcon = () => (
  <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
    <path d="M12.5 16.6667C11.8056 16.6667 11.2153 16.4236 10.7292 15.9375C10.2431 15.4514 10 14.8611 10 14.1667C10 14.0833 10.0208 13.8889 10.0625 13.5833L4.20833 10.1667C3.98611 10.375 3.72917 10.5382 3.4375 10.6562C3.14583 10.7743 2.83333 10.8333 2.5 10.8333C1.80556 10.8333 1.21528 10.5903 0.729167 10.1042C0.243056 9.61806 0 9.02778 0 8.33333C0 7.63889 0.243056 7.04861 0.729167 6.5625C1.21528 6.07639 1.80556 5.83333 2.5 5.83333C2.83333 5.83333 3.14583 5.89236 3.4375 6.01042C3.72917 6.12847 3.98611 6.29167 4.20833 6.5L10.0625 3.08333C10.0347 2.98611 10.0174 2.89236 10.0104 2.80208C10.0035 2.71181 10 2.61111 10 2.5C10 1.80556 10.2431 1.21528 10.7292 0.729167C11.2153 0.243056 11.8056 0 12.5 0C13.1944 0 13.7847 0.243056 14.2708 0.729167C14.7569 1.21528 15 1.80556 15 2.5C15 3.19444 14.7569 3.78472 14.2708 4.27083C13.7847 4.75694 13.1944 5 12.5 5C12.1667 5 11.8542 4.94097 11.5625 4.82292C11.2708 4.70486 11.0139 4.54167 10.7917 4.33333L4.9375 7.75C4.96528 7.84722 4.98264 7.94097 4.98958 8.03125C4.99653 8.12153 5 8.22222 5 8.33333C5 8.44444 4.99653 8.54514 4.98958 8.63542C4.98264 8.72569 4.96528 8.81944 4.9375 8.91667L10.7917 12.3333C11.0139 12.125 11.2708 11.9618 11.5625 11.8438C11.8542 11.7257 12.1667 11.6667 12.5 11.6667C13.1944 11.6667 13.7847 11.9097 14.2708 12.3958C14.7569 12.8819 15 13.4722 15 14.1667C15 14.8611 14.7569 15.4514 14.2708 15.9375C13.7847 16.4236 13.1944 16.6667 12.5 16.6667Z" fill="#1B1C1C" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none">
    <path d="M1.05 9L0 7.95L5.55 2.3625L8.55 5.3625L12.45 1.5H10.5V0H15V4.5H13.5V2.55L8.55 7.5L5.55 4.5L1.05 9Z" fill="#7C5800" />
  </svg>
);

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

const PlusCircle = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M18 30H22V22H30V18H22V10H18V18H10V22H18V30ZM20 40C17.2333 40 14.6333 39.475 12.2 38.425C9.76667 37.375 7.65 35.95 5.85 34.15C4.05 32.35 2.625 30.2333 1.575 27.8C0.525 25.3667 0 22.7667 0 20C0 17.2333 0.525 14.6333 1.575 12.2C2.625 9.76667 4.05 7.65 5.85 5.85C7.65 4.05 9.76667 2.625 12.2 1.575C14.6333 0.525 17.2333 0 20 0C22.7667 0 25.3667 0.525 27.8 1.575C30.2333 2.625 32.35 4.05 34.15 5.85C35.95 7.65 37.375 9.76667 38.425 12.2C39.475 14.6333 40 17.2333 40 20C40 22.7667 39.475 25.3667 38.425 27.8C37.375 30.2333 35.95 32.35 34.15 34.15C32.35 35.95 30.2333 37.375 27.8 38.425C25.3667 39.475 22.7667 40 20 40ZM20 36C24.4667 36 28.25 34.45 31.35 31.35C34.45 28.25 36 24.4667 36 20C36 15.5333 34.45 11.75 31.35 8.65C28.25 5.55 24.4667 4 20 4C15.5333 4 11.75 5.55 8.65 8.65C5.55 11.75 4 15.5333 4 20C4 24.4667 5.55 28.25 8.65 31.35C11.75 34.45 15.5333 36 20 36Z" fill="#837560" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 23 15" fill="none">
    <path d="M13.8333 15L8.58333 9.75C8.16667 10.0833 7.6875 10.3472 7.14583 10.5417C6.60417 10.7361 6.02778 10.8333 5.41667 10.8333C3.90278 10.8333 2.62153 10.309 1.57292 9.26042C0.524305 8.21181 0 6.93056 0 5.41667C0 3.90278 0.524305 2.62153 1.57292 1.57292C2.62153 0.524305 3.90278 0 5.41667 0C6.93056 0 8.21181 0.524305 9.26042 1.57292C10.309 2.62153 10.8333 3.90278 10.8333 5.41667C10.8333 6.02778 10.7361 6.60417 10.5417 7.14583C10.3472 7.6875 10.0833 8.16667 9.75 8.58333L15 13.8333L13.8333 15ZM5.41667 9.16667C6.45833 9.16667 7.34375 8.80208 8.07292 8.07292C8.80208 7.34375 9.16667 6.45833 9.16667 5.41667C9.16667 4.375 8.80208 3.48958 8.07292 2.76042C7.34375 2.03125 6.45833 1.66667 5.41667 1.66667C4.375 1.66667 3.48958 2.03125 2.76042 2.76042C2.03125 3.48958 1.66667 4.375 1.66667 5.41667C1.66667 6.45833 2.03125 7.34375 2.76042 8.07292C3.48958 8.80208 4.375 9.16667 5.41667 9.16667Z" fill="#5F5E5E" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0Z" fill="#837560" />
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
    <path d="M10 14.5C11.25 14.5 12.3125 14.0625 13.1875 13.1875C14.0625 12.3125 14.5 11.25 14.5 10C14.5 8.75 14.0625 7.6875 13.1875 6.8125C12.3125 5.9375 11.25 5.5 10 5.5C8.75 5.5 7.6875 5.9375 6.8125 6.8125C5.9375 7.6875 5.5 8.75 5.5 10C5.5 11.25 5.9375 12.3125 6.8125 13.1875C7.6875 14.0625 8.75 14.5 10 14.5ZM10 12.5C9.3 12.5 8.70833 12.2583 8.225 11.775C7.74167 11.2917 7.5 10.7 7.5 10C7.5 9.3 7.74167 8.70833 8.225 8.225C8.70833 7.74167 9.3 7.5 10 7.5C10.7 7.5 11.2917 7.74167 11.775 8.225C12.2583 8.70833 12.5 9.3 12.5 10C12.5 10.7 12.2583 11.2917 11.775 11.775C11.2917 12.2583 10.7 12.5 10 12.5ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H5.15L7 0H13L14.85 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V16C20 16.55 19.8042 17.0208 19.4125 17.4125C19.0208 17.8042 18.55 18 18 18H2ZM2 16H18V4H13.95L12.125 2H7.875L6.05 4H2V16Z" fill="#FBF9F8" />
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M5 6.66667H0V5H5V0H6.66667V5H11.6667V6.66667H6.66667V11.6667H5V6.66667Z" fill="#F2F0F0" />
  </svg>
);

const ChevronDown = () => (
  <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
    <path d="M4 4.93333L0 0.933333L0.933333 0L4 3.06667L7.06667 0L8 0.933333L4 4.93333Z" fill="#5F5E5E" />
  </svg>
);

const editorialPosts = [
  {
    id: 1,
    views: "1.2k",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    size: "tall",
  },
  {
    id: 2,
    views: "842",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    size: "normal",
  },
  {
    id: 3,
    views: "2.1k",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
    size: "normal",
  },
  {
    id: 4,
    views: "3.5k",
    image: "https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?w=600&q=80",
    size: "normal",
  },
];

const footerLinks = ["Privacy Policy", "Terms of Service", "FAQ", "About Us"];

function Navbar() {
  const { user } = useContext(AuthContext);
  const [active, setActive] = useState("Home");
  const navLinks = ["Home", "Events", "Contact Us"];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[rgba(213,196,171,0.30)] bg-[rgba(251,249,248,0.85)] backdrop-blur-md shadow-sm">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-16 flex justify-between items-center h-[72px]">
        <div className="flex items-center gap-10">
          <span className="font-playfair text-2xl font-bold text-[#1B1C1C] cursor-pointer">
            LuxeDiscovery
          </span>
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setActive(link)}
                className={`font-hanken text-[15px] font-medium tracking-wide transition-colors pb-0.5 ${active === link
                  ? "text-[#7C5800] border-b-2 border-[#7C5800]"
                  : "text-[#5F5E5E] hover:text-[#7C5800]"
                  }`}
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(213,196,171,0.50)] bg-[#EFEDED]">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search experiences..."
              className="bg-transparent text-[#6B7280] font-hanken text-sm w-44 outline-none placeholder:text-[#6B7280]"
            />
          </div>

          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-[rgba(229,226,225,0.60)] cursor-pointer hover:bg-[rgba(229,226,225,0.90)] transition-colors">
            <div className="w-8 h-8 rounded-full border border-[#D5C4AB] bg-[#E8E1D9] text-[#7C5800] flex items-center justify-center font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="font-hanken text-sm font-medium text-[#1C1B1B] leading-4">{user?.username || "Alex Rivera"}</p>
              <p className="font-hanken text-[10px] text-[#5F5E5E] leading-3 mt-0.5 capitalize">{user?.role || "Pro Curator"}</p>
            </div>
            <ChevronDown />
          </div>
        </div>
      </div>
    </nav>
  );
}

function CoverSection({ onUpload, uploading }) {
  const { user } = useContext(AuthContext);
  const [dragActive, setDragActive] = useState(false);

  const coverUrl = user?.businessDetails?.coverImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=85";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onUpload(file);
      } else {
        alert("Only image files are allowed.");
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        onUpload(file);
      } else {
        alert("Only image files are allowed.");
      }
    }
  };

  return (
    <div 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full h-[400px] md:h-[450px] overflow-hidden transition-all duration-300 ${
        dragActive ? "opacity-85 ring-4 ring-[#7C5800] ring-inset" : ""
      }`}
    >
      <img
        src={coverUrl}
        alt="Cover"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(27,28,28,0.50)] to-transparent" />
      
      {dragActive && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
          <p className="text-[#FBF9F8] font-hanken text-lg font-bold">Drop cover image here</p>
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-white text-xs font-semibold">Uploading...</p>
          </div>
        </div>
      )}

      <label className="absolute bottom-5 right-6 flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(251,249,248,0.30)] bg-[rgba(251,249,248,0.20)] text-[#FBF9F8] font-hanken text-sm hover:bg-[rgba(251,249,248,0.35)] transition-colors cursor-pointer">
        <CameraIcon />
        <span>Update Cover</span>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleChange} 
          className="hidden" 
        />
      </label>
    </div>
  );
}

function ProfileHeader({ onUpload, uploading }) {
  const { user } = useContext(AuthContext);
  const [dragActive, setDragActive] = useState(false);
  const businessName = user?.businessDetails?.businessName || user?.username || "Artisan Gala Events";
  const navigate = useNavigate();
  const profileUrl = user?.businessDetails?.profileImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onUpload(file);
      } else {
        alert("Only image files are allowed.");
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        onUpload(file);
      } else {
        alert("Only image files are allowed.");
      }
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 lg:px-16">
      <div className="flex justify-center -mt-[72px] mb-4">
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative group transition-all duration-300 ${dragActive ? "scale-105" : ""}`}
        >
          <div className={`w-[130px] h-[130px] md:w-[160px] md:h-[160px] rounded-full border-[5px] border-[#FBF9F8] overflow-hidden shadow-lg bg-stone-100 flex items-center justify-center text-4xl font-bold text-[#7C5800] transition-all ${
            dragActive ? "ring-4 ring-[#7C5800]" : ""
          }`}>
            {user?.businessDetails?.profileImage ? (
              <img
                src={profileUrl}
                alt={businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{businessName.charAt(0).toUpperCase()}</span>
            )}
            
            {dragActive && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center p-2 rounded-full">
                <span className="text-[10px] md:text-xs text-[#FBF9F8] font-bold font-hanken">Drop profile</span>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <label className="absolute bottom-3 right-2 w-8 h-8 rounded-full bg-[#7C5800] flex items-center justify-center shadow-md hover:bg-[#6B4C00] transition-colors cursor-pointer">
            <EditIcon />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleChange} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4 mt-2 pb-6">
        <div>
          <h1 className="font-playfair text-3xl md:text-[40px] font-bold text-[#1B1C1C] leading-tight">
            {businessName}
          </h1>
          <div className="flex flex-wrap items-center gap-5 mt-2">
            <span className="font-hanken text-base text-[#5F5E5E]">
              <strong className="text-[#1B1C1C]">2.4k</strong> followers
            </span>
            <span className="font-hanken text-base text-[#5F5E5E]">
              <strong className="text-[#1B1C1C]">812</strong> following
            </span>
            <span className="flex items-center gap-1.5 font-hanken text-base">
              <TrendUpIcon />
              <strong className="text-[#1B1C1C]">13.5k</strong>
              <span className="text-[#7C5800]">monthly views</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#EFEDED] text-[#1B1C1C] font-hanken text-sm font-medium hover:bg-[#E5E3E3] transition-colors">
            <ShareIcon />
            Share
          </button>
          <button onClick={() => navigate('/business-setting')} className="px-7 py-2.5 rounded-lg bg-[#FFB800] text-[#6B4C00] font-hanken text-sm font-bold shadow-md hover:bg-[#F0AC00] transition-colors">
            Edit Business Profile
          </button>
        </div>
      </div>
    </div>
  );
}



function Footer() {
  return (
    <footer className="w-full border-t border-[rgba(213,196,171,0.30)] bg-[#EFEDED]">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col gap-5">
          <p className="font-playfair text-2xl font-bold text-[#7C5800]">LuxeDiscovery</p>
          <p className="font-hanken text-base text-[#5F5E5E] leading-relaxed max-w-[320px]">
            Curating the world's most exclusive experiences. From private gala dinners to global innovation summits, we define the next generation of premium events.
          </p>
          <div className="flex gap-3">
            {["🌐", "@", "📍"].map((icon, i) => (
              <button
                key={i}
                className="w-10 h-10 rounded-full bg-[#E9E8E7] flex items-center justify-center text-[#5F5E5E] hover:bg-[#D5C4AB] transition-colors text-base"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-hanken text-xs text-[#1B1C1C] tracking-[0.1em]">EXPLORE</p>
          <div className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="font-hanken text-base text-[#5F5E5E] hover:text-[#7C5800] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-hanken text-xs text-[#1B1C1C] tracking-[0.1em]">CONTACT</p>
          <p className="font-hanken text-base text-[#5F5E5E] leading-7">
            124 Luxury Way<br />
            Manhattan, NY 10001<br />
            concierge@luxediscovery.com
          </p>
        </div>
      </div>

      <div className="border-t border-[rgba(213,196,171,0.20)] py-6">
        <p className="text-center font-hanken text-base text-[#5F5E5E]">
          © 2024 LuxeDiscovery. All rights reserved.
        </p>
      </div>
    </footer>
  );
}



export default function SellerDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { token, updateUser } = useContext(AuthContext);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUploadCover = async (file) => {
    setUploadingCover(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("coverImage", file);

      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload cover image.");

      updateUser(data.user);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || "Error uploading cover image.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleUploadProfile = async (file) => {
    setUploadingProfile(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("profileImage", file);

      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload profile image.");

      updateUser(data.user);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || "Error uploading profile image.");
    } finally {
      setUploadingProfile(false);
    }
  };

  return (
    <>
      <div className="pt-20">
        <div className="min-h-screen bg-[#FBF9F8] relative">
          <Navbar />
          <SellerSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'}`}>
            {uploadError && (
              <div className="bg-red-50 text-red-600 p-3 text-sm text-center border-b border-red-100">
                {uploadError}
              </div>
            )}
            <CoverSection onUpload={handleUploadCover} uploading={uploadingCover} />
            <ProfileHeader onUpload={handleUploadProfile} uploading={uploadingProfile} />
            <CuratedPackages />
            <EditorialUpdates />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}