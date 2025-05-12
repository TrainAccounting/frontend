import React from 'react';
import styles from './AdCard.module.css';

export default function AdCard  ()  {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        Здесь будет реклама
      </div>
    </div>
  );
};

