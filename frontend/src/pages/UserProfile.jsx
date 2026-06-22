import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function UserProfile() {
  const { user, token, updateRoleToSeller, logout } = useContext(AuthContext);
  const [activeSubView, setActiveSubView] = useState('profile');
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessAddress: '',
    phone: '',
    subCategory: '',
    description: '',
    city: '',
    taxNumber: '',
    nicNumber: '',
    whatsappNumber: ''
  });
  const [taxFile, setTaxFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [usernameFirst, usernameLast] = (user?.username || '').split(' ');
  const [formData, setFormData] = useState({
    firstName: usernameFirst || 'Alex',
    lastName: usernameLast || 'Sterling',
    email: user?.email || 'alex.sterling@eventelite.com',
    phone: '+1 (555) 123-4567',
    company: user?.role === 'seller' ? 'Sterling Events' : '',
    address: '1200 Luxury Lane, Suite 400, New York, NY 10001',
    aboutMe: 'Premium event planner specializing in high-end corporate retreats and luxury weddings across the East Coast.',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false
  });

  const [showForm, setShowForm] = useState(false);

  const handleUpgrade = async (e) => {
    e.preventDefault();
    if (!taxFile) {
      setError('Please upload your business tax file image.');
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
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      updateRoleToSeller(data.user, data.token);
      navigate("/seller-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Profile changes saved successfully!');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Profile', view: 'profile' },
    ...(user?.role === 'seller' ? [{ name: 'Seller Dashboard', path: '/seller-dashboard' }] : []),
    { name: 'My Bookings', view: 'bookings' },
    { name: 'My Orders', view: 'orders' },
    { name: 'Saved Vendors', view: 'vendors' },
    { name: 'Budget Planner', view: 'budget' },
    { name: 'Messages', view: 'messages' },
    { name: 'Notifications', view: 'notifications' },
    { name: 'Payment History', view: 'payments' },
    { name: 'Settings', view: 'settings' },
    { name: 'Help & Support', view: 'help' },
    { name: 'Logout', action: 'logout' }
  ];

  const handleMenuClick = (item) => {
    if (item.action === 'logout') {
      logout();
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
    } else if (item.view) {
      setActiveSubView(item.view);
    }
  };

  return (
    <div className="flex flex-col items-start bg-white min-h-screen relative font-['Inter',system-ui,sans-serif] pt-20">
      {/* Main content area with sidebar offset */}
      <div className="flex pr-0 pb-0 pl-64 justify-center items-start shrink-0 w-full min-h-[calc(100vh-80px)]">
        <div className="flex pt-12 pr-12 pb-12 pl-12 justify-center items-start bg-[#F8F9FB] w-full h-full min-h-[calc(100vh-80px)]">
          <div className="flex max-w-[1440px] flex-col items-start gap-12 w-[928px]">

            {activeSubView === 'profile' && (
              <>
                {/* Profile header card */}
                <div className="flex flex-col items-start -space-y-20 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full overflow-hidden">
                  <div className="bg-[#E0E3E5] w-full h-64 relative">
                    <div className="w-[928px] h-64 absolute left-0 top-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                  </div>
                  <div className="flex pt-0 pr-8 pb-8 pl-8 justify-between items-end w-full">
                    <div className="flex items-end gap-6">
                      <div className="flex flex-col justify-center items-start rounded-full border-4 border-white bg-[#F8F9FB] w-40 h-40 overflow-hidden">
                        <div className="w-full h-full bg-[#d0d5dc] flex items-center justify-center text-gray-600 text-5xl font-semibold">
                          {user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                      </div>
                      <div className="flex pb-2 flex-col items-start">
                        <p className="text-[#191C1E] text-5xl font-bold leading-[56px] tracking-[-0.02em]">
                          {user?.username || 'Alex Sterling'}
                        </p>
                        <div className="flex items-start gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                              <path d="M1.16667 9.33333C0.845833 9.33333 0.571181 9.2191 0.342708 8.99063C0.114236 8.76215 0 8.4875 0 8.16667V1.16667C0 0.845833 0.114236 0.571181 0.342708 0.342708C0.571181 0.114236 0.845833 0 1.16667 0H10.5C10.8208 0 11.0955 0.114236 11.324 0.342708C11.5524 0.571181 11.6667 0.845833 11.6667 1.16667V8.16667C11.6667 8.4875 11.5524 8.76215 11.324 8.99063C11.0955 9.2191 10.8208 9.33333 10.5 9.33333H1.16667ZM5.83333 5.25L1.16667 2.33333V8.16667H10.5V2.33333L5.83333 5.25ZM5.83333 4.08333L10.5 1.16667H1.16667L5.83333 4.08333Z" fill="#434651" />
                            </svg>
                            <p className="text-[#434651] text-base leading-6">{user?.email || 'alex.s@example.com'}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                              <path d="M4.66667 5.83333C4.9875 5.83333 5.26215 5.7191 5.49062 5.49062C5.7191 5.26215 5.83333 4.9875 5.83333 4.66667C5.83333 4.34583 5.7191 4.07118 5.49062 3.84271C5.26215 3.61424 4.9875 3.5 4.66667 3.5C4.34583 3.5 4.07118 3.61424 3.84271 3.84271C3.61424 4.07118 3.5 4.34583 3.5 4.66667C3.5 4.9875 3.61424 5.26215 3.84271 5.49062C4.07118 5.7191 4.34583 5.83333 4.66667 5.83333ZM4.66667 10.1208C5.85278 9.03194 6.73264 8.04271 7.30625 7.15312C7.87986 6.26354 8.16667 5.47361 8.16667 4.78333C8.16667 3.72361 7.82882 2.8559 7.15312 2.18021C6.47743 1.50451 5.64861 1.16667 4.66667 1.16667C3.68472 1.16667 2.8559 1.50451 2.18021 2.18021C1.50451 2.8559 1.16667 3.72361 1.16667 4.78333C1.16667 5.47361 1.45347 6.26354 2.02708 7.15312C2.60069 8.04271 3.48056 9.03194 4.66667 10.1208ZM4.66667 11.6667C3.10139 10.3347 1.93229 9.09757 1.15937 7.95521C0.386458 6.81285 0 5.75556 0 4.78333C0 3.325 0.469097 2.16319 1.40729 1.29792C2.34549 0.432639 3.43194 0 4.66667 0C5.90139 0 6.98785 0.432639 7.92604 1.29792C8.86424 2.16319 9.33333 3.325 9.33333 4.78333C9.33333 5.75556 8.94688 6.81285 8.17396 7.95521C7.40104 9.09757 6.23194 10.3347 4.66667 11.6667Z" fill="#434651" />
                            </svg>
                            <p className="text-[#434651] text-base leading-6">London, UK</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex pb-4 flex-col items-start">
                      <button onClick={() => setActiveSubView('settings')} className="flex py-2 px-6 items-center gap-2 rounded-lg bg-[#002155] hover:bg-[#001a44] transition-colors">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M1.16667 9.33333H1.99792L7.7 3.63125L6.86875 2.8L1.16667 8.50208V9.33333ZM0 10.5V8.02083L7.7 0.335417C7.81667 0.228472 7.94549 0.145833 8.08646 0.0875C8.22743 0.0291667 8.37569 0 8.53125 0C8.68681 0 8.8375 0.0291667 8.98333 0.0875C9.12917 0.145833 9.25556 0.233333 9.3625 0.35L10.1646 1.16667C10.2812 1.27361 10.3663 1.4 10.4198 1.54583C10.4733 1.69167 10.5 1.8375 10.5 1.98333C10.5 2.13889 10.4733 2.28715 10.4198 2.42812C10.3663 2.5691 10.2812 2.69792 10.1646 2.81458L2.47917 10.5H0ZM9.33333 1.98333L8.51667 1.16667L9.33333 1.98333ZM7.27708 3.22292L6.86875 2.8L7.7 3.63125L7.27708 3.22292Z" fill="white" />
                        </svg>
                        <span className="text-white text-sm font-semibold leading-5 tracking-[0.05em]">Edit Profile</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats cards row */}
                <div className="flex justify-center items-start gap-6 w-full">
                  <div className="flex p-6 flex-col items-start gap-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[#434651] text-base leading-6">Active Bookings</p>
                      <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                        <path d="M11.5 16C10.8 16 10.2083 15.7583 9.725 15.275C9.24167 14.7917 9 14.2 9 13.5C9 12.8 9.24167 12.2083 9.725 11.725C10.2083 11.2417 10.8 11 11.5 11C12.2 11 12.7917 11.2417 13.275 11.725C13.7583 12.2083 14 12.8 14 13.5C14 14.2 13.7583 14.7917 13.275 15.275C12.7917 15.7583 12.2 16 11.5 16ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z" fill="#0058BC" />
                      </svg>
                    </div>
                    <p className="text-[#191C1E] text-[32px] font-semibold leading-10 tracking-[-0.01em]">3</p>
                    <div className="flex min-h-[20px] pt-11 flex-col justify-end items-start w-full h-16">
                      <div className="flex items-center gap-1">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path d="M0.7 6L0 5.3L3.7 1.575L5.7 3.575L8.3 1H7V0H10V3H9V1.7L5.7 5L3.7 3L0.7 6Z" fill="#10B981" />
                        </svg>
                        <p className="text-[#10B981] text-sm leading-5">+1 this month</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex p-6 flex-col items-start gap-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[#434651] text-base leading-6">Completed Orders</p>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8.6 14.6L15.65 7.55L14.25 6.15L8.6 11.8L5.75 8.95L4.35 10.35L8.6 14.6ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#003580" />
                      </svg>
                    </div>
                    <p className="text-[#191C1E] text-[32px] font-semibold leading-10 tracking-[-0.01em]">12</p>
                    <div className="flex min-h-[20px] pt-11 flex-col justify-end items-start w-full h-16">
                      <p className="text-[#434651] text-sm leading-5">Across 4 event types</p>
                    </div>
                  </div>

                  <div className="flex p-6 flex-col items-start gap-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[#434651] text-base leading-6">Saved Vendors</p>
                      <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
                        <path d="M10 18.35L8.55 17.05C6.86667 15.5333 5.475 14.225 4.375 13.125C3.275 12.025 2.4 11.0375 1.75 10.1625C1.1 9.2875 0.645833 8.48333 0.3875 7.75C0.129167 7.01667 0 6.26667 0 5.5C0 3.93333 0.525 2.625 1.575 1.575C2.625 0.525 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C16.0667 0 17.375 0.525 18.425 1.575C19.475 2.625 20 3.93333 20 5.5C20 6.26667 19.8708 7.01667 19.6125 7.75C19.3542 8.48333 18.9 9.2875 18.25 10.1625C17.6 11.0375 16.725 12.025 15.625 13.125C14.525 14.225 13.1333 15.5333 11.45 17.05L10 18.35ZM10 15.65C11.6 14.2167 12.9167 12.9875 13.95 11.9625C14.9833 10.9375 15.8 10.0458 16.4 9.2875C17 8.52917 17.4167 7.85417 17.65 7.2625C17.8833 6.67083 18 6.08333 18 5.5C18 4.5 17.6667 3.66667 17 3C16.3333 2.33333 15.5 2 14.5 2C13.7167 2 12.9917 2.22083 12.325 2.6625C11.6583 3.10417 11.2 3.66667 10.95 4.35H9.05C8.8 3.66667 8.34167 3.10417 7.675 2.6625C7.00833 2.22083 6.28333 2 5.5 2C4.5 2 3.66667 2.33333 3 3C2.33333 3.66667 2 4.5 2 5.5C2 6.08333 2.11667 6.67083 2.35 7.2625C2.58333 7.85417 3 8.52917 3.6 9.2875C4.2 10.0458 5.01667 10.9375 6.05 11.9625C7.08333 12.9875 8.4 14.2167 10 15.65Z" fill="#BA1A1A" />
                      </svg>
                    </div>
                    <p className="text-[#191C1E] text-[32px] font-semibold leading-10 tracking-[-0.01em]">28</p>
                    <div className="flex min-h-[20px] pt-11 flex-col justify-end items-start w-full h-16">
                      <p className="text-[#434651] text-sm leading-5">Ready for quick booking</p>
                    </div>
                  </div>

                  <div className="flex p-6 flex-col items-start gap-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-[#434651] text-base leading-6">Total Budget Spent</p>
                      <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                        <path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.19583 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10ZM19 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16Z" fill="#FEBB02" />
                      </svg>
                    </div>
                    <p className="text-[#191C1E] text-[32px] font-semibold leading-10 tracking-[-0.01em]">£14,500</p>
                    <div className="w-full h-2 relative">
                      <div className="w-full h-2 rounded-full bg-[#E6E8EA]"></div>
                      <div className="w-[65%] h-2 rounded-full bg-gradient-to-r from-[#006CE4] to-[#003580] absolute top-0 left-0"></div>
                    </div>
                    <div className="flex flex-col items-end w-full">
                      <p className="text-[#434651] text-xs leading-4">65% of annual budget</p>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings section */}
                <div className="flex flex-col items-start gap-6 w-full">
                  <div className="flex justify-between items-center w-full">
                    <h2 className="text-[#191C1E] text-2xl font-semibold leading-8">Recent Bookings</h2>
                    <button className="text-[#0058BC] text-sm font-semibold leading-5 tracking-[0.05em] hover:underline">View All</button>
                  </div>
                  <div className="grid grid-cols-2 gap-6 w-full">
                    {/* Booking card 1 */}
                    <div className="flex flex-col rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
                      <div className="h-[140px] bg-[#d0d5dc] relative">
                        <div className="absolute left-4 top-4 flex py-1 px-3 items-center gap-1 rounded-full bg-[#F59E0B] shadow-sm">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M7.75833 8.575L8.575 7.75833L6.41667 5.6V2.91667H5.25V6.06667L7.75833 8.575ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C7.12639 10.5 8.22743 10.0455 9.13646 9.13646C10.0455 8.22743 10.5 7.12639 10.5 5.83333C10.5 4.54028 10.0455 3.43924 9.13646 2.53021C8.22743 1.62118 7.12639 1.16667 5.83333 1.16667C4.54028 1.16667 3.43924 1.62118 2.53021 2.53021C1.62118 3.43924 1.16667 4.54028 1.16667 5.83333C1.16667 7.12639 1.62118 8.22743 2.53021 9.13646C3.43924 10.0455 4.54028 10.5 5.83333 10.5Z" fill="#261900" />
                          </svg>
                          <span className="text-[#261900] text-xs font-medium leading-4">Pending</span>
                        </div>
                      </div>
                      <div className="flex p-6 flex-col justify-between flex-1">
                        <div>
                          <p className="text-[#0058BC] text-xs font-medium leading-4 tracking-[0.05em]">HOTEL & VENUE</p>
                          <h3 className="text-[#191C1E] text-xl font-semibold leading-7 mt-1">Grand Plaza</h3>
                          <div className="flex items-center gap-2 mt-2 text-[#434651] text-sm">
                            <span>Corporate Gala</span>
                            <span>•</span>
                            <span>Oct 15, 2024</span>
                          </div>
                        </div>
                        <button className="mt-4 w-full py-2 px-4 rounded-lg bg-[#002155] text-white text-sm font-semibold leading-5 tracking-[0.05em] hover:bg-[#001a44] transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Booking card 2 */}
                    <div className="flex flex-col p-6 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-lg bg-[#d0d5dc] flex items-center justify-center text-xs text-gray-500">Logo</div>
                        <div className="flex py-1 px-3 items-center gap-1 rounded-full bg-[#10B981]">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M5.01667 8.51667L9.12917 4.40417L8.3125 3.5875L5.01667 6.88333L3.35417 5.22083L2.5375 6.0375L5.01667 8.51667ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C7.13611 10.5 8.23958 10.0479 9.14375 9.14375C10.0479 8.23958 10.5 7.13611 10.5 5.83333C10.5 4.53056 10.0479 3.42708 9.14375 2.52292C8.23958 1.61875 7.13611 1.16667 5.83333 1.16667C4.53056 1.16667 3.42708 1.61875 2.52292 2.52292C1.61875 3.42708 1.16667 4.53056 1.16667 5.83333C1.16667 7.13611 1.61875 8.23958 2.52292 9.14375C3.42708 10.0479 4.53056 10.5 5.83333 10.5Z" fill="white" />
                          </svg>
                          <span className="text-white text-xs font-medium leading-4">Confirmed</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-[#0058BC] text-xs font-medium leading-4 tracking-[0.05em]">DECORATION</p>
                        <h3 className="text-[#191C1E] text-xl font-semibold leading-7">Gala Flowers</h3>
                        <p className="text-[#434651] text-sm leading-5 mt-1">Wedding</p>
                        <p className="text-[#434651] text-sm leading-5 mt-2">Nov 02, 2024</p>
                      </div>
                      <button className="mt-4 w-full py-2 px-4 rounded-lg border border-[#E5E7EB] text-[#002155] text-sm font-semibold leading-5 tracking-[0.05em] hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Saved Vendors section */}
                <div className="flex flex-col items-start gap-6 w-full">
                  <div className="flex justify-between items-center w-full">
                    <h2 className="text-[#191C1E] text-2xl font-semibold leading-8">Saved Vendors</h2>
                    <button className="text-[#0058BC] text-sm font-semibold leading-5 tracking-[0.05em] hover:underline">Manage All</button>
                  </div>
                  <div className="grid grid-cols-3 gap-6 w-full">
                    {/* Vendor card 1 */}
                    <div className="flex p-6 flex-col items-start gap-4 rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#d0d5dc] flex items-center justify-center text-xs text-gray-500">Logo</div>
                          <div>
                            <h3 className="text-[#191C1E] text-xl font-semibold leading-7">Elite Catering</h3>
                            <p className="text-[#434651] text-sm leading-5">Food & Beverage</p>
                          </div>
                        </div>
                        <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
                          <path d="M10 18.35L8.55 17.05C6.86667 15.5333 5.475 14.225 4.375 13.125C3.275 12.025 2.4 11.0375 1.75 10.1625C1.1 9.2875 0.645833 8.48333 0.3875 7.75C0.129167 7.01667 0 6.26667 0 5.5C0 3.93333 0.525 2.625 1.575 1.575C2.625 0.525 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C16.0667 0 17.375 0.525 18.425 1.575C19.475 2.625 20 3.93333 20 5.5C20 6.26667 19.8708 7.01667 19.6125 7.75C19.3542 8.48333 18.9 9.2875 18.25 10.1625C17.6 11.0375 16.725 12.025 15.625 13.125C14.525 14.225 13.1333 15.5333 11.45 17.05L10 18.35Z" fill="#BA1A1A" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <svg key={i} width="15" height="15" viewBox="0 0 15 15" fill="none">
                              <path d="M2.86875 14.25L4.0875 8.98125L0 5.4375L5.4 4.96875L7.5 0L9.6 4.96875L15 5.4375L10.9125 8.98125L12.1313 14.25L7.5 11.4563L2.86875 14.25Z" fill="#F59E0B" />
                            </svg>
                          ))}
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path d="M9.8625 11.1375L9.24375 8.4375L11.325 6.6375L8.5875 6.39375L7.5 3.84375V9.69375L9.8625 11.1375ZM2.86875 14.25L4.0875 8.98125L0 5.4375L5.4 4.96875L7.5 0L9.6 4.96875L15 5.4375L10.9125 8.98125L12.1313 14.25L7.5 11.4563L2.86875 14.25Z" fill="#F59E0B" />
                          </svg>
                        </div>
                        <span className="text-[#191C1E] text-xs font-medium leading-4">4.8</span>
                        <span className="text-[#434651] text-sm leading-5">(124 reviews)</span>
                      </div>
                      <button className="w-full py-2 px-4 rounded-lg border border-[#002155] text-[#002155] text-sm font-semibold leading-5 tracking-[0.05em] hover:bg-[#002155] hover:text-white transition-colors">
                        View Profile
                      </button>
                    </div>

                    {/* Vendor card 2 */}
                    <div className="flex p-6 flex-col items-start gap-4 rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#d0d5dc] flex items-center justify-center text-xs text-gray-500">Logo</div>
                          <div>
                            <h3 className="text-[#191C1E] text-xl font-semibold leading-7">Sonic Waves DJ</h3>
                            <p className="text-[#434651] text-sm leading-5">Entertainment</p>
                          </div>
                        </div>
                        <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
                          <path d="M10 18.35L8.55 17.05C6.86667 15.5333 5.475 14.225 4.375 13.125C3.275 12.025 2.4 11.0375 1.75 10.1625C1.1 9.2875 0.645833 8.48333 0.3875 7.75C0.129167 7.01667 0 6.26667 0 5.5C0 3.93333 0.525 2.625 1.575 1.575C2.625 0.525 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C16.0667 0 17.375 0.525 18.425 1.575C19.475 2.625 20 3.93333 20 5.5C20 6.26667 19.8708 7.01667 19.6125 7.75C19.3542 8.48333 18.9 9.2875 18.25 10.1625C17.6 11.0375 16.725 12.025 15.625 13.125C14.525 14.225 13.1333 15.5333 11.45 17.05L10 18.35Z" fill="#BA1A1A" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="15" height="15" viewBox="0 0 15 15" fill="none">
                              <path d="M2.86875 14.25L4.0875 8.98125L0 5.4375L5.4 4.96875L7.5 0L9.6 4.96875L15 5.4375L10.9125 8.98125L12.1313 14.25L7.5 11.4563L2.86875 14.25Z" fill="#F59E0B" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[#191C1E] text-xs font-medium leading-4">5.0</span>
                        <span className="text-[#434651] text-sm leading-5">(89 reviews)</span>
                      </div>
                      <button className="w-full py-2 px-4 rounded-lg border border-[#002155] text-[#002155] text-sm font-semibold leading-5 tracking-[0.05em] hover:bg-[#002155] hover:text-white transition-colors">
                        View Profile
                      </button>
                    </div>

                    {/* Vendor card 3 */}
                    <div className="flex p-6 flex-col items-start gap-4 rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#d0d5dc] flex items-center justify-center text-xs text-gray-500">Logo</div>
                          <div>
                            <h3 className="text-[#191C1E] text-xl font-semibold leading-7">Capture Moments</h3>
                            <p className="text-[#434651] text-sm leading-5">Photography</p>
                          </div>
                        </div>
                        <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
                          <path d="M10 18.35L8.55 17.05C6.86667 15.5333 5.475 14.225 4.375 13.125C3.275 12.025 2.4 11.0375 1.75 10.1625C1.1 9.2875 0.645833 8.48333 0.3875 7.75C0.129167 7.01667 0 6.26667 0 5.5C0 3.93333 0.525 2.625 1.575 1.575C2.625 0.525 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C16.0667 0 17.375 0.525 18.425 1.575C19.475 2.625 20 3.93333 20 5.5C20 6.26667 19.8708 7.01667 19.6125 7.75C19.3542 8.48333 18.9 9.2875 18.25 10.1625C17.6 11.0375 16.725 12.025 15.625 13.125C14.525 14.225 13.1333 15.5333 11.45 17.05L10 18.35Z" fill="#BA1A1A" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <svg key={i} width="15" height="15" viewBox="0 0 15 15" fill="none">
                              <path d="M2.86875 14.25L4.0875 8.98125L0 5.4375L5.4 4.96875L7.5 0L9.6 4.96875L15 5.4375L10.9125 8.98125L12.1313 14.25L7.5 11.4563L2.86875 14.25Z" fill="#F59E0B" />
                            </svg>
                          ))}
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path d="M5.1375 11.1187L7.5 9.69375L9.8625 11.1375L9.24375 8.4375L11.325 6.6375L8.5875 6.39375L7.5 3.84375L6.4125 6.375L3.675 6.61875L5.75625 8.4375L5.1375 11.1187ZM2.86875 14.25L4.0875 8.98125L0 5.4375L5.4 4.96875L7.5 0L9.6 4.96875L15 5.4375L10.9125 8.98125L12.1313 14.25L7.5 11.4563L2.86875 14.25Z" fill="#F59E0B" />
                          </svg>
                        </div>
                        <span className="text-[#191C1E] text-xs font-medium leading-4">4.2</span>
                        <span className="text-[#434651] text-sm leading-5">(56 reviews)</span>
                      </div>
                      <button className="w-full py-2 px-4 rounded-lg border border-[#002155] text-[#002155] text-sm font-semibold leading-5 tracking-[0.05em] hover:bg-[#002155] hover:text-white transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSubView === 'settings' && (
              <div className="flex flex-col items-start w-full">
                {/* Settings Title */}
                <div className="mb-8">
                  <h2 className="text-[#191C1E] text-[32px] font-bold leading-10">Settings</h2>
                  <p className="text-[#434651] text-sm mt-1">Manage your account preferences and notifications.</p>
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
                        <span className="text-[#191C1E] text-lg font-bold">Personal Information</span>
                      </div>

                      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>}

                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-[#434651] mb-1.5 block">First Name</label>
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-[#434651] mb-1.5 block">Last Name</label>
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#434651] mb-1.5 block">Email Address</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                          />
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
                      </form>
                    </div>

                    {/* Create a business account Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full">
                      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-4 mb-6">
                        <svg className="w-5 h-5 text-[#434651]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-[#191C1E] text-lg font-bold">Create a business account</span>
                      </div>

                      <div className="space-y-4">
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
                      </div>

                      {showForm && (
                        <form onSubmit={handleUpgrade} className="mt-8 pt-8 border-t space-y-5 max-w-lg">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Seller Registration Form</h3>
                          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-[#434651] mb-1.5 block">Business Name</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Sterling Events" 
                                required 
                                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors" 
                                onChange={e => setBusinessData({ ...businessData, businessName: e.target.value })} 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-[#434651] mb-1.5 block">Business Category</label>
                              <select 
                                required 
                                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors" 
                                onChange={e => setBusinessData({ ...businessData, subCategory: e.target.value })}
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
                              placeholder="Tell customers about your business..." 
                              required 
                              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors resize-none" 
                              onChange={e => setBusinessData({ ...businessData, description: e.target.value })} 
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#434651] mb-1.5 block">Business Address</label>
                            <input 
                              type="text" 
                              placeholder="123 Luxury Lane" 
                              required 
                              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors" 
                              onChange={e => setBusinessData({ ...businessData, businessAddress: e.target.value })} 
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-[#434651] mb-1.5 block">City</label>
                              <input 
                                type="text" 
                                placeholder="London" 
                                required 
                                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors" 
                                onChange={e => setBusinessData({ ...businessData, city: e.target.value })} 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-[#434651] mb-1.5 block">Contact Phone</label>
                              <input 
                                type="text" 
                                placeholder="+44 7700 900077" 
                                required 
                                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors" 
                                onChange={e => setBusinessData({ ...businessData, phone: e.target.value })} 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-[#434651] mb-1.5 block">Tax Number</label>
                              <input 
                                type="text" 
                                placeholder="TX-998877" 
                                required 
                                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors" 
                                onChange={e => setBusinessData({ ...businessData, taxNumber: e.target.value })} 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-[#434651] mb-1.5 block">NIC Number</label>
                              <input 
                                type="text" 
                                placeholder="NIC-19928877" 
                                required 
                                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors" 
                                onChange={e => setBusinessData({ ...businessData, nicNumber: e.target.value })} 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-[#434651] mb-1.5 block">WhatsApp Number</label>
                              <input 
                                type="text" 
                                placeholder="+44 7700 900088" 
                                required 
                                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors" 
                                onChange={e => setBusinessData({ ...businessData, whatsappNumber: e.target.value })} 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-[#434651] mb-1.5 block">Business Tax File Image</label>
                              <input 
                                type="file" 
                                accept="image/*"
                                required 
                                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-1.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors" 
                                onChange={e => setTaxFile(e.target.files[0])} 
                              />
                            </div>
                          </div>

                          <button type="submit" className="w-full mt-4 bg-[#002155] hover:bg-[#001a44] text-white p-3 rounded-xl font-medium transition-colors shadow-sm">
                            Register Business & Upgrade
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Security Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full">
                      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-4 mb-6">
                        <svg className="w-5 h-5 text-[#434651]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-[#191C1E] text-lg font-bold">Security</span>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-bold text-[#434651] mb-1.5 block">Current Password</label>
                          <input
                            type="password"
                            placeholder="Enter current password"
                            value={formData.currentPassword}
                            onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                            className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-[#434651] mb-1.5 block">New Password</label>
                            <input
                              type="password"
                              placeholder="Enter new password"
                              value={formData.newPassword}
                              onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-[#434651] mb-1.5 block">Confirm New Password</label>
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              value={formData.confirmNewPassword}
                              onChange={e => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg p-2.5 text-sm text-[#191C1E] outline-none focus:bg-white focus:ring-1 focus:ring-[#002155] transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex justify-end gap-4 mt-2">
                      <button
                        onClick={() => alert('Profile changes saved successfully!')}
                        className="py-2.5 px-6 rounded-lg bg-[#002155] hover:bg-[#001a44] text-white text-sm font-semibold tracking-wide transition-colors shadow-sm"
                      >
                        Save Changes
                      </button>
                    </div>

                  </div>

                  {/* Right Column (Preferences & Activity) */}
                  <div className="col-span-1 flex flex-col gap-6 w-full">

                    {/* Preferences Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full">
                      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-4 mb-6">
                        <svg className="w-5 h-5 text-[#434651]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="text-[#191C1E] text-lg font-bold">Preferences</span>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-[#191C1E]">Email Notifications</p>
                            <p className="text-xs text-[#434651] mt-0.5">Receive daily summaries.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 outline-none ${preferences.emailNotifications ? 'bg-[#0058BC]' : 'bg-[#E5E7EB]'
                              }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                              }`}>
                              {preferences.emailNotifications && (
                                <svg className="w-2.5 h-2.5 text-[#0058BC]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-[#191C1E]">Push Notifications</p>
                            <p className="text-xs text-[#434651] mt-0.5">Instant updates on app.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreferences({ ...preferences, pushNotifications: !preferences.pushNotifications })}
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 outline-none ${preferences.pushNotifications ? 'bg-[#0058BC]' : 'bg-[#E5E7EB]'
                              }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${preferences.pushNotifications ? 'translate-x-6' : 'translate-x-0'
                              }`}>
                              {preferences.pushNotifications && (
                                <svg className="w-2.5 h-2.5 text-[#0058BC]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-[#191C1E]">SMS Alerts</p>
                            <p className="text-xs text-[#434651] mt-0.5">For critical booking updates.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreferences({ ...preferences, smsAlerts: !preferences.smsAlerts })}
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 outline-none ${preferences.smsAlerts ? 'bg-[#0058BC]' : 'bg-[#E5E7EB]'
                              }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${preferences.smsAlerts ? 'translate-x-6' : 'translate-x-0'
                              }`}>
                              {preferences.smsAlerts && (
                                <svg className="w-2.5 h-2.5 text-[#0058BC]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full">
                      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-6">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-[#434651]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <span className="text-[#191C1E] text-lg font-bold">Recent Activity</span>
                        </div>
                        <button className="text-[#0058BC] text-xs font-bold hover:underline" onClick={() => alert('All activities marked as read.')}>Mark all read</button>
                      </div>

                      <div className="space-y-6">
                        {/* Item 1 */}
                        <div className="flex gap-3">
                          <div className="flex items-center justify-center rounded-full bg-[#E6F4EA] text-[#137333] w-9.5 h-9.5 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-[#191C1E] leading-relaxed"><span className="font-bold">Vendor confirmed your booking</span> for the Gala Event.</p>
                            <p className="text-[10px] text-[#434651] mt-1">2 hours ago</p>
                          </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex gap-3">
                          <div className="flex items-center justify-center rounded-full bg-[#E8F0FE] text-[#1A73E8] w-9.5 h-9.5 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-[#191C1E] leading-relaxed"><span className="font-bold">New message</span> from Elite Catering regarding menu options.</p>
                            <p className="text-[10px] text-[#434651] mt-1">5 hours ago</p>
                          </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex gap-3">
                          <div className="flex items-center justify-center rounded-full bg-[#FEF7E0] text-[#B06000] w-9.5 h-9.5 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-[#191C1E] leading-relaxed"><span className="font-bold">Payment reminder</span>: Invoice #4092 is due tomorrow.</p>
                            <p className="text-[10px] text-[#434651] mt-1">1 day ago</p>
                          </div>
                        </div>

                        {/* Item 4 */}
                        <div className="flex gap-3">
                          <div className="flex items-center justify-center rounded-full bg-[#F1F3F4] text-[#5F6368] w-9.5 h-9.5 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-[#191C1E] leading-relaxed"><span className="font-bold">System Update</span>: New budget tracking features available.</p>
                            <p className="text-[10px] text-[#434651] mt-1">2 days ago</p>
                          </div>
                        </div>
                      </div>

                      <button className="mt-6 w-full py-2 px-4 rounded-lg border border-[#E5E7EB] text-[#002155] text-xs font-semibold hover:bg-gray-50 transition-colors" onClick={() => alert('Redirecting to activity log...')}>
                        View All Activity
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {activeSubView !== 'profile' && activeSubView !== 'settings' && (
              <div className="bg-white p-12 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full text-center text-gray-500 font-semibold">
                Tab "{activeSubView.toUpperCase()}" is coming soon.
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col items-start absolute top-20 left-0 border-r border-[#E5E7EB] bg-white w-64 h-[calc(100vh-80px)] overflow-y-auto pb-24">
        <div className="flex pb-4 flex-col items-start w-full">
          <div className="flex py-0 px-2 justify-end items-start w-full">
            <button className="flex p-2 justify-center items-center rounded-lg hover:bg-gray-50">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#434651" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex pb-8 flex-col items-start w-full">
          <div className="flex pt-0 pr-2 pb-2 pl-2 flex-col items-start w-full">
            <div className="flex items-center gap-4 w-full px-2">
              <div className="w-12 h-12 rounded-full bg-[#d0d5dc] flex items-center justify-center text-base font-bold text-gray-700">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-[#191C1E] text-sm font-bold leading-5 tracking-[0.05em] truncate">{user?.username || 'Alex Sterling'}</p>
                <p className="text-[#434651] text-xs leading-5 tracking-[0.05em] capitalize">{user?.role === 'seller' ? 'Seller Hub' : 'Premium Planner'}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col items-start gap-1 w-full">
          {menuItems.map((item, index) => {
            const isActive = (item.view === 'profile' && activeSubView === 'profile') || (item.view === 'settings' && activeSubView === 'settings') || (activeSubView === item.view);
            return (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className={`flex py-3 px-4 items-center gap-3 w-full text-left transition-colors ${isActive ? 'bg-[#1070E8] text-white' : 'hover:bg-gray-50 text-[#434651]'
                  }`}
              >
                <span className={`text-sm font-semibold leading-5 tracking-[0.05em]`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
