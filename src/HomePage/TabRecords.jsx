import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function RecordsTable  ()  {
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchRecords = async () => {
    try {
      const response = await fetch ('http://localhost:5000/api/Records');
      setRecords(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h2>Список записей</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Название записи</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{record.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{record.nameOfRecord}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatDate(record.dateOfCreation)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

