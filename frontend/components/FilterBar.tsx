export default function FilterBar({ keyword, onChange }: { keyword: string, onChange: (v: string) => void }) {
  return (
    <div className="my-6 relative">
      <i className="ri-search-line absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 text-xl"></i>
      <input
        type="text"
        placeholder="Tìm kiếm truyện..."
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400 rounded-full shadow-sm focus:outline-none transition"
      />
    </div>
  )
}