import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './Accounts.module.css';

const Accounts = () => {
  const { userId, recordId } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [newAccount, setNewAccount] = useState({ nameOfAccount: '', balance: 0 });
  const [editAccount, setEditAccount] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`https://localhost:5003/api/Accounts?recordId=${recordId}`);
        setAccounts(response.data);
      } catch (err) {
        toast.error('Ошибка загрузки счетов');
      }
    };
    fetchAccounts();
  }, [recordId]);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'balance' ? parseFloat(value) || 0 : value;
    if (editAccount) {
      setEditAccount(prev => ({ ...prev, [name]: parsedValue }));
    } else {
      setNewAccount(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`https://localhost:5003/api/Accounts?recordId=${recordId}`, newAccount);
      setAccounts([...accounts, response.data]);
      setNewAccount({ nameOfAccount: '', balance: 0 });
      setShowAddModal(false);
      toast.success('Счет создан!');
    } catch (err) {
      toast.error('Ошибка создания счета');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(`https://localhost:5003/api/Accounts?id=${editAccount.id}`, editAccount);
      setAccounts(accounts.map(acc => acc.id === editAccount.id ? editAccount : acc));
      setEditAccount(null);
      setShowEditModal(false);
      toast.success('Счет обновлен!');
    } catch (err) {
      toast.error('Ошибка обновления счета');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (account) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://localhost:5003/api/Accounts?id=${account.id}`);
      setAccounts(accounts.filter(acc => acc.id !== account.id));
      setShowDeleteModal(null);
      toast.success('Счет удален!');
    } catch (err) {
      console.error('Ошибка удаления счета:', err);
      toast.error('Ошибка удаления счета');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAccounts = accounts.filter(acc => acc.nameOfAccount.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          Добавить счет
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Баланс</th>
            <th>Дата открытия</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map(account => (
              <tr key={account.id}>
                <td>{account.nameOfAccount}</td>
                <td>{account.balance.toFixed(2)}</td>
                <td>{account.dateOfOpening.split('T')[0]}</td>
                <td>
                  <button className={styles.editButton} onClick={() => { setEditAccount(account); setShowEditModal(true); }}>
                    Изменить
                  </button>
                  <button className={styles.deleteButton} onClick={() => setShowDeleteModal(account)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Нет счетов для отображения</td>
            </tr>
          )}
        </tbody>
      </table>

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Создать счет</h2>
              <button className={styles.closeButton} onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Название счета</label>
                <input
                  type="text"
                  name="nameOfAccount"
                  value={newAccount.nameOfAccount}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount(e)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Баланс</label>
                <input
                  type="number"
                  name="balance"
                  value={newAccount.balance}
                  onChange={handleInputChange}
                  className={styles.input}
                  step="0.01"
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount(e)}
                />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.saveButton} onClick={handleCreateAccount} disabled={isLoading}>
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
              <h2>Редактировать счет</h2>
              <button className={styles.closeButton} onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Название счета</label>
                <input
                  type="text"
                  name="nameOfAccount"
                  value={editAccount.nameOfAccount}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateAccount(e)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Баланс</label>
                <input
                  type="number"
                  name="balance"
                  value={editAccount.balance}
                  onChange={handleInputChange}
                  className={styles.input}
                  step="1"
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateAccount(e)}
                />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.saveButton} onClick={handleUpdateAccount} disabled={isLoading}>
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
              <p>Вы уверены, что хотите удалить этот счет?</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.deleteButton} onClick={() => handleDeleteAccount(showDeleteModal)} disabled={isLoading}>
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

export default Accounts;