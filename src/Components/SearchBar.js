import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload
    if (term) {
      onSearch(term);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type='text'
          placeholder='Enter a song, album, or artist'
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;
