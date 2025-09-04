// frontend/pages/tac-gia/truyen/moi.tsx

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AuthorLayout from '../../../components/AuthorLayout';
import { useForm } from 'react-hook-form';
import { RiUploadCloud2Line } from 'react-icons/ri';

export default function NewStoryPage() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        alert('Đã gửi truyện để chờ duyệt!');
    };

    return (
        <AuthorLayout>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Đăng truyện mới</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên truyện</label>
                    <input {...register('title')} className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
                    <textarea {...register('description')} rows={5} className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"></textarea>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ảnh bìa</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <RiUploadCloud2Line className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">Kéo thả file hoặc click để tải lên</p>
                        </div>
                    </div>
                </div>
                <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">Đăng truyện</button>
            </form>
        </AuthorLayout>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: { ...(await serverSideTranslations(locale ?? 'vi', ['common'])) },
});
