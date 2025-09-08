// frontend/lib/api.ts

// URL của backend server. Sử dụng biến môi trường để linh hoạt.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Hàm chung để gọi API từ backend
 * @param endpoint Đường dẫn API, ví dụ: '/genres'
 * @returns Dữ liệu JSON từ API hoặc null nếu có lỗi
 */
export async function fetchAPI(endpoint: string) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Network error fetching API:', error);
    return null;
  }
}
