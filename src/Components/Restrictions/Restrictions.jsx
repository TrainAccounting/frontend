import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './Restrictions.module.css';

const Restrictions = () => {
  const { userId, recordId } = useParams();
  const [restrictions, setRestrictions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [newRestriction, setNewRestriction] = useState({
    category: '',
    restrictionValue: '',
    accountsId: ''
  });
  const [editRestriction, setEditRestriction] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restrictionsResponse, accountsResponse] = await Promise.all([
          axios.get(`https://localhost:5003/api/Restrictions?userId=${userId}`),
          axios.get(`https://localhost:5003/api/Accounts?recordId=${recordId}`)
        ]);
        setRestrictions(restrictionsResponse.data);
        setAccounts(accountsResponse.data);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        toast.error('Ошибка загрузки данных');
      }
    };
    fetchData();
  }, [userId, recordId]);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'restrictionValue' ? parseFloat(value) || '' : value;
    if (editRestriction) {
      setEditRestriction(prev => ({ ...prev, [name]: parsedValue }));
    } else {
      setNewRestriction(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleCreateRestriction = async () => {
    setIsLoading(true);
    try {
      const payload = {
        category: newRestriction.category,
        restrictionValue: parseFloat(newRestriction.restrictionValue)
      };
      const response = await axios.post(
        `https://localhost:5003/api/Restrictions?accountsId=${newRestriction.accountsId}`,
        payload
      );
      setRestrictions([...restrictions, response.data]);
      setNewRestriction({
        category: '',
        restrictionValue: '',
        accountsId: ''
      });
      setShowAddModal(false);
      toast.success('Ограничение успешно создано!');
    } catch (err) {
      console.error('Ошибка создания ограничения:', err);
      toast.error('Ошибка создания ограничения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRestriction = async () => {
    setIsLoading(true);
    try {
      const payload = {
        category: editRestriction.category,
        restrictionValue: parseFloat(editRestriction.restrictionValue)
      };
      await axios.put(`https://localhost:5003/api/Restrictions?id=${editRestriction.id}`, payload);
      setRestrictions(restrictions.map(r => (r.id === editRestriction.id ? editRestriction : r)));
      setEditRestriction(null);
      setShowEditModal(false);
      toast.success('Ограничение успешно обновлено!');
    } catch (err) {
      console.error('Ошибка обновления ограничения:', err);
      toast.error('Ошибка обновления ограничения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRestriction = async (restriction) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://localhost:5003/api/Restrictions?id=${restriction.id}`);
      setRestrictions(restrictions.filter(r => r.id !== restriction.id));
      setShowDeleteModal(null);
      toast.success('Ограничение успешно удалено!');
    } catch (err) {
      console.error('Ошибка удаления ограничения:', err);
      toast.error('Ошибка удаления ограничения');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRestrictions = restrictions.filter(r => r.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Поиск по категории..."
          value={search}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          Добавить ограничение
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Категория</th>
            <th>Значение ограничения</th>
            <th>Потрачено</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredRestrictions.length > 0 ? (
            filteredRestrictions.map(restriction => (
              <tr key={restriction.id}>
                <td>{restriction.category}</td>
                <td>{restriction.restrictionValue.toFixed(2)}</td>
                <td>{restriction.moneySpent?.toFixed(2) || '0.00'}</td>
                <td>
                  <button className={styles.editButton} onClick={() => { setEditRestriction(restriction); setShowEditModal(true); }}>
                    Изменить
                  </button>
                  <button className={styles.deleteButton} onClick={() => setShowDeleteModal(restriction)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Нет ограничений для отображения</td>
            </tr>
          )}
        </tbody>
      </table>

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Создать ограничение</h2>
              <button className={styles.closeButton} onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Категория</label>
                <input
                  type="text"
                  name="category"
                  value={newRestriction.category}
                  onChange={handleInputChange}
                  className={styles.category}
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateRestriction()}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Значение ограничения</label>
                <input
                  type="number"
                  name="restrictionValue"
                  value={newRestriction.restrictionValue}
                  onChange={handleInputChange}
                  className={styles.restrictionValue}
                  step="0.01"
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateRestriction()}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Счет</label>
                <select
                  name="accountsId"
                  value={newRestriction.accountsId}
                  onChange={handleInputChange}
                  className={styles.accountsId}
                  required
                >
                  <option value="">Выберите счет</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.nameOfAccount}</option>
                  ))}
                </select>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.saveButton} onClick={handleCreateRestriction} disabled={isLoading}>
                  {isLoading ? 'Сохранение...' : 'Создать'}
                </button>
                <button type="button" className={styles.cancelButton} onClick={() => setShowAddModal(false)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Редактировать ограничение</h2>
              <button className={styles.closeButton} onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Категория</label>
                <input
                  type="text"
                  name="category"
                  value={editRestriction.category}
                  onChange={handleInputChange}
                  className={styles.category}
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateRestriction()}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Значение ограничения</label>
                <input
                  type="number"
                  name="restrictionValue"
                  value={editRestriction.restrictionValue}
                  onChange={handleInputChange}
                  className={styles.restrictionValue}
                  step="0.01"
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateRestriction()}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Счет</label>
                <select
                  name="accountsId"
                  value={editRestriction.accountsId}
                  onChange={handleInputChange}
                  className={styles.accountsId}
                  required
                >
                  <option value="">Выберите счет</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.nameOfAccount}</option>
                  ))}
                </select>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.saveButton} onClick={handleUpdateRestriction} disabled={isLoading}>
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button type="button" className={styles.cancelButton} onClick={() => setShowEditModal(false)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Подтверждение</h2>
              <button className={styles.closeButton} onClick={() => setShowDeleteModal(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <p>Вы уверены, что хотите удалить это ограничение?</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.saveButton} onClick={() => handleDeleteRestriction(showDeleteModal)} disabled={isLoading}>
                {isLoading ? 'Удаление...' : 'Удалить'}
              </button>
              <button className={styles.cancelButton} onClick={() => setShowDeleteModal(null)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restrictions;