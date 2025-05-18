import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.module.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fio: '',
    email: '',
    phone: '',
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
      const response = await axios.post('https://localhost:5001/api/Auth/register', formData);
      console.log('Успешная регистрация:', response.data);
      navigate('/entry');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-glass">
        <div className="registration-header">
          <h1>Создать аккаунт</h1>
          <p>Присоединяйтесь к нашему сообществу</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="fio"
              value={formData.fio}
              onChange={handleChange}
              required
              placeholder="ФИО"
            />
            <span className="input-icon">👤</span>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email@example.com"
            />
            <span className="input-icon">✉️</span>
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Телефон"
            />
            <span className="input-icon">📱</span>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Пароль"
            />
            <span className="input-icon">🔒</span>
          </div>

          <div className="select-wrapper">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="role-select"
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
              <option value="manager">Менеджер</option>
            </select>
          </div>
          

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Создать аккаунт'}
            {isLoading && <span className="spinner"></span>}
          </button>
        </form>

        <div className="auth-redirect">
          Уже зарегистрированы? <span onClick={() => navigate('/entry')}>Войти</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;