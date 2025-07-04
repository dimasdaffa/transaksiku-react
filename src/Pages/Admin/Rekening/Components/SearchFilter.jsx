import React from 'react';

const SearchFilter = ({ searchTerm, onSearchChange, filterBank, onFilterChange, banks }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
          placeholder="Cari rekening..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <select
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block p-2"
        value={filterBank}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="">Semua Bank</option>
        {banks.map((bank) => (
          <option key={bank} value={bank}>
            {bank}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilter;