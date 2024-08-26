import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


const PersonelPerformancePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [performances, setPerformances] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPerformance, setCurrentPerformance] = useState({});
  
  useEffect(() => {
    fetchPerformances();
  }, []);
  
  const fetchPerformances = async () => {
    try {
      const response = await axios.get(`https://localhost:7189/api/Performance/GetAllPersonel?id=${user.id}`);
      setPerformances(response.data);
    } catch (error) {
      console.error('Performanslar getirilemedi:', error);
    }
  };

  const handleShowDetail = (performance) => {
    setCurrentPerformance(performance);
    setShowDetailModal(true);
  };


  

    


  return (
    <div className="performance-page" style={{ marginLeft: '280px', marginTop: "-110px", marginRight: "70px" }}>
      <div className="header">
        <div className="title-container">
          <div style={{marginLeft:"380px"}} className="title">Kişisel Performans</div>
        </div>
      </div>

      <Table striped bordered hover className="performance-table">
        <thead>
          <tr>
            <th>Performans Notu</th>
            <th>Oluşturulma Tarihi</th>
            <th>Güncellenme Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {performances.map(performance => (
            <tr key={performance.id}>
              <td>{performance.performanceNote}</td>
              <td>{new Date(performance.createdTime).toLocaleDateString()}</td>
              <td>{new Date(performance.updatedTime).toLocaleDateString()}</td>
              <td>
                <Button variant="info" onClick={() => handleShowDetail(performance)}>
                  <FaInfoCircle />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Performans Detay Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Performans Detayları</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Performans Notu: {currentPerformance.performanceNote}</p>
          <p>Oluşturulma Tarihi: {new Date(currentPerformance.createdTime).toLocaleDateString()}</p>
          <p>Güncellenme Tarihi: {new Date(currentPerformance.updatedTime).toLocaleDateString()}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Kapat</Button>
        </Modal.Footer>
      </Modal>
           
      <style jsx>{`
 .performance-page {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-left: 300px;
  margin-top: -80px;
  margin-right: -30px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title-container {
  flex: 1;
}

.title {
  font-size: 26px;
  font-weight: 600;
  color: #343a40;
  margin: 0;
}

.performance-table {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.performance-table th {
  background-color: #f1f3f5;
  color: #495057;
  text-align: left;
  padding: 12px;
}

.performance-table td {
  vertical-align: middle;
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
}

.performance-table tr:last-child td {
  border-bottom: none;
}

.performance-table .btn-info {
  background-color: #17a2b8;
  border: none;
  color: #fff;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.performance-table .btn-info:hover {
  background-color: #138496;
}

/* Modal Styles */
.modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  position: absolute;
  top: 15%;
  left: 36%;
  transform: translate(-15%, -36%);
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
}

export default PersonelPerformancePage;
