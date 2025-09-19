// frontend/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (userData: User, token?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hàm kiểm tra token có hợp lệ không
  const validateToken = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return {
          id: userData.id.toString(),
          name: userData.username,
          email: userData.email,
          role: userData.role,
          avatarUrl: userData.avatar || '/images/default-avatar.png',
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  // Khôi phục session khi tải trang
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          // Kiểm tra token có còn hợp lệ không
          const userData = await validateToken(storedToken);
          
          if (userData) {
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token không hợp lệ, xóa dữ liệu cũ
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Xóa dữ liệu không hợp lệ
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Hàm đăng nhập
  const login = useCallback((userData: User, authToken?: string) => {
    // Lưu thông tin user
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    // Lưu token nếu có
    if (authToken) {
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
    }
  }, []);

  // Hàm đăng xuất
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
    router.push('/');
  }, [router]);

  // Tạo context value
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      token,
      login,
      logout,
      loading,
    }),
    [user, token, loading, login, logout]
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

// Hook để lấy token cho API calls
export const useAuthToken = () => {
  const { token } = useAuth();
  return token;
};

// Helper function để tạo headers có authentication
export const createAuthHeaders = (token: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};