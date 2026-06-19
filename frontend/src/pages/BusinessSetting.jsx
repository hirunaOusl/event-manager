import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SellerSidebar from "../components/SellerSidebar";

export default function BusinessSetting() {
    const { user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        phone: user?.businessDetails?.phone || user?.phone || '+1 (555) 123-4567',
        company: user?.businessDetails?.businessName || user?.username || 'Artisan Gala Events',
        address: user?.businessDetails?.businessAddress || '1200 Luxury Lane, Suite 400, New York, NY 10001',
        aboutMe: user?.businessDetails?.aboutMe || 'Premium event planner specializing in high-end corporate retreats and luxury weddings.'
    });

    const handleSaveProfile = (e) => {
        e.preventDefault();
        alert('Business Information saved successfully!');
    };

    return (
        <div className="min-h-screen bg-[#FBF9F8] relative pt-20">
            <SellerSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'}`}>
                <div className="p-12 font-hanken">
                    <div className="bg-white w-full h-full rounded-2xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-start w-full">
                            {/* Settings Title */}
                            <div className="mb-8">
                                <h2 className="text-[#191C1E] text-[32px] font-bold leading-10">Settings</h2>
                                <p className="text-[#434651] text-sm mt-1">Manage your business account preferences and notifications.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 w-full items-start">

                                {/* Left Column (Forms) */}
                                <div className="col-span-2 flex flex-col gap-6 w-full">

                                    {/* Personal Information Card */}
                                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full">
                                        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-4 mb-6">
                                            <svg className="w-5 h-5 text-[#434651]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-[#191C1E] text-lg font-bold">Business Information</span>
                                        </div>

                                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>}

                                        <form onSubmit={handleSaveProfile} className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-[#434651] mb-1.5 block">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-[#434651] mb-1.5 block">Company (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={formData.company}
                                                        placeholder={user?.role === 'user' ? 'Register business name to upgrade' : 'Your company name'}
                                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-[#434651] mb-1.5 block">Address</label>
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-[#434651] mb-1.5 block">About Me</label>
                                                <textarea
                                                    rows="4"
                                                    value={formData.aboutMe}
                                                    onChange={e => setFormData({ ...formData, aboutMe: e.target.value })}
                                                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors resize-none"
                                                />
                                            </div>

                                            <div className="flex justify-end pt-2">
                                                <button
                                                    type="submit"
                                                    className="py-2.5 px-6 rounded-lg bg-[#002155] hover:bg-[#001a44] text-white text-sm font-semibold tracking-wide transition-colors shadow-sm"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}