// frontend/pages/login.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import CosmicBackground from '../components/CosmicBackground';
import { useAuth } from '../contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError('');
    
    try {
      // Gọi API backend thực tế
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        setApiError(errorData || 'Đăng nhập thất bại. Vui lòng thử lại.');
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      
      // Lưu token vào localStorage
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
      }

      // Tạo userData với đầy đủ thông tin cho avatar
      const userData = {
        id: result.user.id.toString(),
        name: result.user.username,
        email: result.user.email,
        role: result.user.role,
        avatarUrl: result.user.avatar || `/images/default-avatar.png`, // Fallback avatar
      };

      // Đăng nhập user
      login(userData);
      
      // Chuyển hướng dựa trên role
      if (result.user.role === 'ADMIN') {
        router.push('/admin');
      } else if (result.user.role === 'WRITER') {
        router.push('/tac-gia/truyen');
      } else {
        router.push('/user/tu-sach');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setApiError('Lỗi kết nối mạng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 w-full h-full">
        <CosmicBackground />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Chào mừng trở lại</h1>
            <p className="text-gray-400 mt-2">Đăng nhập để tiếp tục cuộc phiêu lưu</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative mt-1">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  {...register('email', { required: 'Vui lòng nhập email' })}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            
            {apiError && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm text-center">{apiError}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <Link href="/register" className="font-medium text-indigo-400 hover:underline">
                Tạo tài khoản mới
              </Link>
              <Link href="/forgot-password" className="font-medium text-gray-400 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <FiLogIn /> Đăng nhập
                </>
              )}
            </button>
          </form>

          {/* Demo credentials for testing */}
          <div className="mt-6 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
            <p className="text-blue-300 text-xs text-center mb-2">Tài khoản demo để test:</p>
            <p className="text-blue-200 text-xs text-center">Email: test@example.com</p>
            <p className="text-blue-200 text-xs text-center">Password: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetServerSideProps = async ({ locale }) => ({
  props: { 
    ...(await serverSideTranslations(locale ?? 'vi', ['common'])) 
  },
});