import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';
import { 
  RiUserLine, 
  RiBookLine, 
  RiFileTextLine, 
  RiMessageLine,
  RiBookmarkLine,
  RiTrendingUpLine,
  RiEyeLine 
} from 'react-icons/ri';

interface DashboardStats {
  stats: {
    totalUsers: number;
    totalStories: number;
    totalChapters: number;
    totalComments: number;
    totalBookmarks: number;
  };
  recentActivity: {
    users: Array<{
      id: number;
      username: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    stories: Array<{
      id: number;
      title: string;
      status: string;
      createdAt: string;
      author: { username: string };
    }>;
  };
  insights: {
    topAuthors: Array<{
      id: number;
      username: string;
      _count: { stories: number };
    }>;
    popularStories: Array<{
      id: number;
      title: string;
      viewCount: number;
      totalChapters: number;
      author: { username: string };
      _count: { bookmarks: number; ratings: number };
    }>;
  };
}

const StatCard = ({ title, value, icon, color, trend }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
        {trend && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            <RiTrendingUpLine className="inline w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!dashboardData) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Không thể tải dữ liệu dashboard</p>
        </div>
      </AdminLayout>
    );
  }

  const { stats, recentActivity, insights } = dashboardData;

  return (
    <>
      <Head>
        <title>Dashboard - Admin Panel</title>
      </Head>
      
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Làm mới
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              title="Tổng người dùng"
              value={stats.totalUsers}
              icon={<RiUserLine className="w-6 h-6 text-white" />}
              color="bg-blue-500"
              trend="+12% tháng này"
            />
            <StatCard
              title="Tổng truyện"
              value={stats.totalStories}
              icon={<RiBookLine className="w-6 h-6 text-white" />}
              color="bg-green-500"
              trend="+8% tháng này"
            />
            <StatCard
              title="Tổng chương"
              value={stats.totalChapters}
              icon={<RiFileTextLine className="w-6 h-6 text-white" />}
              color="bg-yellow-500"
              trend="+24% tháng này"
            />
            <StatCard
              title="Bình luận"
              value={stats.totalComments}
              icon={<RiMessageLine className="w-6 h-6 text-white" />}
              color="bg-purple-500"
              trend="+15% tháng này"
            />
            <StatCard
              title="Lượt bookmark"
              value={stats.totalBookmarks}
              icon={<RiBookmarkLine className="w-6 h-6 text-white" />}
              color="bg-pink-500"
              trend="+20% tháng này"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Người dùng mới
              </h3>
              <div className="space-y-3">
                {recentActivity.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        user.role === 'AUTHOR' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Stories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Truyện mới
              </h3>
              <div className="space-y-3">
                {recentActivity.stories.map((story) => (
                  <div key={story.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{story.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tác giả: {story.author.username}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        story.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {story.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang ra'}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(story.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Authors */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tác giả hàng đầu
              </h3>
              <div className="space-y-3">
                {insights.topAuthors.map((author, index) => (
                  <div key={author.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-yellow-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {author.username}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {author._count.stories} truyện
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Stories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Truyện phổ biến
              </h3>
              <div className="space-y-3">
                {insights.popularStories.slice(0, 5).map((story) => (
                  <div key={story.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {story.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {story.author.username} • {story.totalChapters} chương
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <RiEyeLine className="w-4 h-4" />
                        <span>{story.viewCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <RiBookmarkLine className="w-4 h-4" />
                        <span>{story._count.bookmarks}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

// Server-side authentication check
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Add authentication check here
  // For now, we'll allow access
  return {
    props: {},
  };
};