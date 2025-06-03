import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './Header.module.css';

const Header = ({ text }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ fio: '', email: '', phone: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://localhost:5003/api/Users?id=${userId}`);
        setUser(response.data);
        setProfileData({ fio: response.data.fio, email: response.data.email, phone: response.data.phone });
      } catch (err) {
        toast.error('Ошибка загрузки профиля');
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`https://localhost:5003/api/Users?id=${userId}`, {
        ...profileData,
        password: user.password,
        role: user.role
      });
      setUser({ ...user, ...profileData });
      setShowProfileModal(false);
      toast.success('Профиль обновлен!');
    } catch (err) {
      toast.error('Ошибка обновления профиля');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`https://localhost:5003/api/Users?id=${userId}`);
      toast.success('Аккаунт удален!');
      navigate('/');
    } catch (err) {
      toast.error('Ошибка удаления аккаунта');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>{text}</h1>
        <div className={styles.controls}>
          <button className={styles.profileButton} onClick={() => setShowProfileModal(true)}>
            {user?.email || 'Профиль'}
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Выход
          </button>
        </div>
      </header>

      {showProfileModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Редактировать профиль</h2>
              <button className={styles.closeButton} onClick={() => setShowProfileModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>ФИО</label>
                <input
                  type="text"
                  name="fio"
                  value={profileData.fio}
                  onChange={handleProfileChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Телефон</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.saveButton} onClick={handleSaveProfile}>Сохранить</button>
              <button className={styles.deleteButton} onClick={() => { setShowProfileModal(false); setShowDeleteModal(true); }}>
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Подтверждение</h2>
              <button className={styles.closeButton} onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <p>Вы уверены, что хотите удалить аккаунт?</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={() => setShowDeleteModal(false)}>Отмена</button>
              <button className={styles.deleteButton} onClick={handleDeleteAccount}>Удалить</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;