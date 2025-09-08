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
    if (!username || !email || !password) {
      setState({ loading: false, error: 'Vui lòng điền đủ thông tin.' });
      return;
    }
    if (password !== confirm) {
      setState({ loading: false, error: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    setState({ loading: true });
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const msg = (await res.text()) || 'Đăng ký thất bại';
        setState({ loading: false, error: msg });
        return;
      }
      setState({ loading: false, success: 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.' });
      setPassword('');
      setConfirm('');
    } catch (err) {
      setState({ loading: false, error: 'Lỗi mạng. Vui lòng thử lại.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0418]">
      <Head>
        <title>Đăng ký</title>
      </Head>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Tạo tài khoản</h1>
        <form onSubmit={onSubmit} className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          {state.error && (
            <div className="rounded-md bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200 p-3 text-sm">{state.error}</div>
          )}
          {state.success && (
            <div className="rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 p-3 text-sm">{state.success}</div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Tên người dùng</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={state.loading}
            className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 disabled:opacity-60"
          >
            {state.loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Đã có tài khoản?{' '}
            <Link className="text-purple-600 hover:underline" href="/login">Đăng nhập</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}


