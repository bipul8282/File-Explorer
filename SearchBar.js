import React from 'react';

export default function SearchBar({ query, setQuery }) {
  return (
    <input
      type="text"
      placeholder="Search files/folders..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      style={{ width: '100%', marginBottom: 8, padding: '4px' }}
    />
  );
}