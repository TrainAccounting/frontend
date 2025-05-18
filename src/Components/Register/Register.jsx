import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css';

const RegistrationForm = () => {


  const [formData, setFormData] = useState({
    fio: '',
    email: '',
    phone: '',
    password: '',
    role: '',
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
      const response = await axios.post('https://localhost:5001/api/Auth/register', formData);
      console.log('Успешная регистрация:', response.data);
      alert('Успешная регистрация...\n Перейти ко входу ');
      navigate('/entry');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
      alert('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.block1}>

        <a href = "/">
          <button className={styles.but2}>Вернуться на главную страницу</button>
        </a>

      </div>
      

      <div className={styles.mainblock}>

        <div className={styles.headname}>
          <h1>Создать аккаунт</h1>
        </div>

        <form onSubmit={handleSubmit}>

          <div className={styles.inputblock}>
            <span className={styles.spanstyle}> 🧒 </span>
            <input
              className={styles.inputstyle}
              type="text"
              name="fio"
              value={formData.fio}
              onChange={handleChange}
              required
              placeholder=' Ваше ФИО'
            />
          </div>

          <div className={styles.inputblock}>
            <span className={styles.spanstyle}> 📧 </span>
            <input
              className={styles.inputstyle}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=" Email@example.com"
            />
          </div>

          <div className={styles.inputblock}>
            <span className={styles.spanstyle}> 📞 </span>
            <input
              className={styles.inputstyle}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder=" Телефон"
            />
          </div>

          <div className={styles.inputblock}>
            <span className={styles.spanstyle}> 🤫 </span>
            <input
              className={styles.inputstyle}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder=" Пароль"
            />
          </div>

          <div className={styles.inputblock} >
            <span className={styles.spanstyle}> ✏️ </span>
            <select
              className={styles.inputstyle}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Обычный пользователь</option>
            </select>
          </div>

          <button className={styles.but1} type="submit" disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            {isLoading && <span></span>}
          </button>
        </form>

      </div>

    </div>

  );
};

export default RegistrationForm;

