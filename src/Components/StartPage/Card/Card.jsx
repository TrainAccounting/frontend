import React from 'react';
import styles from './Card.module.css';

const Card = ({ image, title, description, marginLeft, marginTop }) => {


  const cardStyle = {
    marginLeft: marginLeft || '0',  
    marginTop: marginTop || '0',    
  };

  return (
    <div className={styles.card} style={cardStyle}>
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt={title}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default Card;

//Первая в мире Онлайн Домашняя Бухгалтерия
//Мы создаём удобное веб-приложение для удобного контроля ваших финансов.