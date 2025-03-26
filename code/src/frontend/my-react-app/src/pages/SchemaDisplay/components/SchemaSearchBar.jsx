import React from 'react';
import styles from './SchemaSearchBar.module.css';

const SchemaSearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    console.log('Searched for:', searchTerm);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search schemas by name..."
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

export default SchemaSearchBar;
