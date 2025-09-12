import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import CosmicBackground from '../components/CosmicBackground';
import { useAuth } from '../contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const onSubmit = (data) => {
    // Giả lập logic đăng nhập
    if (data.email === "test@example.com" && data.password === "123456") {
      const userData = { id: '1', name: 'Alpento', email: data.email, avatarUrl: '/images/default-avatar.png' };
      login(userData);
      router.push('/user/tu-sach');
    } else {
      setApiError('Email hoặc mật khẩu không chính xác.');
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
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message as string}</p>}
            </div>
            
            {apiError && <p className="text-red-400 text-sm text-center">{apiError}</p>}
            
            <div className="flex items-center justify-between text-sm">
                <Link href="/register" className="font-medium text-indigo-400 hover:underline">Tạo tài khoản mới</Link>
                <Link href="/forgot-password" className="font-medium text-gray-400 hover:underline">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-purple-400 text-white font-semibold hover:bg-purple-500
             transition-transform hover:scale-105">
              <FiLogIn /> Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetServerSideProps = async ({ locale }) => ({
    props: { ...(await serverSideTranslations(locale ?? 'vi', ['common'])) },
});
