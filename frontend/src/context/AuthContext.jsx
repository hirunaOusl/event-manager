import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const savedToken = localStorage.getItem('token');
  
  if (savedToken) {
    setToken(savedToken);
    fetchProfile(savedToken); // Pass it directly to avoid state race conditions
  } else {
    setLoading(false); // No token? Stop loading and show the login form immediately
  }
}, []);

const fetchProfile = async (currentToken) => {
  const tokenToUse = currentToken || token;
  if (!tokenToUse) {
    setLoading(false);
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${tokenToUse}` }
    });
    
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    } else {
      logout(); // Token was invalid/expired, clear it out
    }
  } catch (err) {
    console.error("Profile fetch failed:", err);
  } finally {
    setLoading(false);
  }
};

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const updateRoleToSeller = (updatedUser, newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateRoleToSeller }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};