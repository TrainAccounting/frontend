import style from './RegisterPage.module.css'
import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function Register(){

    const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Имитация запроса к API
      setTimeout(() => {
        console.log('Регистрация:', formData);
        setIsSubmitting(false);
        setSuccessMessage('Регистрация прошла успешно!');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }, 1500);
    }
  };

  return (
    <div className={style.registerContainer}>
      <div className= {style.registerCard}>
        <div className={style.cardHeader}>
          <h2>Создать аккаунт</h2>
        </div>

        {successMessage ? (
          <div className={style.successState}>
            <div className={style.successIcon}>✓</div>
            <h3>{successMessage}</h3>
            <p>Теперь вы можете войти в систему</p>
            <a href="/login" className={style.loginLink}>
              Перейти к входу <FiArrowRight />
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>

            <div className={`formGroup ${errors.email ? 'error' : ''}`}>
              {/* <div className={style.inputIcon}>
                <FiMail />
              </div> */}
              <input
                className = {style.myInput}
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className={style.errorMessage}>{errors.email}</span>}
            </div>

            <div className={`formGroup ${errors.password ? 'error' : ''}`}>
              {/* <div className={style.inputIcon}>
                <FiLock />
              </div> */}
              <input
                className = {style.myInput}
                type="password"
                id="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className={style.errorMessage}>{errors.password}</span>}
            </div>
            
            <button
              type="submit"
              className={style.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={style.spinner}></span>
                  Регистрация...
                </>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </form>
        )}

        
      </div>
    </div>
  );
}
