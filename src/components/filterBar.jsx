function FilterBar({ filters, onChange, onSearch }) {
  const selects = [
    { key: "type", label: "Type of counseling", options: ["All types", "Individual", "Couples", "Group", "Child"] },
    { key: "city", label: "City", options: ["All Cities", "New York", "Los Angeles", "Chicago", "Houston", "San Diego", "Philadelphia"] },
    { key: "age", label: "Age", options: ["35+", "18–25", "26–35", "46+"] },
    { key: "gender", label: "Gender", options: ["All", "Male", "Female"] },
  ];
  return (
    <div className="bg-white rounded-2xl flex items-center gap-0 shadow-md mt-5 overflow-hidden">
      {selects.map((s, i) => (
        <div key={s.key} className="flex-1 flex items-center">
          <div className="flex-1 px-4 py-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{s.label}</p>
            <select
              value={filters[s.key]}
              onChange={(e) => onChange(s.key, e.target.value)}
              className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
            >
              {s.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          {i < selects.length - 1 && <div className="w-px h-8 bg-gray-100 flex-shrink-0" />}
        </div>
      ))}
      <div className="px-3">
        <button
          onClick={onSearch}
          className="w-11 h-11 bg-indigo-500 hover:bg-indigo-600 active:scale-95 rounded-xl flex items-center justify-center transition-all duration-150"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default FilterBar;