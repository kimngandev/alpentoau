// frontend/contexts/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // *** SỬA LỖI: Bọc các hàm trong useCallback ***
  // Điều này đảm bảo các hàm này không bị tạo lại trên mỗi lần render.
  const login = useCallback((userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  }, [router]); // Chỉ tạo lại hàm logout khi router thay đổi

  // *** SỬA LỖI: Loại bỏ `router` khỏi dependency array ***
  // Giờ đây, `value` chỉ được tạo lại khi `user` hoặc `loading` thay đổi.
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading,
    }),
    [user, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
