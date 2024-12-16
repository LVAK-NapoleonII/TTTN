import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Tạo Context
const AuthContext = createContext();

// Provider cho Context
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAuth({
          token,
          user: {
            id: payload.jti,
            username: payload.sub,
            role: payload.role,
            name: payload.name,
          },
        });
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        localStorage.removeItem("token");
        setAuth({ token: null, user: null });
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    setAuth({
      token,
      user: {
        id: payload.jti,
        username: payload.sub,
        role: payload.role,
        name: payload.name,
      },
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
    navigate("/Login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
