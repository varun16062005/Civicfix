import { createContext, useContext, useState, useEffect } from "react";
import { getStoredUser, saveUser, clearUser } from "../services/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple authentication - in production, this would call your backend
    const adminCredentials = {
      email: "admin@civicfix.com",
      password: "admin123",
    };

    if (email === adminCredentials.email && password === adminCredentials.password) {
      const userData = {
        email: email,
        role: "admin",
        name: "Alex Rivera",
        title: "Senior Coordinator",
      };
      saveUser(userData);
      setUser(userData);
      return { success: true, user: userData };
    }

    // Regular user login (no password required for demo)
    const userData = {
      email: email,
      role: "user",
      name: email.split("@")[0],
    };
    saveUser(userData);
    setUser(userData);
    return { success: true, user: userData };
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
