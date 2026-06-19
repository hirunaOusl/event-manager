import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import GlobalNavBar from "./components/GlobalNavBar";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/Login";
import BusinessSetting from "./pages/BusinessSetting";
import BusinessAnalytics from "./pages/BusinessAnalytics";

function ProtectedLayout({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F8]">
      {/* Shared NavBar rendered for Home, UserProfile, and Seller Views */}
      {user.role !== 'admin' && <GlobalNavBar />}
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard 1: Home page */}
        <Route path="/" element={
          <ProtectedLayout allowedRoles={['user', 'seller']}><Home /></ProtectedLayout>
        } />

        {/* Dashboard 2: User profile page */}
        <Route path="/profile" element={
          <ProtectedLayout allowedRoles={['user', 'seller']}><UserProfile /></ProtectedLayout>
        } />

        {/* Dashboard 3: Seller Business Dashboard */}
        <Route path="/seller-dashboard" element={
          <ProtectedLayout allowedRoles={['seller']}><SellerDashboard /></ProtectedLayout>
        } />

        {/* Dashboard 4: Isolated Admin System */}
        <Route path="/admin" element={
          <ProtectedLayout allowedRoles={['admin']}><AdminDashboard /></ProtectedLayout>
        } />

        <Route path="/business-setting" element={
          <ProtectedLayout allowedRoles={['seller']}><BusinessSetting /></ProtectedLayout>
        } />

        <Route path="/business-analytics" element={
          <ProtectedLayout allowedRoles={['seller']}><BusinessAnalytics /></ProtectedLayout>
        } />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}