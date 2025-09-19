// frontend/pages/register.tsx
'use client';

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import CosmicBackground from '../components/CosmicBackground';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type SubmitState = {
  loading: boolean;
  error?: string;
  success?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const [state, setState] = useState<SubmitState>({ loading: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watch password để validate confirm password
  const watchPassword = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setState({ loading: true, error: '', success: '' });

    try {
      console.log('🚀 Attempting registration with API URL:', API_URL);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          username: data.username.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Đăng ký thất bại';
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
            
            // Xử lý lỗi validation từ backend
            if (Array.isArray(errorData.message)) {
              errorMessage = errorData.message.join(', ');
            }
          } else {
            errorMessage = await response.text() || errorMessage;
          }
        } catch (parseError) {
          console.error('❌ Error parsing response:', parseError);
          errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        }

        setState({ loading: false, error: errorMessage });
        return;
      }

      const result = await response.json();
      console.log('✅ Registration successful:', result);

      setState({ 
        loading: false, 
        success: result.message || 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.' 
      });

      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        router.push('/login?message=registration_success');
      }, 2000);

    } catch (error) {
      console.error('💥 Registration network error:', error);
      
      let errorMessage = 'Lỗi kết nối';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = `Không thể kết nối tới server backend.
        
Vui lòng kiểm tra:
• Server backend có đang chạy tại ${API_URL}?
• Cài đặt CORS đã đúng chưa?
• Firewall có chặn kết nối không?`;
      }

      setState({ loading: false, error: errorMessage });
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
            <h1 className="text-3xl font-bold text-white">Tạo tài khoản mới</h1>
            <p className="text-gray-400 mt-2">Tham gia cộng đồng đọc truyện</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="text-sm font-medium text-gray-300">Tên người dùng</label>
              <div className="relative mt-1">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  {...register('username', { 
                    required: 'Vui lòng nhập tên người dùng',
                    minLength: { value: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự' },
                    maxLength: { value: 20, message: 'Tên người dùng không được quá 20 ký tự' },
                    pattern: { 
                      value: /^[a-zA-Z0-9_]+$/, 
                      message: 'Tên người dùng chỉ được chứa chữ, số và dấu gạch dưới' 
                    }
                  })}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="username123"
                  disabled={state.loading}
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative mt-1">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Vui lòng nhập email',
                    pattern: { 
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                      message: 'Email không hợp lệ' 
                    }
                  })}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="example@email.com"
                  disabled={state.loading}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', { 
                    required: 'Vui lòng nhập mật khẩu',
                    minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                    maxLength: { value: 50, message: 'Mật khẩu không được quá 50 ký tự' }
                  })}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Mật khẩu của bạn"
                  disabled={state.loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="text-sm font-medium text-gray-300">Xác nhận mật khẩu</label>
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword', { 
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: value => value === watchPassword || 'Mật khẩu xác nhận không khớp'
                  })}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder="Nhập lại mật khẩu"
                  disabled={state.loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Error & Success Messages */}
            {state.error && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm whitespace-pre-line">{state.error}</p>
              </div>
            )}

            {state.success && (
              <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-sm">{state.success}</p>
              </div>
            )}

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-gray-400">Đã có tài khoản? </span>
              <Link href="/login" className="font-medium text-purple-400 hover:underline">
                Đăng nhập ngay
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={state.loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100"
            >
              {state.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang đăng ký...
                </>
              ) : (
                <>
                  <FiUserPlus /> Tạo tài khoản
                </>
              )}
            </button>
          </form>

          {/* Debug Info (chỉ hiển thị trong development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
              <p className="text-blue-300 text-xs text-center mb-2">Debug Info (Development only):</p>
              <p className="text-blue-200 text-xs text-center">API URL: {API_URL}</p>
              <p className="text-blue-200 text-xs text-center">
                Server: {API_URL.includes('localhost') ? 'Local' : 'Remote'}
              </p>
            </div>
          )}
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