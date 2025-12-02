import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: 'admin' | 'superadmin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (tokenStr: string, userData: User) => {
    setToken(tokenStr);
    setUser(userData);
    localStorage.setItem("token", tokenStr);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, authFetch: async (input, init = {}) => {
      const headers = new Headers(init.headers || {});
      if (token) headers.set('Authorization', `Bearer ${token}`);
      const res = await fetch(input, { ...init, headers });
      return res;
    } }}>
      {children}
    </AuthContext.Provider>
  );
};
