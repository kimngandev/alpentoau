type Props = {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
  
  export default function Pagination({ totalItems, pageSize, currentPage, onPageChange }: Props) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const go = (p: number) => onPageChange(Math.min(totalPages, Math.max(1, p)));
    if (totalPages <= 1) return null;
  
    const base = new Set<number>([1, currentPage - 1, currentPage, currentPage + 1, totalPages]);
    const pages = [...base].filter(n => n >= 1 && n <= totalPages).sort((a,b)=>a-b);
  
    const withDots: (number | "...")[] = [];
    for (let i = 0; i < pages.length; i++) {
      withDots.push(pages[i]);
      if (i < pages.length - 1 && pages[i + 1] - pages[i] > 1) withDots.push("...");
    }
  
    return (
      <nav className="mt-6 flex justify-center gap-2" role="navigation" aria-label="Phân trang">
        <button
          className="rounded-lg border px-3 py-2 disabled:opacity-50"
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
        >
          ‹
        </button>
  
        {withDots.map((p, i) =>
          p === "..." ? (
            <span key={`d-${i}`} className="px-2">…</span>
          ) : (
            <button
              key={p}
              className={`rounded-lg border px-3 py-2 ${p === currentPage ? "font-semibold ring-2 ring-indigo-300" : ""}`}
              onClick={() => go(p)}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
  
        <button
          className="rounded-lg border px-3 py-2 disabled:opacity-50"
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Trang sau"
        >
          ›
        </button>
      </nav>
    );
  }
  