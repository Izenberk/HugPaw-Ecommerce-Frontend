import React from "react";

const SearchBox = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <div className="relative">
        <input
          type="text"
          id="search-input"
          placeholder="Search..."
          className="w-full px-4 py-2 pl-10 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary text-primary-foreground bg-card"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground"
        >
          <circle cx="11.5" cy="11.5" r="9.5" />
          <path strokeLinecap="round" d="M18.5 18.5L22 22" />
        </svg>
      </div>
    </div>
  );
};

export default SearchBox;
