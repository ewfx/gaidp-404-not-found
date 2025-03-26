/**
 * SearchBar.jsx
 * Location: src/pages/UploadPDF/components/SearchBar.jsx
 *
 * Displays a search input and a search button on the right.
 * As the user types, we update searchTerm in the parent,
 * which filters the existing PDFs in real time.
 */

import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // If you want a separate "Search" button, you can add it here
  const handleSearchClick = () => {
    // Possibly do something special, or just rely on real-time filter
    console.log('Searched for:', searchTerm);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search existing PDFs..."
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
      />
      <button className={styles.searchButton} onClick={handleSearchClick}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
