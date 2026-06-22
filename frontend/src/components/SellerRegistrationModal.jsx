import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function SellerRegistrationModal({ onClose, setView }) {
  const { token, updateRoleToSeller } = useContext(AuthContext);
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessAddress: '',
    phone: '',
    category: '',
    description: '',
    city: '',
    taxNumber: '',
    nicNumber: '',
    whatsappNumber: ''
  });
  const [taxFile, setTaxFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!taxFile) {
      setError('Please upload your business tax file image.');
      return;
    }

    // Always fetch the freshest token directly from localStorage right before the fetch call
    const currentToken = localStorage.getItem('token') || token;

    if (!currentToken) {
      setError('Your session has expired. Please log in again.');
      return;
    }

    try {
      const form = new FormData();
      Object.entries(businessData).forEach(([key, val]) => {
        form.append(key, val);
      });
      form.append('taxFile', taxFile);

      const res = await fetch('http://localhost:5000/api/auth/register-seller', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}` // Using the direct token string
        },
        body: form
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update account.');

      updateRoleToSeller(data.user, data.token);
      onClose();
      if (setView) setView('seller-dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative border border-gray-100 flex flex-col gap-6 animate-scale-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[#434651] hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <div>
          <h2 className="text-[#191C1E] text-2xl font-bold">Register Business</h2>
          <p className="text-[#434651] text-sm mt-1">Provide details about your business to upgrade to a seller account.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#434651] mb-1">
                Business Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grand Plaza Events"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                onChange={e =>
                  setBusinessData({ ...businessData, businessName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#434651] mb-1">
                Business Category
              </label>
              <select
                required
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                onChange={e =>
                  setBusinessData({ ...businessData, category: e.target.value })
                }
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
            <label className="block text-xs font-bold text-[#434651] mb-1">
              Business Description
            </label>
            <textarea
              rows="3"
              required
              placeholder="Tell customers about your business..."
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors resize-none"
              onChange={e =>
                setBusinessData({ ...businessData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#434651] mb-1">
                Business Address
              </label>
              <input
                type="text"
                required
                placeholder="100 Luxury St"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                onChange={e =>
                  setBusinessData({ ...businessData, businessAddress: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#434651] mb-1">
                City
              </label>
              <input
                type="text"
                required
                placeholder="New York"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                onChange={e =>
                  setBusinessData({ ...businessData, city: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#434651] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="+1 (555) 123-4567"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                onChange={e =>
                  setBusinessData({ ...businessData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#434651] mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                required
                placeholder="+1 (555) 987-6543"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                onChange={e =>
                  setBusinessData({ ...businessData, whatsappNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#434651] mb-1">
                Tax Number
              </label>
              <input
                type="text"
                required
                placeholder="TX-12345"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                onChange={e =>
                  setBusinessData({ ...businessData, taxNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#434651] mb-1">
                NIC Number
              </label>
              <input
                type="text"
                required
                placeholder="NIC-67890"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                onChange={e =>
                  setBusinessData({ ...businessData, nicNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#434651] mb-1">
              Business Tax File Image
            </label>
            <input
              type="file"
              required
              accept="image/*"
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-1.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
              onChange={e => setTaxFile(e.target.files[0])}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-lg border border-[#E5E7EB] text-[#434651] hover:bg-gray-50 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-lg bg-[#002155] hover:bg-[#001a44] text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Register Business
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}