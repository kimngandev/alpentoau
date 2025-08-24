import { useRouter } from "next/router";
import raw from "../../data/categories.json";
import type { Category } from "../../types/category";
import CategoryCard from "../../components/CategoryCard";

const ALL: Category[] = raw as unknown as Category[];

export default function CategorySlugPage() {
  const { query } = useRouter();
  const slug = String(query.slug || "");
  const cat = ALL.find((c) => c.slug === slug);

  if (!slug) return null;
  if (!cat) return <main className="mx-auto max-w-6xl px-4 py-6">Không tìm thấy thể loại.</main>;

  // Nếu là parent -> hiển thị các child
  const children = ALL.filter((c) => c.parentId === cat.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold">{cat.name}</h1>
      {cat.description && (
        <p className="mb-4 text-slate-600 dark:text-slate-300">{cat.description}</p>
      )}

      {children.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((c) => (
            <CategoryCard key={c.id} category={c} parentName={cat.name} />
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-dashed p-6">
          Ở đây sau này bạn có thể hiển thị danh sách truyện thuộc thể loại <b>{cat.name}</b>.
        </div>
      )}
    </main>
  );
}
