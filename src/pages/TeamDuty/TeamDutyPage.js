import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form, Pagination } from 'react-bootstrap';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const TeamDutyPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.id;
  const [duties, setDuties] = useState([]);
  const [selectedTeamDuties, setSelectedTeamDuties] = useState([]);


  const [filteredDuties, setFilteredDuties] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [currentDuty, setCurrentDuty] = useState({});
  const [newDuty, setNewDuty] = useState({
    Title: '',
    Explanation: '',
    DeadLine: '',
    Emergency: 1,
    Progress: 1,
    TeamId: user.teamId, 
    CreatedUserId:user.id,
    UpdatedUserId:user.id


  });
  const [touched, setTouched] = useState({
    title: false,
    explanation: false,
    deadline: false,
  });
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      title: '',
      explanation: '',
      deadline: '',
    };
  
    if (newDuty.Title.trim() === '') {
      newErrors.title = 'Başlık gerekli.';
      valid = false;
    }
  
    if (newDuty.Explanation.trim() === '') {
      newErrors.explanation = 'Açıklama gerekli.';
      valid = false;
    }
  
    if (newDuty.DeadLine.trim() === '') {
      newErrors.deadline = 'Bitiş tarihi gerekli.';
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };

  const [errors, setErrors] = useState({
    title: '',
    explanation: '',
    deadline: '',
  });

  const [subordinates, setSubordinates] = useState([]);
  const [selectedSubordinateId, setSelectedSubordinateId] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Arama terimi için state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100); // Başlangıç değeri olarak 2 ayarlandı

 const handleChange = (event) => {
  setItemsPerPage(Number(event.target.value));
};


  useEffect(() => {
    fetchDuties();
    fetchSubordinates();
  }, []);

  useEffect(() => {
    const filtered = duties.filter(duty =>
      duty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      duty.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      duty.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDuties(filtered);
    setCurrentPage(1); 
  }, [searchTerm, duties]);

  const fetchDuties = async () => {
    try {
      const response = await axios.get(`https://localhost:7189/api/UserDuty/GetSubordinatesDuties?userId=${userId}`);
      setDuties(response.data);
      setFilteredDuties(response.data); 
    } catch (error) {
      console.error('Görevler getirilemedi:', error);
    }
  };

  const fetchSubordinates = async () => {
    try {
      const teamId = user.teamId;
      const response = await axios.get(`https://localhost:7189/api/User/GetAllSubordinates?teamId=${teamId}`);
      setSubordinates(response.data);
    } catch (error) {
      console.error('Çalışanlar getirilemedi:', error);
    }
  };

  const [selectedSubordinateIds, setSelectedSubordinateIds] = useState([]);

  const handleChangeValidation = (field, value, isUpdate = false) => {
    const stateToUpdate = isUpdate ? currentDuty : newDuty;
    const setState = isUpdate ? setCurrentDuty : setNewDuty;
  
    setState((prevDuty) => ({
      ...prevDuty,
      [field]: value,
    }));
  
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value.trim() === '' ? `${field === 'Title' ? 'Başlık' : field === 'Explanation' ? 'Açıklama' : 'Bitiş tarihi'} gerekli.` : '',
    }));
  };



  const handleAddDuty = async () => {
    setTouched({
      title: true,
      explanation: true,
      deadline: true,
    });
    if (validateForm()) 
    {
      try {
        const dutyData = {
          ...newDuty,
          CreatedUserId: user.id,
          UpdatedUserId: user.id,
          DeadLine: newDuty.DeadLine + 'T23:59:59Z',
          createdTime: new Date().toISOString(),
          updatedTime: new Date().toISOString(),
          status: true
        };
  
        const response = await axios.post('https://localhost:7189/api/Duty/AddDutySubordinates', {
          duty: dutyData,
          ids: selectedSubordinateIds,
          CreatedUserId: user.id,
          UpdatedUserId: user.id,
          TeamId: user.teamId 
        });
  
        console.log(response.data);
        fetchDuties();
        setShowAddModal(false);
        setSelectedSubordinateIds([]);
        toast.success('Görev başarıyla eklendi!');
      } catch (error) {
        console.error('Görev eklenirken hata oluştu:', error);
        toast.error('Görev eklenirken bir hata oluştu.');
      }
    }
    
  };

  const handleUpdateDuty = async () => {
    setTouched({
      title: true,
      explanation: true,
      deadline: true,
    });
    const isFormValid = validateFormForUpdate(); 
    if (isFormValid) {

    try {
      await axios.put('https://localhost:7189/api/Duty/UpdateDuty', currentDuty);
      fetchDuties();
      setShowUpdateModal(false);
      toast.success('Görev başarıyla güncellendi!');
    } catch (error) {
      console.error('Görev güncellenirken hata oluştu:', error);
      toast.error('Görev güncellenirken bir hata oluştu.');
    }
  }
  };

  const validateFormForUpdate = () => {
    let valid = true;
    const newErrors = {
      title: '',
      explanation: '',
      deadline: '',
    };
  
    if (currentDuty.title?.trim() === '') {
      newErrors.title = 'Başlık gerekli.';
      valid = false;
    }
  
    if (currentDuty.explanation?.trim() === '') {
      newErrors.explanation = 'Açıklama gerekli.';
      valid = false;
    }
  
    if (currentDuty.deadLine?.trim() === '') {
      newErrors.deadline = 'Bitiş tarihi gerekli.';
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };

  
  const handleDeleteDuty = async (id) => {
    try {
      await axios.delete(`https://localhost:7189/api/Duty/DeleteDuty?id=${currentDuty.id}`);
      fetchDuties();
      setShowDeleteConfirmModal(false);
      toast.success('Görev başarıyla silindi!');
    } catch (error) {
      console.error('Görev silinirken hata oluştu:', error);
      toast.error('Görev silinirken bir hata oluştu.');
    }
  };


  const handleSelectTeamDuty = (id) => {
    setSelectedTeamDuties((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter(dutyId => dutyId !== id) : [...prevSelected, id]
    );
  };

  const handleDeleteSelectedDuties = async () => {
    try {
      const selectedIds = selectedTeamDuties.join(',');
      await axios.post(`https://localhost:7189/api/Duty/DeleteDutiesMultiply?selectedIds=${selectedIds}`);
      fetchDuties();
      setSelectedTeamDuties([]);
      toast.success('Görevler başarıyla silindi!');
    } catch (error) {
      console.error('Görevler silinirken hata oluştu:', error);
      toast.error('Görevler silinirken bir hata oluştu.');
    }
  };
  // Sayfalama hesaplamaları
  const indexOfLastDuty = currentPage * itemsPerPage;
  const indexOfFirstDuty = indexOfLastDuty - itemsPerPage;
  const currentDuties = filteredDuties.slice(indexOfFirstDuty, indexOfLastDuty);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredDuties.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="team-duty-page" style={{ marginLeft: '280px', marginTop: "-120px", marginRight: "70px" }}>
  <div className="header">
        <Button className="add-button" onClick={() => setShowAddModal(true)}>
          Görev Ekle
        </Button>
        <div className="title-container">
          <div className="title">Ekip Görevleri</div>
        </div>
        {selectedTeamDuties.length > 0 && (
          <Button variant="danger" onClick={handleDeleteSelectedDuties} style={{ marginRight: '50px' }}>
            Toplu Sil
          </Button>
        )}
        <div>
          <label htmlFor="itemsPerPage">Sayfa Başına Gösterilen Veriler:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleChange}
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="search-container" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Form.Control
          type="text"
          placeholder="Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>








      


      <Table striped bordered hover>
        <thead>
          <tr>
          <th></th>
            <th>Başlık</th>
            <th>Açıklama</th>
            <th>Son Tarih</th>
            <th>Aciliyet</th>
            <th>Durum</th>
            <th>Yetkili</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {currentDuties.map(duty => (
            <tr key={duty.id}>
                <td>
                <Form.Check
                  type="checkbox"
                  onChange={() => handleSelectTeamDuty(duty.id)}
                  checked={selectedTeamDuties.includes(duty.id)}
                />
              </td>
              <td>{duty.title}</td>
              <td>{duty.explanation}</td>
              <td>{duty.deadLine}</td>
              <td>{duty.emergencyName}</td>
              <td>{duty.progressName}</td>
              <td>{duty.userName}</td>
              <td>
              <Button variant="info" onClick={() => { setCurrentDuty(duty); setShowDetailModal(true); }}>
                    <FaInfoCircle />
                  </Button>{' '}
                  <Button variant="warning" onClick={() => { setCurrentDuty(duty); setShowUpdateModal(true); }}>
                    <FaEdit />
                  </Button>{' '}
                  <Button variant="danger" onClick={() => { setCurrentDuty(duty); setShowDeleteConfirmModal(true); }}>
                    <FaTrash />
                  </Button>{' '}
                
                  
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {pageNumbers.map(number => (
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Görev Ekle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Başlık</Form.Label>
            <Form.Control 
    type="text" 
    placeholder="Başlık" 
    value={newDuty.Title}
    onChange={(e) => handleChangeValidation('Title', e.target.value)}
    isInvalid={touched.title && !!errors.title}
  />
          </Form.Group>
          <Form.Group controlId="formExplanation">
            <Form.Label>Açıklama</Form.Label>
            <Form.Control 
    type="text" 
    placeholder="Açıklama" 
    value={newDuty.Explanation}
    onChange={(e) => handleChangeValidation('Explanation', e.target.value)}
    isInvalid={touched.explanation && !!errors.explanation}
  />
          </Form.Group>
          <Form.Group controlId="formDeadLine">
            <Form.Label>Bitiş Tarihi</Form.Label>
            <Form.Control 
    type="date" 
    value={newDuty.DeadLine}
    onChange={(e) => handleChangeValidation('DeadLine', e.target.value)}
    isInvalid={touched.deadline && !!errors.deadline}
  />
          </Form.Group>
          <Form.Group controlId="formEmergency">
            <Form.Label>Aciliyet</Form.Label>
            <Form.Control 
              as="select" 
              value={newDuty.Emergency}
              onChange={(e) => setNewDuty({ ...newDuty, Emergency: parseInt(e.target.value) })}
            >
              <option value={1}>Az</option>
              <option value={2}>Orta</option>
              <option value={3}>Çok</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formSubordinates">
            <Form.Label>Atanan Kullanıcılar</Form.Label>
            <Form.Control 
              as="select" 
              multiple
              value={selectedSubordinateIds}
              onChange={(e) => {
                const values = [...e.target.selectedOptions].map(option => option.value);
                setSelectedSubordinateIds(values);
              }}
            >
              {subordinates.map(subordinate => (
                <option key={subordinate.id} value={subordinate.id.toString()}>{subordinate.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Kapat</Button>
        <Button variant="primary" onClick={handleAddDuty}>Ekle</Button>
      </Modal.Footer>
    </Modal>

    
      {/* Görev Detay Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Görev Detayı</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Başlık:</strong> {currentDuty.title}</p>
          <p><strong>Açıklama:</strong> {currentDuty.explanation}</p>
          <p><strong>Bitiş Tarihi:</strong> {new Date(currentDuty.deadLine).toLocaleDateString()}</p>
          <p><strong>Aciliyet:</strong> {currentDuty.emergency === 1 ? 'Az' : currentDuty.emergency === 2 ? 'Orta' : 'Çok'}</p>
          <p><strong>Durum:</strong> {currentDuty.progress === 1 ? 'Yapılıyor' : currentDuty.progress === 2 ? 'Tamamlandı' : 'Başarısız'}</p>
          <p><strong>Yetkili:</strong> {currentDuty.userName}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Kapat</Button>
        </Modal.Footer>
      </Modal>

      {/* Görev Güncelle Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Görev Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUpdateTitle">
              <Form.Label>Başlık</Form.Label>
              <Form.Control 
                type="text" 
                value={currentDuty.title}
                onChange={(e) => handleChangeValidation('title', e.target.value, true)}
                isInvalid={touched.title && !!errors.title}
              />
                  <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formExplanation">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control 
                type="text" 
                value={currentDuty.explanation}
                onChange={(e) => handleChangeValidation('explanation', e.target.value, true)}
                isInvalid={touched.explanation && !!errors.explanation}
              />
                <Form.Control.Feedback type="invalid">
          {errors.explanation}
        </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formDeadLine">
              <Form.Label>Bitiş Tarihi</Form.Label>
              <Form.Control 
                type="date" 
                value={currentDuty.deadLine}
                onChange={(e) => handleChangeValidation('deadLine', e.target.value, true)}
                isInvalid={touched.deadline && !!errors.deadline}
              />
               <Form.Control.Feedback type="invalid">
          {errors.deadline}
        </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formEmergency">
              <Form.Label>Aciliyet</Form.Label>
              <Form.Control 
                as="select" 
                value={currentDuty.emergency}
                onChange={(e) => handleChangeValidation('emergency', e.target.value, true)}
                >
                <option value={1}>Az</option>
                <option value={2}>Orta</option>
                <option value={3}>Çok</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Kapat</Button>
          <Button variant="primary" onClick={handleUpdateDuty}>Güncelle</Button>
        </Modal.Footer>
      </Modal>

      {/* Görev Silme Onay Modal */}
      <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Silme Onayı</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bu görevi silmek istediğinizden emin misiniz?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>Kapat</Button>
          <Button variant="danger" onClick={handleDeleteDuty}>Sil</Button>
        </Modal.Footer>
      </Modal>
           
      <style jsx>{`
  .team-duty-page {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-left: 220px;
  margin-top: 20px;
  margin-right: 30px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  font-size: 26px;
  font-weight: 600;
  color: #343a40;
  margin: 0;
}

.add-button {
  background-color: #6c63ff;
  border: none;
  color: #fff;
  font-weight: 500;
  border-radius: 5px;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #5a52d0;
}

.duty-table {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.duty-table th {
  background-color: #f1f3f5;
  color: #495057;
  text-align: left;
  padding: 12px;
}

.duty-table td {
  vertical-align: middle;
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
}

.duty-table tr:last-child td {
  border-bottom: none;
}

.button-container {
  display: flex;
  gap: 8px;
}

.button-container .btn {
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.button-container .btn-info {
  background-color: #17a2b8;
  border: none;
  color: #fff;
}

.button-container .btn-info:hover {
  background-color: #138496;
}

.button-container .btn-warning {
  background-color: #ffc107;
  border: none;
  color: #333;
}

.button-container .btn-warning:hover {
  background-color: #e0a800;
}

.button-container .btn-danger {
  background-color: #dc3545;
  border: none;
  color: #fff;
}

.button-container .btn-danger:hover {
  background-color: #c82333;
}

/* Modal Styles */
.modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  position: absolute;
  top: 15%;
  left: 41%;
  transform: translate(-15%, -41%);
  width: 100%;
  max-width: 500px;
}


.modal-content {
  border-radius: 8px;
  border: none;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  max-width: 500px;
  width: 100%;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  background-color: #6c63ff;
  color: #ffffff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.modal-footer .btn-secondary {
  background-color: #6c757d;
  border: none;
  color: #ffffff;
  border-radius: 5px;
}

.modal-footer .btn-secondary:hover {
  background-color: #5a6268;
}

.modal-footer .btn-primary {
  background-color: #007bff;
  border: none;
  color: #ffffff;
  border-radius: 5px;
}

.modal-footer .btn-primary:hover {
  background-color: #0069d9;
}

.modal-footer .btn-danger {
  background-color: #dc3545;
  border: none;
  color: #ffffff;
  border-radius: 5px;
}

.modal-footer .btn-danger:hover {
  background-color: #c82333;
}

/* Overlay */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}



  `}</style>
  <ToastContainer />
    </div>
  );
};

export default TeamDutyPage;
