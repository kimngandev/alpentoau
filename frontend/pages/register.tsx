// frontend/pages/register.tsx
'use client';

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type SubmitState = {
  loading: boolean;
  error?: string;
  success?: string;
};

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState<SubmitState>({ loading: false });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!username || !email || !password) {
      setState({ loading: false, error: 'Vui lòng điền đủ thông tin.' });
      return;
    }
    
    if (username.length < 3) {
      setState({ loading: false, error: 'Tên người dùng phải có ít nhất 3 ký tự.' });
      return;
    }
    
    if (password.length < 6) {
      setState({ loading: false, error: 'Mật khẩu phải có ít nhất 6 ký tự.' });
      return;
    }
    
    if (password !== confirm) {
      setState({ loading: false, error: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    setState({ loading: true, error: undefined });
    
    try {
      console.log('Sending request to:', `${API_URL}/auth/register`);
      console.log('Request body:', { username, email, password });
      
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      if (!res.ok) {
        let errorMessage = 'Đăng ký thất bại';
        
        try {
          const errorData = await res.json();
          console.log('Error response:', errorData);
          
          if (errorData.message) {
            if (Array.isArray(errorData.message)) {
              errorMessage = errorData.message.join(', ');
            } else {
              errorMessage = errorData.message;
            }
          }
        } catch (parseError) {
          // Nếu không parse được JSON, dùng text
          const errorText = await res.text();
          console.log('Error text:', errorText);
          errorMessage = errorText || `Lỗi ${res.status}`;
        }
        
        setState({ loading: false, error: errorMessage });
        return;
      }

      const data = await res.json();
      console.log('Success response:', data);
      
      setState({ 
        loading: false, 
        success: 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.',
        error: undefined 
      });
      
      // Reset form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirm('');
      
    } catch (err) {
      console.error('Network error:', err);
      setState({ loading: false, error: 'Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0418]">
      <Head>
        <title>Đăng ký</title>
      </Head>
    
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Tạo tài khoản</h1>
        
        <form onSubmit={onSubmit} className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          {state.error && (
            <div className="rounded-md bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200 p-3 text-sm">
              {state.error}
            </div>
          )}
          {state.success && (
            <div className="rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 p-3 text-sm">
              {state.success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Tên người dùng
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              placeholder="Ít nhất 3 ký tự"
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              placeholder="Ít nhất 6 ký tự"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              placeholder="Nhập lại mật khẩu"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={state.loading}
            className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2.5 transition-colors"
          >
            {state.loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Đã có tài khoản?{' '}
            <Link className="text-purple-600 hover:underline" href="/login">
              Đăng nhập
            </Link>
          </p>
        </form>
      </main>
      
    </div>
  );
}