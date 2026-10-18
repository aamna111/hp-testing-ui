import React, { useState } from "react";

interface Props {
  onSearch: (name: string, specialization: string) => void;
  onReset: () => void;
  loading: boolean;
}

const SPECIALIZATIONS = [
  "", "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
  "Oncology", "Dermatology", "Psychiatry", "Radiology", "General Medicine",
];

const SearchBar: React.FC<Props> = ({ onSearch, onReset, loading }) => {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(name, specialization);
  };

  const handleReset = () => {
    setName("");
    setSpecialization("");
    onReset();
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-bar__field">
        <svg className="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="search-bar__input"
        />
      </div>
      <div className="search-bar__field">
        <svg className="search-bar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="search-bar__select"
        >
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s || "All Specializations"}</option>
          ))}
        </select>
      </div>
      <div className="search-bar__actions">
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? <span className="spinner" /> : "Search"}
        </button>
        <button type="button" className="btn btn--ghost" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
