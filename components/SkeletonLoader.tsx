// components/SkeletonLoader.tsx
import React from 'react';
import styles from './SkeletonLoader.module.css'; // Create a CSS module for styling

const SkeletonLoader = () => (
  <div className={styles.skeletonContainer}>
    {Array.from({ length: 10 }).map((_, index) => (
      <div key={index} className={styles.card}>
        <div className={styles.skeletonImage}></div>
        <div className={styles.cardContent}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonDescription}></div>
          <div className={styles.skeletonFooter}>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonUsername}></div>
            <div className={styles.skeletonDate}></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
