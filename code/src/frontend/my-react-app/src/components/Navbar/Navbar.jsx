import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

/**
 * A simple top navbar with a green background,
 * placeholder for logo on the left, and nav links on the right.
 */
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        {/* Placeholder for your company logo */}
        <div className={styles.logo}>
          <Link to="/">MyCompany</Link>
        </div>
      </div>
      <div className={styles.navRight}>
        <Link to="/" className={styles.navLink}>Home</Link>
        <Link to="/docs" className={styles.navLink}>Docs</Link>
        <Link to="/contact" className={styles.navLink}>Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
