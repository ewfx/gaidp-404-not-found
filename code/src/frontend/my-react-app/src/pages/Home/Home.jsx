import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/upload-pdf');
  };

  return (
    <div className={styles.homeContainer}>
      <h1>Welcome to Our Data Validation Platform</h1>
      <p>
        This is your landing page. You can describe your product, show features,
        or any marketing content here.
      </p>
      <button onClick={handleGetStarted} className={styles.startButton}>
        Get Started
      </button>
    </div>
  );
};

export default Home;
