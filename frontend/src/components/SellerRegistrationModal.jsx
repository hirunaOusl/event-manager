import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function SellerRegistrationModal({ onClose, setView }) {
  const { token, updateRoleToSeller } = useContext(AuthContext);
  const [businessData, setBusinessData] = useState({ businessName: '', businessAddress: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // Always fetch the freshest token directly from localStorage right before the fetch call
  const currentToken = localStorage.getItem('token');

  if (!currentToken) {
    setError('Your session has expired. Please log in again.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/register-seller', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}` // Using the direct token string
      },
      body: JSON.stringify(businessData)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update account.');

    updateRoleToSeller(data.user, data.token);
    onClose();
    setView('seller-dashboard'); 
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Register Business</h3>
        <p className="text-gray-500 text-sm mb-4">Upgrade your account to start selling products.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input type="text" required className="mt-1 w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={e => setBusinessData({...businessData, businessName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Address</label>
            <input type="text" required className="mt-1 w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={e => setBusinessData({...businessData, businessAddress: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="text" required className="mt-1 w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={e => setBusinessData({...businessData, phone: e.target.value})} />
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose} className="w-1/2 border p-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium p-2.5 rounded-lg">Submit Form</button>
          </div>
        </form>
      </div>
    </div>
  );
}