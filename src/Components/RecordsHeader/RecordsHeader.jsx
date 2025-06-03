import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from './RecordsHeader.module.css';

const RecordsHeader = () => {
  const { userId, recordId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'accounts', label: 'Счета', path: `/user/${userId}/record/${recordId}/accounts` },
    { id: 'deposits', label: 'Вклады', path: `/user/${userId}/record/${recordId}/deposits` },
    { id: 'credits', label: 'Кредиты', path: `/user/${userId}/record/${recordId}/credits` },
    { id: 'transactions', label: 'Транзакции', path: `/user/${userId}/record/${recordId}/transactions` },
    { id: 'ragular-transactions', label: 'Регулярные транзакции (beta) ', path: `/user/${userId}/record/${recordId}/ragular-transactions` },
    { id: 'restrictions', label: 'Ограничения', path: `/user/${userId}/record/${recordId}/restrictions` },
    { id: 'report', label: 'Фин. отчет', path: `/user/${userId}/record/${recordId}/report` },
    { id: '', label: 'Вернуться к учётам', path: `/user/${userId}/` },
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => currentPath === tab.path || currentPath === `/user/${userId}/record/${recordId}`);
    return activeTab ? activeTab.id : 'accounts';
  };

  console.log('Current path:', location.pathname, 'Active tab:', getActiveTab());

  return (
    <div className={styles.header}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${getActiveTab() === tab.id ? styles.active : ''}`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default RecordsHeader;