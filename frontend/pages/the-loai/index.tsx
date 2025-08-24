import { useEffect, useMemo, useState } from "react";
import type { Category } from "../../types/category";
import CategoryCard from "../../components/CategoryCard";
import CategoryFilterBar, { type FilterState } from "../../components/CategoryFilterBar";
import Pagination from "../../components/Pagination";
import raw from "../../data/categories.json";

const ALL: Category[] = raw as unknown as Category[];
const PAGE_SIZE = 12;

export default function CategoriesPage() {
  // SSR-safe: không đụng localStorage khi render server
  const [filters, setFilters] = useState<FilterState>({
    q: "",
    parentId: "all",
    activeOnly: false,
    sort: "name-asc",
  });
  const [page, setPage] = useState(1);

  // Khôi phục filter từ localStorage (client)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cat_filters");
      if (raw) setFilters(JSON.parse(raw));
    } catch {}
  }, []);

  // Lưu filter
  useEffect(() => {
    try {
      localStorage.setItem("cat_filters", JSON.stringify(filters));
    } catch {}
  }, [filters]);

  // Reset page khi filter thay đổi
  useEffect(() => { setPage(1); }, [filters.q, filters.parentId, filters.activeOnly, filters.sort]);

  const byId = useMemo(() => new Map(ALL.map((c) => [c.id, c])), []);
  const parents = useMemo(() => ALL.filter((c) => !c.parentId), []);
  const parentNameOf = (c: Category) => (c.parentId ? byId.get(c.parentId)?.name : undefined);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    let list = ALL.filter((c) => {
      if (filters.activeOnly && !c.isActive) return false;
      if (filters.parentId !== "all") {
        if (!(c.parentId === filters.parentId || c.id === filters.parentId)) return false;
      }
      if (!q) return true;

      const hay = [
        c.name,
        c.slug,
        c.description || "",
        ...c.tags,
      ].join(" ").toLowerCase();

      return hay.includes(q);
    });

    switch (filters.sort) {
      case "name-asc": list = list.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case "name-desc": list = list.sort((a,b)=>b.name.localeCompare(a.name)); break;
      case "items-desc": list = list.sort((a,b)=>b.itemsCount - a.itemsCount); break;
      case "updated-desc": list = list.sort((a,b)=> +new Date(b.updatedAt) - +new Date(a.updatedAt)); break;
    }
    return list;
  }, [filters]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-2 text-2xl font-bold">Thể loại</h1>

      <CategoryFilterBar
        state={filters}
        onChange={(patch) => setFilters((s) => ({ ...s, ...patch }))}
        parents={parents}
        total={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
          Không có kết quả phù hợp.
          <div className="mt-3">
            <button
              className="rounded-lg border px-3 py-2"
              onClick={() => setFilters({ q: "", parentId: "all", activeOnly: false, sort: "name-asc" })}
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Danh sách thể loại">
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
  );
}
