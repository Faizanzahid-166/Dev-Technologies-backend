const SearchFilterBar = ({ search, onSearch, status, onStatus, placeholder = 'Search tasks...' }) => {
  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'not_completed', label: 'Not Completed' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-10"
        />
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        className="input-field sm:w-48 cursor-pointer"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value} className="bg-slate-800">
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilterBar;
