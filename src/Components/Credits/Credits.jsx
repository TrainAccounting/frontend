import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './Credits.module.css';

const Credits = () => {
  const { userId, recordId } = useParams();
  const [credits, setCredits] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [newCredit, setNewCredit] = useState({
    nameOfCredit: '',
    creditStartValue: '',
    periodOfPayment: '',
    interestRate: '',
    accountId: '',
    togetAccountId: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(null);
  const [isEarlyClose, setIsEarlyClose] = useState(false);
  const [closeAccountId, setCloseAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('credits');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creditsResponse, accountsResponse] = await Promise.all([
          axios.get(`https://localhost:5003/api/Credits?recordId=${recordId}`),
          axios.get(`https://localhost:5003/api/Accounts?recordId=${recordId}`)
        ]);
        setCredits(creditsResponse.data);
        setAccounts(accountsResponse.data);
      } catch (err) {
        toast.error('Ошибка загрузки данных');
      }
    };
    if (activeTab === 'credits') fetchData();
  }, [recordId, activeTab]);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCredit(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCredit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        nameOfCredit: newCredit.nameOfCredit,
        creditStartValue: parseFloat(newCredit.creditStartValue),
        creditCurrentValue: 0,
        periodOfPayment: parseInt(newCredit.periodOfPayment),
        interestRate: parseFloat(newCredit.interestRate),
        dateOfOpening: new Date().toISOString()
      };
      
      const response = await axios.post(
        `https://localhost:5003/api/Credits?accountId=${newCredit.accountId}&togetAccountId=${newCredit.togetAccountId}`,
        payload
      );
      
      setCredits([...credits, response.data]);
      setNewCredit({
        nameOfCredit: '',
        creditStartValue: '',
        periodOfPayment: '',
        interestRate: '',
        accountId: '',
        togetAccountId: ''
      });
      setShowAddModal(false);
      toast.success('Кредит создан!');
    } catch (err) {
      toast.error('Ошибка создания кредита');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseCredit = async (creditId, accountId) => {
    setIsLoading(true);
    try {
      await axios.post(
        `https://localhost:5003/api/Credits/close/${creditId}/${accountId}?isEarly=${isEarlyClose}`
      );
      setCredits(credits.map(c => c.id === creditId ? { ...c, isOver: true } : c));
      setShowCloseModal(null);
      toast.success(isEarlyClose ? 'Кредит закрыт досрочно!' : 'Кредит закрыт!');
    } catch (err) {
      toast.error('Ошибка закрытия кредита');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCredit = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://localhost:5003/api/Credits?id=${id}`);
      setCredits(credits.filter(c => c.id !== id));
      setShowDeleteModal(null);
      toast.success('Кредит удален!');
    } catch (err) {
      toast.error('Ошибка удаления кредита');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCredits = credits.filter(c => c.nameOfCredit.toLowerCase().includes(search.toLowerCase()));

  if (activeTab !== 'credits') return null;

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
          Добавить кредит
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Начальная сумма</th>
            <th>Текущая сумма</th>
            <th>Дата открытия</th>
            <th>Период (мес.)</th>
            <th>Ставка (%)</th>
            <th>Проценты в деньгах</th>
            <th>Всего к оплате</th>
            <th>Ежемесячный платеж</th>
            <th>Статус</th>
            <th>Счет для списания</th>
            <th>Счет-получатель</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredCredits.length > 0 ? (
            filteredCredits.map(credit => (
              <tr key={credit.id}>
                <td>{credit.nameOfCredit}</td>
                <td>{credit.creditStartValue.toFixed(2)}</td>
                <td>{credit.creditCurrentValue.toFixed(2)}</td>
                <td>{new Date(credit.dateOfOpening).toLocaleDateString()}</td>
                <td>{credit.periodOfPayment}</td>
                <td>{credit.interestRate.toFixed(2)}</td>
                <td>{credit.interestRateInMoney?.toFixed(2) || '0.00'}</td>
                <td>{credit.totalToPay?.toFixed(2) || '0.00'}</td>
                <td>{credit.monthlyPayment?.toFixed(2) || '0.00'}</td>
                <td>{credit.isOver ? 'Закрыт' : 'Активен'}</td>
                <td>{accounts.find(a => a.id === credit.accountId)?.nameOfAccount || '-'}</td>
                <td>{accounts.find(a => a.id === credit.togetAccountId)?.nameOfAccount || '-'}</td>
                <td>
                  {!credit.isOver && (
                    <>
                      <button 
                        className={styles.closeButton} 
                        onClick={() => { 
                          setShowCloseModal(credit.id); 
                          setIsEarlyClose(false); 
                        }}
                      >
                        Закрыть
                      </button>
                      <button 
                        className={styles.closeEarlyButton} 
                        onClick={() => { 
                          setShowCloseModal(credit.id); 
                          setIsEarlyClose(true); 
                        }}
                      >
                        Закрыть досрочно
                      </button>
                    </>
                  )}
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => setShowDeleteModal(credit.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13">Нет кредитов для отображения</td>
            </tr>
          )}
        </tbody>
      </table>

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Создать кредит</h2>
              <button className={styles.closeButton} onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Название кредита</label>
                <input
                  type="text"
                  name="nameOfCredit"
                  value={newCredit.nameOfCredit}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Начальная сумма</label>
                <input
                  type="number"
                  name="creditStartValue"
                  value={newCredit.creditStartValue}
                  onChange={handleInputChange}
                  className={styles.input}
                  step="1"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Период (мес.)</label>
                <input
                  type="number"
                  name="periodOfPayment"
                  value={newCredit.periodOfPayment}
                  onChange={handleInputChange}
                  className={styles.input}
                  step="1"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Процентная ставка</label>
                <input
                  type="number"
                  name="interestRate"
                  value={newCredit.interestRate}
                  onChange={handleInputChange}
                  className={styles.input}
                  step="1"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Счет для списания</label>
                <select
                  name="accountId"
                  value={newCredit.accountId}
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
              <div className={styles.inputGroup}>
                <label className={styles.label}>Счет-получатель</label>
                <select
                  name="togetAccountId"
                  value={newCredit.togetAccountId}
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
            </div>
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.saveButton} 
                onClick={handleCreateCredit} 
                disabled={isLoading}
              >
                {isLoading ? 'Сохранение...' : 'Создать'}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton} 
                onClick={() => setShowAddModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {showCloseModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{isEarlyClose ? 'Закрыть кредит досрочно' : 'Закрыть кредит'}</h2>
              <button className={styles.closeButton} onClick={() => setShowCloseModal(null)}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{isEarlyClose ? 'Вы уверены, что хотите закрыть кредит досрочно?' : 'Вы уверены, что хотите закрыть кредит?'}</p>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Счет для списания</label>
                <select
                  value={closeAccountId}
                  onChange={(e) => setCloseAccountId(e.target.value)}
                  className={styles.input}
                  required
                >
                  <option value="">Выберите счет</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.nameOfAccount}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.deleteButton}
                onClick={() => handleCloseCredit(showCloseModal, closeAccountId)}
                disabled={!closeAccountId || isLoading}
              >
                {isLoading ? 'Закрытие...' : 'Закрыть'}
              </button>
              <button 
                className={styles.cancelButton} 
                onClick={() => setShowCloseModal(null)}
              >
                Отмена
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
              <button className={styles.closeButton} onClick={() => setShowDeleteModal(null)}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Вы уверены, что хотите удалить этот кредит?</p>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.deleteButton} 
                onClick={() => handleDeleteCredit(showDeleteModal)} 
                disabled={isLoading}
              >
                {isLoading ? 'Удаление...' : 'Удалить'}
              </button>
              <button 
                className={styles.cancelButton} 
                onClick={() => setShowDeleteModal(null)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credits;