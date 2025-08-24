import Link from "next/link";
import type { Category } from "../types/category";

type Props = {
  category: Category;
  parentName?: string;
};

export default function CategoryCard({ category, parentName }: Props) {
  const { name, slug, description, icon, color, isActive, itemsCount } = category;

  return (
    <article
      className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-lg transition"
      style={{ borderLeftWidth: 6, borderLeftColor: color || "#e5e7eb" }}
      aria-labelledby={`cat-${slug}`}
    >
      <header className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-white text-xl"
          style={{ background: color || "#3b82f6" }}
          aria-hidden="true"
        >
          <span>{icon ?? "🏷️"}</span>
        </div>

        <div className="min-w-0">
          <h3 id={`cat-${slug}`} className="truncate font-semibold">
            {name}
          </h3>
          {parentName && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{parentName}</p>
          )}
        </div>

        <span
          className={`ml-auto inline-block h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`}
          title={isActive ? "Đang hoạt động" : "Tạm ngưng"}
        />
      </header>

      {description && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
          {description}
        </p>
      )}

      <footer className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium">{itemsCount.toLocaleString()} items</span>
        <Link
          href={`/the-loai/${slug}`}
          className="text-sm underline underline-offset-4 hover:no-underline"
        >
          Xem
        </Link>
      </footer>
    </article>
  );
}
