import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './FinancialReport.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinancialReport = () => {
  const { userId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`https://localhost:5003/api/Transactions?userId=${userId}`);
        setTransactions(response.data);
      } catch (err) {
        console.error('Ошибка загрузки транзакций:', err);
        toast.error('Ошибка загрузки транзакций');
      }
    };
    fetchTransactions();
  }, [userId]);

  const handleDownloadExcel = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://localhost:5003/api/Transactions?mode=export&userId=${userId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FinancialReport_${userId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Файл Excel успешно скачан!');
    } catch (err) {
      console.error('Ошибка скачивания файла:', err);
      toast.error('Ошибка при скачивании файла');
    } finally {
      setIsLoading(false);
    }
  };

  const incomeTransactions = transactions.filter(t => t.isAdd);
  const expenseTransactions = transactions.filter(t => !t.isAdd);

  const top5Transactions = transactions
    .sort((a, b) => b.transactionValue - a.transactionValue)
    .slice(0, 5);

  const incomeTotal = incomeTransactions.reduce((sum, t) => sum + t.transactionValue, 0);
  const expenseTotal = expenseTransactions.reduce((sum, t) => sum + t.transactionValue, 0);

  const incomeChartData = {
    labels: incomeTransactions.map(t => t.category),
    datasets: [{
      label: 'Доходы',
      data: incomeTransactions.map(t => t.transactionValue),
      backgroundColor: '#28a745',
      borderColor: '#218838',
      borderWidth: 1
    }]
  };

  const expenseChartData = {
    labels: expenseTransactions.map(t => t.category),
    datasets: [{
      label: 'Расходы',
      data: expenseTransactions.map(t => t.transactionValue),
      backgroundColor: '#dc3545',
      borderColor: '#c82333',
      borderWidth: 1
    }]
  };

  const top5ChartData = {
    labels: top5Transactions.map(t => t.category),
    datasets: [{
      label: 'Топ-5 транзакций',
      data: top5Transactions.map(t => t.transactionValue),
      backgroundColor: top5Transactions.map(t => t.isAdd ? '#28a745' : '#dc3545'),
      borderColor: top5Transactions.map(t => t.isAdd ? '#218838' : '#c82333'),
      borderWidth: 1
    }]
  };

  const incomeExpenseChartData = {
    labels: ['Доходы', 'Расходы'],
    datasets: [{
      label: 'Доходы и расходы',
      data: [incomeTotal, expenseTotal],
      backgroundColor: ['#28a745', '#dc3545'],
      borderColor: ['#218838', '#c82333'],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Финансовый отчет</h2>
        <button
          className={styles.downloadButton}
          onClick={handleDownloadExcel}
          disabled={isLoading}
        >
          {isLoading ? 'Скачивание...' : 'Скачать Excel'}
        </button>
      </div>

      <div className={styles.chartSection}>
        <h3>Диаграмма доходов</h3>
        <div className={styles.chartWrapper}>
          <Bar data={incomeChartData} options={chartOptions} />
        </div>
      </div>

      <div className={styles.chartSection}>
        <h3>Диаграмма расходов</h3>
        <div className={styles.chartWrapper}>
          <Bar data={expenseChartData} options={chartOptions} />
        </div>
      </div>

      <div className={styles.chartSection}>
        <h3>Самые большие транзакции (Топ-5)</h3>
        <div className={styles.chartWrapper}>
          <Bar data={top5ChartData} options={chartOptions} />
        </div>
      </div>

      <div className={styles.chartSection}>
        <h3>Диаграмма доходов и расходов</h3>
        <div className={styles.chartWrapper}>
          <Bar data={incomeExpenseChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;

