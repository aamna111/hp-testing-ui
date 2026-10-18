import FilterBar from "./filterBar";

function HeroBanner({ filters, onFilterChange, onSearch }) {
  return (
    <div className="relative bg-gradient-to-br from-indigo-500 to-violet-700 rounded-2xl p-7 mb-8 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute right-14 -bottom-16 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
 
      <h2 className="text-white font-bold text-lg mb-1.5 relative z-10">
        Find the best psychologist for yourself!
      </h2>
      <p className="text-white/80 text-sm max-w-md leading-relaxed relative z-10">
        Our specialists will help you to find the best decisions for solving your problems!
      </p>
 
      <FilterBar filters={filters} onChange={onFilterChange} onSearch={onSearch} />
    </div>
  );
}

export default HeroBanner;