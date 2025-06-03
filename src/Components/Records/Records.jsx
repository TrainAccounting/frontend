import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Header from '../Header/Header';
import styles from './Records.module.css';

// Импорт иконок
import bookMain from './iconImages/bookMain.png';
import editIcon from './iconImages/edit.png';
import deleteIcon from './iconImages/delete.png';
import book1 from './iconImages/book1.png';
import book2 from './iconImages/book2.png';
import book3 from './iconImages/book3.png';
import book4 from './iconImages/book4.png';
import book5 from './iconImages/book5.png';
import book6 from './iconImages/book6.png';

const bookIcons = [book1, book2, book3, book4, book5, book6];

const Records = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [newRecord, setNewRecord] = useState({ nameOfRecord: '' });
  const [editRecord, setEditRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`https://localhost:5003/api/Records?userId=${userId}`);
        setRecords(response.data);
      } catch (err) {
        toast.error('Ошибка загрузки учетов');
      }
    };
    fetchRecords();
  }, [userId]);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editRecord) {
      setEditRecord(prev => ({ ...prev, [name]: value }));
    } else {
      setNewRecord(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateRecord = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`https://localhost:5003/api/Records?userId=${userId}`, newRecord);
      setRecords([...records, response.data]);
      setNewRecord({ nameOfRecord: '' });
      setShowAddModal(false);
      toast.success('Учет создан!');
    } catch (err) {
      toast.error('Ошибка создания учета');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRecord = async () => {
    setIsLoading(true);
    try {
      await axios.put(`https://localhost:5003/api/Records?id=${editRecord.id}`, editRecord);
      setRecords(records.map(r => r.id === editRecord.id ? editRecord : r));
      setEditRecord(null);
      setShowEditModal(false);
      toast.success('Учет обновлен!');
    } catch (err) {
      toast.error('Ошибка обновления учета');
    } finally {
      setIsLoading(false);
    }
  };

 const handleDeleteRecord = async (id) => {
  setIsLoading(true);
  try {
    await axios.delete(`https://localhost:5003/api/Records?id=${id}`);
    setRecords(records.filter(r => r.id !== id));
    setShowDeleteModal(null);
    toast.success('Учет удален!');
  } catch (err) {
    toast.error('Ошибка удаления учета');
  } finally {
    setIsLoading(false);
  }
};

  const handleRecordClick = (e, recordId) => {
    if (e.target.closest('.action-button-container')) {
      return;
    }
    navigate(`/user/${userId}/record/${recordId}`);
  };

  const filteredRecords = records.filter(r => r.nameOfRecord.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Header text="Личный кабинет" />
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <img src={bookMain} alt="Учёты" className={styles.titleIcon} />
            <span>Учёты</span>
          </div>
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={handleSearch}
              className={styles.searchInput}
            />
            <button className={styles.createButton} onClick={() => setShowAddModal(true)}>
              Создать новый учёт
            </button>
          </div>
        </div>

        <div className={styles.recordsList}>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => {
              const bookIcon = bookIcons[index % bookIcons.length];
              return (
                <div
                  key={record.id}
                  className={styles.recordItem}
                  onClick={(e) => handleRecordClick(e, record.id)}
                >
                  <img src={bookIcon} alt="Иконка учёта" className={styles.recordIcon} />
                  <div className={styles.recordInfo}>
                    <span className={styles.recordId}>ID: {record.id}</span>
                    <span className={styles.recordName}>{record.nameOfRecord}</span>
                    <span className={styles.recordDate}>
                      Создано: {new Date(record.dateOfCreation).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`${styles.recordActions} action-button-container`}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditRecord(record);
                        setShowEditModal(true);
                      }}
                    >
                      <img src={editIcon} alt="Редактировать" />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteModal(record);
                      }}
                    >
                      <img src={deleteIcon} alt="Удалить" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noRecords}>Учёты не найдены</div>
          )}
        </div>

        {showAddModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>Создать новый учёт</h3>
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    setShowAddModal(false);
                    setNewRecord({ nameOfRecord: '' });
                  }}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <label className={styles.modalLabel}>Название учёта:</label>
                <input
                  className={styles.modalInput}
                  type="text"
                  name="nameOfRecord"
                  value={newRecord.nameOfRecord}
                  onChange={handleInputChange}
                  placeholder="Введите название учёта"
                  onKeyDown={(e) => e.key === 'Enter' && newRecord.nameOfRecord.trim() && handleCreateRecord()}
                />
                <div className={styles.modalButtons}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowAddModal(false);
                      setNewRecord({ nameOfRecord: '' });
                    }}
                  >
                    Отмена
                  </button>
                  <button
                    className={styles.createConfirmButton}
                    onClick={handleCreateRecord}
                    disabled={isLoading || !newRecord.nameOfRecord.trim()}
                  >
                    {isLoading ? 'Создание...' : 'Создать'}
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
                <h3>Редактировать учёт</h3>
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    setEditRecord(null);
                    setShowEditModal(false);
                  }}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <label className={styles.modalLabel}>Название учёта:</label>
                <input
                  className={styles.modalInput}
                  type="text"
                  name="nameOfRecord"
                  value={editRecord.nameOfRecord}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && editRecord.nameOfRecord.trim() && handleUpdateRecord()}
                />
                <div className={styles.modalButtons}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      setEditRecord(null);
                      setShowEditModal(false);
                    }}
                  >
                    Отмена
                  </button>
                  <button
                    className={styles.saveButton}
                    onClick={handleUpdateRecord}
                    disabled={isLoading || !editRecord.nameOfRecord.trim()}
                  >
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
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
                <h3>Удаление учёта</h3>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowDeleteModal(null)}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <p className={styles.confirmationText}>
                  Вы уверены, что хотите удалить учёт "{showDeleteModal.nameOfRecord}"?
                </p>
                <div className={styles.modalButtons}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowDeleteModal(null)}
                  >
                    Отмена
                  </button>
                  <button
                    className={styles.deleteConfirmButton}
                    onClick={() => handleDeleteRecord(showDeleteModal.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Удаление...' : 'Удалить'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Records;