// src/components/GlowSearchBar.jsx
import React, { useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

/**
 * Requirement 2.5: Search bar (white pill, 2px black border, round black search button on right, static)
 */
export function GlowSearchBar({
  className = '',
  placeholder = 'Search by subject: Programming, Calculus, Physics...',
  initialQuery = '',
  onSearch,
}) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/mentors?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative w-full max-w-2xl mx-auto', className)}
    >
      <div className="flex items-center gap-2 bg-[var(--white)] rounded-full border-2 border-[var(--ink)] pl-4 pr-1.5 py-1.5 shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[var(--ink)] placeholder:text-[var(--gray-600)] text-sm sm:text-base outline-none border-none focus:ring-0"
        />

        <button
          type="submit"
          className="size-10 rounded-full bg-[var(--ink)] text-[var(--white)] hover:bg-[#222222] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
          aria-label="Search mentors"
        >
          <MagnifyingGlass weight="bold" className="size-4 text-[var(--white)]" />
        </button>
      </div>
    </form>
  );
}
