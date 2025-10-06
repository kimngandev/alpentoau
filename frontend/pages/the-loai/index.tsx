import { useEffect, useMemo, useState } from "react";
import type { Category } from "../../types/category";
import CategoryCard from "../../components/CategoryCard";
import CategoryFilterBar, { type FilterState as BarFilterState } from "../../components/CategoryFilterBar";
import Pagination from "../../components/Pagination";
import raw from "../../data/categories.json";
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ALL: Category[] = raw as unknown as Category[];
const PAGE_SIZE = 12;

// Local filter state for this page
type PageFilters = {
  q: string;
  parentId: string | "all";
  activeOnly: boolean;
  sort: "name-asc" | "name-desc" | "items-desc" | "updated-desc";
};

// Helper functions (logic không thay đổi)
const parentNameOf = (cat: Category) => ALL.find((c) => c.id === cat.parentId)?.name;
const mapSortByToSort = (sortBy: BarFilterState["sortBy"]): PageFilters["sort"] => {
  if (sortBy === "name-asc") return "name-asc";
  if (sortBy === "name-desc") return "name-desc";
  if (sortBy === "items-desc") return "items-desc";
  return "name-asc"; // fallback
};

export default function CategoriesPage() {
  const [filters, setFilters] = useState<PageFilters>({
    q: "",
    parentId: "all",
    activeOnly: false,
    sort: "name-asc",
  });
  const [page, setPage] = useState(1);

  // Logic khôi phục và lưu filter không thay đổi
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cat_filters");
      if (raw) setFilters(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cat_filters", JSON.stringify(filters));
    } catch (e) {}
    setPage(1);
  }, [filters]);

  // Logic lọc và sắp xếp không thay đổi
  const filtered = useMemo<Category[]>(() => {
    let result = ALL;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (filters.parentId !== "all") {
      result = result.filter((c) => c.parentId === filters.parentId);
    }
    if (filters.activeOnly) {
      result = result.filter((c) => c.itemsCount > 0);
    }
    result.sort((a, b) => {
      if (filters.sort === "name-asc") return a.name.localeCompare(b.name);
      if (filters.sort === "name-desc") return b.name.localeCompare(a.name);
      if (filters.sort === "items-desc") return b.itemsCount - a.itemsCount;
      return 0;
    });
    return result;
  }, [filters]);

  // Logic phân trang không thay đổi
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    // === CẢI THIỆN: Thêm background cho toàn bộ trang để đảm bảo độ tương phản ===
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <main className="space-y-8">
          {/* Tiêu đề và mô tả với màu sắc phù hợp cho cả 2 theme */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
              Khám Phá Thể Loại
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Tìm kiếm thể loại truyện yêu thích của bạn từ kho tàng đa dạng của chúng tôi.
            </p>
          </div>

          <CategoryFilterBar
            value={{ q: filters.q, parentId: "all", status: "all" }}
            onFilterChange={(patch) => {
              if (patch.q !== undefined) {
                setFilters((s) => ({ ...s, q: patch.q! }));
              }
              if (patch.sortBy) {
                setFilters((s) => ({ ...s, sort: mapSortByToSort(patch.sortBy!) }));
              }
            }}
          />

          {filtered.length === 0 ? (
            // Giao diện khi không có kết quả, với màu sắc phù hợp
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center mt-8">
              <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Không tìm thấy thể loại phù hợp</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Vui lòng thử lại với từ khóa khác hoặc làm mới bộ lọc.
              </p>
              <div className="mt-6">
                <button
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => setFilters({ q: "", parentId: "all", activeOnly: false, sort: "name-asc" })}
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4" aria-label="Danh sách thể loại">
                {paged.map((cat) => (
                  <CategoryCard key={cat.id} category={cat} parentName={parentNameOf(cat)} />
                ))}
              </section>

              <Pagination
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// Logic getStaticProps không thay đổi
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
    },
  };
};

