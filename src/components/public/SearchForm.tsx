'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-lg flex items-center">
      <input
        type="text"
        placeholder="Enter pincode or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-r-md"
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
