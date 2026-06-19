import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginComponent from "../components/Login";
import RegisterComponent from "../components/Register";

export default function LoginPage() {
  const { user } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (user.role === "seller") {
        navigate("/seller-dashboard", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-[#FBF9F8] px-6 relative py-12"
      style={{
        backgroundImage: "radial-gradient(circle at 10% 20%, rgba(27, 28, 28, 0.03) 0%, transparent 80%)"
      }}
    >
      {/* Decorative top corner accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-50/40 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginComponent toggleView={() => setIsLogin(false)} />
        ) : (
          <RegisterComponent toggleView={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
