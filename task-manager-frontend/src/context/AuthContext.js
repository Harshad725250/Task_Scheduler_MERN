// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/auth/";

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser({ username: "User" });
          }

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        } catch (error) {
          console.error("Failed to load user from token:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const register = async (username, email, password) => {
    try {
      const res = await axios.post(`${API_URL}register`, {
        username,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.data._id,
          username: res.data.username,
          email: res.data.email,
        })
      );
      setUser({
        _id: res.data._id,
        username: res.data.username,
        email: res.data.email,
      });
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      return { success: true };
    } catch (error) {
      console.error(
        "Registration error:",
        error.response ? error.response.data : error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.data._id,
          username: res.data.username,
          email: res.data.email,
        })
      );
      setUser({
        _id: res.data._id,
        username: res.data.username,
        email: res.data.email,
      });
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      return { success: true };
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const authContextValue = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
