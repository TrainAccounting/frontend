import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './RegularTransaction.module.css';

const RegularTransactions = () => {
  const { userId, recordId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [newTransaction, setNewTransaction] = useState({
    category: '',
    transactionValue: '',
    isAdd: true,
    accountsId: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsResponse, accountsResponse] = await Promise.all([
          axios.get(`https://localhost:5003/api/RegularTransactions?id=${userId}`),
          axios.get(`https://localhost:5003/api/Accounts?recordId=${recordId}`)
        ]);
        setTransactions(transactionsResponse.data);
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
    const parsedValue = name === 'transactionValue' ? parseFloat(value) || '' : value;
    setNewTransaction(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleToggleIsAdd = () => {
    setNewTransaction(prev => ({ ...prev, isAdd: !prev.isAdd }));
  };

  const handleCreateTransaction = async () => {
    setIsLoading(true);
    try {
      const payload = {
        category: newTransaction.category,
        transactionValue: parseFloat(newTransaction.transactionValue),
        isAdd: newTransaction.isAdd
      };
      const response = await axios.post(
        `https://localhost:5003/api/RegularTransactions?accountsId=${newTransaction.accountsId}`,
        payload
      );
      setTransactions([...transactions, response.data]);
      setNewTransaction({
        category: '',
        transactionValue: '',
        isAdd: true,
        accountsId: ''
      });
      setShowAddModal(false);
      toast.success('Регулярная транзакция успешно создана!');
    } catch (err) {
      console.error('Ошибка создания транзакции:', err);
      toast.error('Ошибка создания транзакции');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (transaction) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://localhost:5003/api/RegularTransactions?id=${transaction.id}`);
      setTransactions(transactions.filter(t => t.id !== transaction.id));
      setShowDeleteModal(null);
      toast.success('Регулярная транзакция успешно удалена!');
    } catch (err) {
      console.error('Ошибка удаления транзакции:', err);
      toast.error('Ошибка удаления транзакции');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase());
    if (filter === 'income') return matchesSearch && t.isAdd;
    if (filter === 'expense') return matchesSearch && !t.isAdd;
    return matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'income' ? styles.active : ''}`}
            onClick={() => setFilter('income')}
          >
            Поступление
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'expense' ? styles.active : ''}`}
            onClick={() => setFilter('expense')}
          >
            Списание
          </button>
        </div>
        <input
          type="text"
          placeholder="Поиск по категории..."
          value={search}
          onChange={handleSearch}
          className={styles.searchInput}
        />
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          Создать регулярную транзакцию
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Категория</th>
            <th>Значение</th>
            <th>Дата</th>
            <th>Тип</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.category}</td>
                <td>{transaction.transactionValue.toFixed(2)}</td>
                <td>{transaction.timeOfTransaction.split('T')[0]}</td>
                <td>{transaction.isAdd ? 'Поступление' : 'Списание'}</td>
                <td>
                  <button className={styles.deleteButton} onClick={() => setShowDeleteModal(transaction)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Нет регулярных транзакций для отображения</td>
            </tr>
          )}
        </tbody>
      </table>

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Создать регулярную транзакцию</h2>
              <button className={styles.closeButton} onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Категория</label>
                <input
                  type="text"
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTransaction()}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Значение</label>
                <input
                  type="number"
                  name="transactionValue"
                  value={newTransaction.transactionValue}
                  onChange={handleInputChange}
                  className={styles.input}
                  step="0.01"
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTransaction()}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Тип транзакции</label>
                <button
                  className={`${styles.toggleButton} ${newTransaction.isAdd ? styles.active : ''}`}
                  onClick={() => handleToggleIsAdd()}
                >
                  {newTransaction.isAdd ? 'Внести' : 'Снять'}
                </button>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Счет</label>
                <select
                  name="accountsId"
                  value={newTransaction.accountsId}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                >
                  <option value="">Выберите счет</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.nameOfAccount}</option>
                  ))}
                </select>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.saveButton} onClick={handleCreateTransaction} disabled={isLoading}>
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

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Подтверждение</h2>
              <button className={styles.closeButton} onClick={() => setShowDeleteModal(null)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <p>Вы уверены, что хотите удалить эту регулярную транзакцию?</p>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.saveButton} onClick={() => handleDeleteTransaction(showDeleteModal)} disabled={isLoading}>
                {isLoading ? 'Удаление...' : 'Удалить'}
              </button>
              <button type="button" className={styles.cancelButton} onClick={() => setShowDeleteModal(null)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegularTransactions;
