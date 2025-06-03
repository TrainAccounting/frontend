import React from 'react';
import styles from './Card.module.css';

const Card = ({ image, title, description, marginLeft, marginTop }) => {
  return (
    <div className={styles.card} style={{ marginLeft: `${marginLeft}px`, marginTop: `${marginTop}px` }}>
      <img src={image} alt={title} className={styles.cardImage} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default Card;