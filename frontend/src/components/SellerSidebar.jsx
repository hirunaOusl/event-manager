import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function SellerSidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const businessName = user?.businessDetails?.businessName || user?.username || "Artisan Gala Events";

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/seller-dashboard' },
    { name: 'Edit Profile', icon: '⚙️', path: '/business-setting' },
    { name: 'Customer View', icon: '👤', path: '/profile' },
    { name: 'Analytics', icon: '📈', path: '/business-analytics' },
    { name: 'Logout', icon: '↩️', action: 'logout' }
  ];

  const handleMenuClick = (item) => {
    if (item.action === 'logout') {
      logout();
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div
      className={`flex flex-col items-start fixed top-20 left-0 border-r border-[#E5E7EB] bg-white z-30 h-[calc(100vh-80px)] overflow-y-auto pb-24 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'
        }`}
    >
      {/* Collapse/Expand Toggle Row */}
      <div className="flex pb-4 pt-4 flex-col items-start w-full">
        <div className={`flex py-0 px-2 justify-end items-start w-full ${isSidebarOpen ? '' : 'justify-end pr-3.5'}`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex p-2 justify-center items-center rounded-lg hover:bg-gray-50 transition-transform outline-none"
          >
            <svg
              className={`w-4 h-4 text-[#434651] transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Profile summary row */}
      <div className="flex pb-8 flex-col items-start w-full">
        <div className="flex pt-0 pr-2 pb-2 pl-2 flex-col items-start w-full">
          <div className={`flex items-center gap-4 w-full px-2 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-12 h-12 rounded-full bg-[#d0d5dc] flex items-center justify-center text-base font-bold text-gray-700 shrink-0">
              {businessName.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-[#191C1E] text-sm font-bold leading-5 tracking-[0.05em] truncate">{businessName}</p>
                <p className="text-[#434651] text-xs leading-5 tracking-[0.05em] capitalize">Merchant Seller</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex flex-col items-start gap-1 w-full">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className={`flex py-3 px-4 items-center gap-3 w-full text-left transition-colors ${isActive ? 'bg-[#1070E8] text-white font-bold' : 'hover:bg-gray-50 text-[#434651]'
                } ${isSidebarOpen ? '' : 'justify-center'}`}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              {isSidebarOpen && (
                <span className="text-sm font-semibold leading-5 tracking-[0.05em] truncate">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
