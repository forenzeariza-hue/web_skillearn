import { useEffect, useState } from 'react';
import { SearchIcon } from './Icons';

const TYPES = [
  { value: '', label: 'Semua tipe' },
  { value: 'artikel', label: 'Artikel' },
  { value: 'video', label: 'Video' },
  { value: 'kuis', label: 'Kuis' },
  { value: 'latihan', label: 'Latihan' },
];

export default function SearchBar({ value = '', onSearch, type = '', onTypeChange, placeholder = 'Cari materi...' }) {
  const [keyword, setKeyword] = useState(value);

  useEffect(() => {
    setKeyword(value);
  }, [value]);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch?.(keyword.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row" role="search">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={placeholder}
          aria-label="Kata kunci pencarian"
          className="input rounded-full pl-11"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={type}
          onChange={(event) => onTypeChange?.(event.target.value)}
          aria-label="Filter tipe materi"
          className="input rounded-full sm:w-44"
        >
          {TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-primary shrink-0 px-7">
          Cari
        </button>
      </div>
    </form>
  );
}
