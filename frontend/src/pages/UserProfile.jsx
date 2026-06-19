import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {
  const { user, token, updateRoleToSeller, logout } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [businessData, setBusinessData] = useState({ businessName: '', businessAddress: '', phone: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpgrade = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(businessData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      updateRoleToSeller(data.user, data.token);
      navigate("/seller-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold border-b pb-4 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>User Profile Layout</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 bg-gray-50 p-6 rounded-2xl">
            <p className="text-sm"><span className="font-bold text-gray-700">Username:</span> {user?.username}</p>
            <p className="text-sm"><span className="font-bold text-gray-700">Email:</span> {user?.email}</p>
            <p className="text-sm capitalize"><span className="font-bold text-gray-700">Role Profile:</span> {user?.role}</p>
          </div>

          <div className="space-y-4">
            <button onClick={() => navigate("/")} className="w-full p-4 border rounded-xl text-left font-semibold hover:bg-gray-50 flex justify-between">
              <span>🏠 Home Link Button</span> <span>&rarr;</span>
            </button>

            {user?.role === "user" && !showForm && (
              <button onClick={() => setShowForm(true)} className="w-full p-4 bg-emerald-50 text-emerald-800 rounded-xl text-left font-bold border border-emerald-200 hover:bg-emerald-100 flex justify-between">
                <span>✨ Create Business Account</span> <span>&rarr;</span>
              </button>
            )}

            {user?.role === "seller" && (
              <button onClick={() => navigate("/seller-dashboard")} className="w-full p-4 bg-purple-50 text-purple-800 rounded-xl text-left font-bold border border-purple-200 hover:bg-purple-100 flex justify-between">
                <span>💼 Business Dashboard Button</span> <span>&rarr;</span>
              </button>
            )}

            <button onClick={() => { logout(); navigate("/login"); }} className="w-full p-4 bg-red-50 text-red-700 rounded-xl text-left font-semibold border border-red-100 hover:bg-red-100">
              ↩ Bottom Logout Button
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleUpgrade} className="mt-8 pt-8 border-t space-y-4 max-w-md">
            <h3 className="text-lg font-bold text-gray-900">Seller Registration Form</h3>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <input type="text" placeholder="Business Name" required className="w-full p-3 border rounded-xl outline-none" onChange={e => setBusinessData({ ...businessData, businessName: e.target.value })} />
            <input type="text" placeholder="Business Address" required className="w-full p-3 border rounded-xl outline-none" onChange={e => setBusinessData({ ...businessData, businessAddress: e.target.value })} />
            <input type="text" placeholder="Contact Phone" required className="w-full p-3 border rounded-xl outline-none" onChange={e => setBusinessData({ ...businessData, phone: e.target.value })} />
            <button type="submit" className="w-full bg-[#1B1C1C] text-white p-3 rounded-xl font-medium">Register Business & Upgrade</button>
          </form>
        )}
      </div>
    </div>
  );
}