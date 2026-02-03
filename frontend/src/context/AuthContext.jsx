import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (email, password) => {
    // Demo admin login
    const adminCredentials = {
      email: "admin@civicfix.com",
      password: "admin123",
    };

    if (email === adminCredentials.email && password === adminCredentials.password) {
      const userData = {
        email,
        role: "admin",
        name: "Alex Rivera",
        title: "Senior Coordinator",
      };
      setUser(userData);
      return { success: true, user: userData };
    }

    // Demo regular user
    const userData = {
      email,
      role: "user",
      name: email.split("@")[0],
    };
    setUser(userData);
    return { success: true, user: userData };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => user?.role === "admin";

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
