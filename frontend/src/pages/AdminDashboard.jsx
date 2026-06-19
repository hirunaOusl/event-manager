import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-50/20 p-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-red-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-red-950" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Dashboard</h1>
          <p className="text-sm text-red-600 mt-1">Platform core bypass environment control panel workspace.</p>
        </div>
        <button onClick={() => { logout(); navigate("/login"); }} className="bg-red-600 text-white font-semibold text-xs px-5 py-3 rounded-xl hover:bg-red-700">
          System Logout
        </button>
      </div>
    </div>
  );
}