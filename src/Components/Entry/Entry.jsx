import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Entry.module.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('https://localhost:5001/api/Auth/login', formData);
      console.log('Успешный вход:', response.data);
      
      // Здесь можно сохранить токен авторизации и перенаправить на защищенную страницу
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
      alert('Ошибка входа: неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.block1}>
        <a href="/">
          <button className={styles.but2}>Вернуться на главную страницу</button>
        </a>
      </div>
      
      <div className={styles.mainblock}>
        <div className={styles.headname}>
          <h1>Вход в аккаунт</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputblock}>
            <span className={styles.spanstyle}> 👉 </span>
            <input
              className={styles.inputstyle}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email@example.com"
            />
          </div>

          <div className={styles.inputblock}>
            <span className={styles.spanstyle}> 👀 </span>
            <input
              className={styles.inputstyle}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Пароль"
            />
          </div>

          <button className={styles.but1} type="submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;