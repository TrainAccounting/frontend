import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './Entry.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Используем новый GET-эндпоинт с параметрами
      const response = await axios.get('https://localhost:5003/api/Users', {
        params: {
          email: formData.email,
          password: formData.password
        }
      });

      if (response.data.id) {
        toast.success('Вход выполнен успешно!');
        navigate(`/user/${response.data.id}`);
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (err) {
      toast.error(`Ошибка входа: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {toast}
      
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

export default Login;