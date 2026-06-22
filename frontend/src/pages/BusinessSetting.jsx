import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SellerSidebar from "../components/SellerSidebar";

export default function BusinessSetting() {
    const { user, token, updateUser } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        businessName: user?.businessDetails?.businessName || '',
        businessAddress: user?.businessDetails?.businessAddress || '',
        phone: user?.businessDetails?.phone || '',
        category: user?.businessDetails?.category || '',
        description: user?.businessDetails?.description || '',
        city: user?.businessDetails?.city || '',
        taxNumber: user?.businessDetails?.taxNumber || '',
        nicNumber: user?.businessDetails?.nicNumber || '',
        whatsappNumber: user?.businessDetails?.whatsappNumber || ''
    });
    const [newTaxFile, setNewTaxFile] = useState(null);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                form.append(key, val);
            });
            if (newTaxFile) {
                form.append('taxFile', newTaxFile);
            }

            const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update business profile.');

            updateUser(data.user);
            setSuccess('Business settings updated successfully!');
            setNewTaxFile(null);
        } catch (err) {
            setError(err.message);
        }
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
                                        {success && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm mb-6">{success}</div>}

                                        <form onSubmit={handleSaveProfile} className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-[#434651] mb-1.5 block">Business Name</label>
                                                    <input
                                                        type="text"
                                                        value={formData.businessName}
                                                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-[#434651] mb-1.5 block">Business Category</label>
                                                    <select
                                                        value={formData.category}
                                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                    >
                                                        <option value="">Select Category</option>
                                                        <option value="Decoration">Decoration</option>
                                                        <option value="Photography">Photography</option>
                                                        <option value="Music">Music</option>
                                                        <option value="Hotel / Venue">Hotel / Venue</option>
                                                        <option value="Catering">Catering</option>
                                                        <option value="Jewelry">Jewelry</option>
                                                        <option value="Salon">Salon</option>
                                                        <option value="Dress Designer">Dress Designer</option>
                                                        <option value="Cake Designer">Cake Designer</option>
                                                        <option value="Event Planner">Event Planner</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-[#434651] mb-1.5 block">Business Description</label>
                                                <textarea
                                                    rows="3"
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors resize-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-[#434651] mb-1.5 block">Address</label>
                                                    <input
                                                        type="text"
                                                        value={formData.businessAddress}
                                                        onChange={e => setFormData({ ...formData, businessAddress: e.target.value })}
                                                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-[#434651] mb-1.5 block">City</label>
                                                    <input
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                    />
                                                </div>
                                            </div>

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
                                                    <label className="text-xs font-bold text-[#434651] mb-1.5 block">WhatsApp Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.whatsappNumber}
                                                        onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-[#434651] mb-1.5 block">Tax Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.taxNumber}
                                                        onChange={e => setFormData({ ...formData, taxNumber: e.target.value })}
                                                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-[#434651] mb-1.5 block">NIC Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.nicNumber}
                                                        onChange={e => setFormData({ ...formData, nicNumber: e.target.value })}
                                                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-[#434651] mb-1.5 block">Business Tax File</label>
                                                {user?.businessDetails?.taxFile && (
                                                    <div className="mb-3">
                                                        <p className="text-xs text-gray-500 mb-1">Current Tax File:</p>
                                                        <div className="w-40 h-28 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                                            <img 
                                                                src={user.businessDetails.taxFile} 
                                                                alt="Business Tax File" 
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.src = 'https://placehold.co/160x110?text=Tax+File+Image'; }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => setNewTaxFile(e.target.files[0])}
                                                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-1.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
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