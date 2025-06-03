import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './Deposits.module.css';

const Deposits = () => {
  const { userId, recordId } = useParams();
  const [deposits, setDeposits] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [newDeposit, setNewDeposit] = useState({
    nameOfDeposit: '',
    depositStartValue: '',
    depositCurrentValue: 0,
    periodOfPayment: '',
    interestRate: '',
    sourceAccountId: '',
    accountId: ''
  });
  const [editDeposit, setEditDeposit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(null);
  const [isEarlyClose, setIsEarlyClose] = useState(false);
  const [closeAccountId, setCloseAccountId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depositsResponse, accountsResponse] = await Promise.all([
          axios.get(`https://localhost:5003/api/Deposits?recordId=${recordId}`),
          axios.get(`https://localhost:5003/api/Accounts?recordId=${recordId}`)
        ]);
        setDeposits(depositsResponse.data);
        setAccounts(accountsResponse.data);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        toast.error('Ошибка загрузки данных');
      }
    };
    fetchData();
  }, [recordId]);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['depositStartValue', 'interestRate', 'periodOfPayment'].includes(name) ? parseFloat(value) || '' : value;
    if (editDeposit) {
      setEditDeposit(prev => ({ ...prev, [name]: parsedValue }));
    } else {
      setNewDeposit(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleCreateDeposit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...newDeposit,
        depositStartValue: parseFloat(newDeposit.depositStartValue),
        depositCurrentValue: 0,
        periodOfPayment: parseInt(newDeposit.periodOfPayment),
        interestRate: parseFloat(newDeposit.interestRate),
        dateOfOpening: new Date().toISOString()
      };
      const response = await axios.post(
        `https://localhost:5003/api/Deposits/?accountId=${newDeposit.accountId}&sourceAccountId=${newDeposit.sourceAccountId}`,
        payload
      );
      setDeposits([...deposits, response.data]);
      setNewDeposit({
        nameOfDeposit: '',
        depositStartValue: '',
        depositCurrentValue: 0,
        periodOfPayment: '',
        interestRate: '',
        sourceAccountId: '',
        accountId: ''
      });
      setShowAddModal(false);
      toast.success('Вклад создан успешно!');
    } catch (err) {
      console.error('Ошибка создания вклада:', err);
      toast.error('Ошибка создания вклада');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDeposit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...editDeposit,
        depositCurrentValue: parseFloat(editDeposit.depositCurrentValue),
        periodOfPayment: parseInt(editDeposit.periodOfPayment),
        interestRate: parseFloat(editDeposit.interestRate)
      };
      await axios.put(`https://localhost:5003/api/Deposits/?id=${editDeposit.id}`, payload);
      setDeposits(deposits.map(d => (d.id === editDeposit.id ? editDeposit : d)));
      setEditDeposit(null);
      setShowEditModal(false);
      toast.success('Вклад успешно обновлен!');
    } catch (err) {
      console.error('Ошибка обновления вклада:', err);
      toast.error('Ошибка обновления вклада');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDeposit = async (depositId, accountId) => {
    setIsLoading(true);
    try {
      await axios.post(
        `https://localhost:5003/api/Deposits/close/${depositId}/${accountId}?isEarly=${isEarlyClose}`
      );
      setDeposits(deposits.map(d => (d.id === depositId ? { ...d, isOver: true } : d)));
      setShowCloseModal(null);
      toast.success(isEarlyClose ? 'Вклад закрыт досрочно!' : 'Вклад закрыт!');
    } catch (err) {
      console.error('Ошибка закрытия вклада:', err);
      toast.error('Ошибка закрытия вклада');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeposit = async (deposit) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://localhost:5003/api/Deposits/?id=${deposit.id}`);
      setDeposits(deposits.filter(d => d.id !== deposit.id));
      setShowDeleteModal(null);
      toast.success('Вклад успешно удален!');
    } catch (err) {
      console.error('Ошибка удаления вклада:', err);
      toast.error('Ошибка удаления вклада');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDeposits = deposits.filter(d => d.nameOfDeposit.toLowerCase().includes(search.toLowerCase()));

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
          Добавить вклад
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
            <th>Процентная ставка (%)</th>
            <th>Прибыль</th>
            <th>Статус</th>
            <th>Счет</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeposits.length > 0 ? (
            filteredDeposits.map(deposit => (
              <tr key={deposit.id}>
                <td>{deposit.nameOfDeposit}</td>
                <td>{deposit.depositStartValue.toFixed(2)}</td>
                <td>{deposit.depositCurrentValue.toFixed(2)}</td>
                <td>{new Date(deposit.dateOfOpening).toLocaleDateString()}</td>
                <td>{deposit.periodOfPayment}</td>
                <td>{deposit.interestRate.toFixed(2)}</td>
                <td>{(deposit.depositCurrentValue - deposit.depositStartValue).toFixed(2)}</td>
                <td>{deposit.isOver ? 'Закрыт' : 'Активен'}</td>
                <td>{accounts.find(acc => acc.id === deposit.accountId)?.nameOfAccount || '-'}</td>
                <td>
                  {!deposit.isOver && (
                    <>
                      <button className={styles.editButton} onClick={() => { setEditDeposit(deposit); setShowEditModal(true); }}>
                        Изменить
                      </button>
                      <button className={styles.closeButton} onClick={() => { setShowCloseModal(deposit); setIsEarlyClose(false); }}>
                        Закрыть
                      </button>
                      <button className={styles.closeEarlyButton} onClick={() => { setShowCloseModal(deposit); setIsEarlyClose(true); }}>
                        Закрыть досрочно
                      </button>
                    </>
                  )}
                  <button className={styles.deleteButton} onClick={() => setShowDeleteModal(deposit)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">Нет вкладов для отображения</td>
            </tr>
          )}
        </tbody>
      </table>

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Создать вклад</h2>
              <button className={styles.closeButton} onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Название вклада</label>
                <input
                  type="text"
                  name="nameOfDeposit"
                  value={newDeposit.nameOfDeposit}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateDeposit(e)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Начальная сумма</label>
                <input
                  type="number"
                  name="depositStartValue"
                  value={newDeposit.depositStartValue}
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
                  value={newDeposit.periodOfPayment}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Процентная ставка</label>
                <input
                  type="number"
                  name="interestRate"
                  value={newDeposit.interestRate}
                  onChange={handleInputChange}
                  step="1"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Счет-источник (для списания суммы)</label>
                <select
                  name="sourceAccountId"
                  value={newDeposit.sourceAccountId}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                >
                  <option value="">Выберите источник</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.nameOfAccount}</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Счет для начислений</label>
                <select
                  name="accountId"
                  value={newDeposit.accountId}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                >
                  <option value="">Выберите счет</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.nameOfAccount}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.saveButton} onClick={handleCreateDeposit} disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Создать'}
              </button>
              <button type="button" className={styles.cancelButton} onClick={() => setShowAddModal(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Редактировать вклад</h2>
              <button className={styles.closeButton} onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Название вклада</label>
                <input
                  type="text"
                  name="nameOfDeposit"
                  value={editDeposit?.nameOfDeposit || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateDeposit(e)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Текущая сумма</label>
                <input
                  type="number"
                  name="depositCurrentValue"
                  value={editDeposit?.depositCurrentValue || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  step="1"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Период</label>
                <input
                  type="number"
                  name="periodOfPayment"
                  value={editDeposit?.periodOfPayment || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Процентная ставка</label>
                <input
                  type="number"
                  name="interestRate"
                  value={editDeposit?.interestRate || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  step="1"
                  required
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.saveButton} onClick={handleUpdateDeposit} disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button type="button" className={styles.cancelButton} onClick={() => setShowEditModal(false)}>
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
              <h2>{isEarlyClose ? 'Закрыть вклад досрочно' : 'Закрыть вклад'}</h2>
              <button className={styles.closeButton} onClick={() => setShowCloseModal(null)}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{isEarlyClose ? 'Вы уверены, что хотите закрыть вклад досрочно?' : 'Вы уверены, что хотите закрыть вклад?'}</p>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Счет для возврата средств</label>
                <select
                  name="closeAccountId"
                  value={closeAccountId}
                  onChange={(e) => setCloseAccountId(e.target.value)}
                  className={styles.input}
                  required
                >
                  <option value="">Выберите счет</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.nameOfAccount}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.deleteButton}
                onClick={() => handleCloseDeposit(showCloseModal.id, closeAccountId)}
                disabled={!closeAccountId || isLoading}
              >
                {isLoading ? 'Закрытие...' : 'Закрыть'}
              </button>
              <button className={styles.cancelButton} onClick={() => setShowCloseModal(null)}>
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
              <p>Вы уверены, что хотите удалить этот вклад?</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.deleteButton} onClick={() => handleDeleteDeposit(showDeleteModal)} disabled={isLoading}>
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

export default Deposits;