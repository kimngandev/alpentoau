import { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "../../contexts/AuthContext"
import { FiBookmark, FiClock, FiSettings, FiLogOut } from "react-icons/fi"

// Dữ liệu giả cho Tủ sách
const bookmarkedStories = [
    { slug: 'ma-dao-to-su', title: 'Ma Đạo Tổ Sư', imageUrl: '/images/madaotosu.jpg', currentChapter: 'Chương 15', lastRead: '2 giờ trước'},
    // Thêm các truyện khác...
]

const UserSidebar = ({ user, onLogout }) => (
    <div className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
            <Image src={user.avatarUrl || '/images/default-avatar.png'} alt="Avatar" width={80} height={80} className="rounded-full" />
            <h2 className="text-xl font-bold mt-4 text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
        <nav className="mt-8 space-y-2">
            <Link href="/user/tu-sach" className="flex items-center gap-3 px-4 py-2 text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-gray-700 rounded-lg">
                <FiBookmark /> Tủ sách
            </Link>
            <Link href="/user/lich-su" className="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiClock /> Lịch sử đọc
            </Link>
            <Link href="/user/cai-dat" className="flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiSettings /> Cài đặt tài khoản
            </Link>
             <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiLogOut /> Đăng xuất
            </button>
        </nav>
    </div>
)

export default function UserBookshelfPage() {
    const { user, logout, isAuthenticated } = useAuth()
    
    // NOTE: Cần có logic chuyển hướng nếu người dùng chưa đăng nhập
    if (!isAuthenticated || !user) {
        // Hoặc có thể dùng useEffect để redirect
        return <div className="text-center py-20">Vui lòng <Link href="/login" className="text-indigo-500">đăng nhập</Link> để xem tủ sách.</div>
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-theme(space.20))]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <UserSidebar user={user} onLogout={logout} />

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Tủ sách của tôi</h1>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {bookmarkedStories.map(story => (
                                <div key={story.slug}>
                                    <Link href={`/truyen/${story.slug}`} className="group block">
                                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-md">
                                            <Image
                                                src={story.imageUrl}
                                                alt={story.title}
                                                fill
                                                className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                    </Link>
                                    <div className="mt-2">
                                        <Link href={`/truyen/${story.slug}`} className="font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-500">{story.title}</Link>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{story.currentChapter}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getStaticProps: GetServerSideProps = async ({ locale }) => ({
    props: { ...(await serverSideTranslations(locale ?? 'vi', ['common'])) },
});