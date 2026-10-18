type SectionHeaderProps = {
  title: string;
  count: number;
  onSeeAll: () => void;
};

export default function  SectionHeader({ title, count, onSeeAll }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        <span className="bg-indigo-50 text-indigo-500 text-xs font-bold px-2.5 py-1 rounded-full">{count}</span>
      </div>
      <button
        onClick={onSeeAll}
        className="flex items-center gap-1 text-indigo-500 text-sm font-semibold hover:gap-2 transition-all duration-150"
      >
        See all
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}