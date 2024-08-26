import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const TeamPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [teams, setTeams] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({});
  const [newTeam, setNewTeam] = useState({
    Name: '',
    RegisterName: '',
    RegisterSurName: '',
    RegisterEmail: '',
    RegisterAdres: '',
    RegisterPhone: '',
    RegisterPassword: '',
    CreatedUserId:user.id,
    UpdatedUserId:user.id,

  });
  
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const id = user.teamId;
      const response = await axios.get(`https://localhost:7189/api/Team/GetTheTeam?id=${id}`);
      setTeams(response.data);
    } catch (error) {
      console.error('Takımlar getirilemedi:', error);
    }
  };

  const validateTeam = (team) => {
    const errors = {};
    if (!team.Name) errors.Name = 'İsim gereklidir';
    if (!team.RegisterName) errors.RegisterName = 'Kayıt ismi gereklidir';
    if (!team.RegisterSurName) errors.RegisterSurName = 'Kayıt soyismi gereklidir';
    if (!team.RegisterEmail || !/\S+@\S+\.\S+/.test(team.RegisterEmail)) errors.RegisterEmail = 'Geçerli bir email adresi gereklidir';
    if (!team.RegisterAdres) errors.RegisterAdres = 'Adres gereklidir';
    if (!team.RegisterPhone || !/^\d{10}$/.test(team.RegisterPhone)) errors.RegisterPhone = 'Geçerli bir telefon numarası gereklidir';
    if (!team.RegisterPassword || team.RegisterPassword.length < 6) errors.RegisterPassword = 'Şifre en az 6 karakter olmalıdır';
    return errors;
  };

  const handleAddTeam = async () => {
    const errors = validateTeam(newTeam);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    try {
   
console.log('birazdan takımın bilgielri yazdırılacak');
console.log(newTeam);
      await axios.post('https://localhost:7189/api/Team/AddTeam', newTeam);
      fetchTeams();
      setShowAddModal(false);
      toast.success('Takım başarıyla eklendi!');
    } catch (error) {
      console.error('Takım eklenirken hata oluştu:', error);
      toast.error('Takım eklenirken bir hata oluştu.');
    }
  };

  const handleUpdateTeam = async () => {
    try {
      await axios.put('https://localhost:7189/api/Team/UpdateTeam', currentTeam);
      fetchTeams();
      setShowUpdateModal(false);
      toast.success('Takım başarıyla güncellendi!');
    } catch (error) {
      console.error('Takım güncellenirken hata oluştu:', error);
      toast.error('Takım güncellenirken bir hata oluştu.');
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      await axios.delete(`https://localhost:7189/api/Team/DeleteTeam?id=${id}`);
      fetchTeams();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Takım silinirken hata oluştu:', error);
    }
  };

  const [selectedTeams, setSelectedTeams] = useState([]);

  const handleSelectTeam = (id) => {
    setSelectedTeams((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((teamId) => teamId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleDeleteSelectedTeams = async () => {
    try {
      const selectedIds = selectedTeams.join(',');
      await axios.post(`https://localhost:7189/api/Team/DeleteTeamsMultiply?selectedIds=${selectedIds}`);
      fetchTeams();
      setSelectedTeams([]); // Seçimleri temizle
    } catch (error) {
      console.error('Kullanıcılar silinirken hata oluştu:', error);
    }
  };

  return (
    <div className="team-page" style={{ marginLeft: '280px', marginTop: "-110px", marginRight: "70px" }}>
      <div className="header">
        <Button style={{ marginRight: '250px' }} className="add-button" onClick={() => setShowAddModal(true)}>
          Yeni Takım Ekle
        </Button>
        <div className="title-container">
          <div className="title">Takım Yönetimi</div>
        </div>
        {selectedTeams.length > 0 && (
          <Button variant="danger" onClick={handleDeleteSelectedTeams} style={{ marginLeft: '20px' }}>
            Toplu Sil
          </Button>
        )}
      </div>

      <Table striped bordered hover className="team-table">
        <thead>
          <tr>
            <th>İsim</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>
                <div className="button-container">
                  <Button variant="info" onClick={() => { setCurrentTeam(team); setShowDetailModal(true); }}>
                    <FaInfoCircle />
                  </Button>{' '}
                  <Button variant="warning" onClick={() => { setCurrentTeam(team); setShowUpdateModal(true); }}>
                    <FaEdit />
                  </Button>{' '}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Takım Ekleme Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header>
          <Modal.Title>Takım Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type="text"
                placeholder="İsim"
                value={newTeam.Name}
                onChange={(e) => {
                  setNewTeam({ ...newTeam, Name: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, Name: '' }));
                }}
                isInvalid={!!formErrors.Name}
              />
              <Form.Control.Feedback type="invalid">{formErrors.Name}</Form.Control.Feedback>
            </Form.Group>
            <div style={{padding:'5px'}}>
            <label>Oluşturulacak yeni ekibin liderinin kayıt bilgileri</label></div>
            <Form.Group controlId="formRegisterName">
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type="text"
                placeholder="İsim"
                value={newTeam.RegisterName}
                onChange={(e) => {
                  setNewTeam({ ...newTeam, RegisterName: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, RegisterName: '' }));
                }}
                isInvalid={!!formErrors.RegisterName}
              />
              <Form.Control.Feedback type="invalid">{formErrors.RegisterName}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formRegisterSurName">
              <Form.Label>Soy İsim</Form.Label>
              <Form.Control
                type="text"
                placeholder="Soyisim"
                value={newTeam.RegisterSurName}
                onChange={(e) => {
                  setNewTeam({ ...newTeam, RegisterSurName: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, RegisterSurName: '' }));
                }}
                isInvalid={!!formErrors.RegisterSurName}
              />
              <Form.Control.Feedback type="invalid">{formErrors.RegisterSurName}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formRegisterEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={newTeam.RegisterEmail}
                onChange={(e) => {
                  setNewTeam({ ...newTeam, RegisterEmail: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, RegisterEmail: '' }));
                }}
                isInvalid={!!formErrors.RegisterEmail}
              />
              <Form.Control.Feedback type="invalid">{formErrors.RegisterEmail}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formRegisterAdres">
              <Form.Label>Adres</Form.Label>
              <Form.Control
                type="text"
                placeholder="Adres"
                value={newTeam.RegisterAdres}
                onChange={(e) => {
                  setNewTeam({ ...newTeam, RegisterAdres: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, RegisterAdres: '' }));
                }}
                isInvalid={!!formErrors.RegisterAdres}
              />
              <Form.Control.Feedback type="invalid">{formErrors.RegisterAdres}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formRegisterPhone">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                placeholder="Telefon"
                value={newTeam.RegisterPhone}
                onChange={(e) => {
                  setNewTeam({ ...newTeam, RegisterPhone: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, RegisterPhone: '' }));
                }}
                isInvalid={!!formErrors.RegisterPhone}
              />
              <Form.Control.Feedback type="invalid">{formErrors.RegisterPhone}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formRegisterPassword">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                placeholder="Şifre"
                value={newTeam.RegisterPassword}
                onChange={(e) => {
                  setNewTeam({ ...newTeam, RegisterPassword: e.target.value });
                  setFormErrors((prevErrors) => ({ ...prevErrors, RegisterPassword: '' }));
                }}
                isInvalid={!!formErrors.RegisterPassword}
              />
              <Form.Control.Feedback type="invalid">{formErrors.RegisterPassword}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Kapat</Button>
          <Button variant="primary" onClick={handleAddTeam}>Ekle</Button>
        </Modal.Footer>
      </Modal>

      {/* Takım Güncelleme Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header>
          <Modal.Title>Takım Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUpdateName">
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type="text"
                placeholder="İsim"
                value={currentTeam.name || ''}
                onChange={(e) => setCurrentTeam({ ...currentTeam, name: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Kapat</Button>
          <Button variant="primary" onClick={handleUpdateTeam}>Güncelle</Button>
        </Modal.Footer>
      </Modal>

      {/* Takım Detay Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header>
          <Modal.Title>Takım Detay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDetailName">
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type="text"
                placeholder="İsim"
                value={currentTeam.name || ''}
                readOnly
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Kapat</Button>
        </Modal.Footer>
      </Modal>

      {/* Takım Silme Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Takımı Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bu takımı silmek istediğinizden emin misiniz?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Kapat</Button>
          <Button variant="danger" onClick={() => handleDeleteTeam(currentTeam.id)}>Sil</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
      <style jsx>{`
  /* CSS dosyası: TeamPage.css */

/* Genel stil ayarları */
.team-page {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-left: 300px;
  margin-top: -10px;
  margin-right: -70px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Header */
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

.delete-selected-button {
  background-color: #dc3545;
  border: none;
  color: #fff;
  font-weight: 500;
  border-radius: 5px;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.delete-selected-button:hover {
  background-color: #c82333;
}

/* Takım Tablosu */
.team-table {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.team-table th {
  background-color: #f1f3f5;
  color: #495057;
  text-align: left;
  padding: 12px;
}

.team-table td {
  vertical-align: middle;
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
}

.team-table tr:last-child td {
  border-bottom: none;
}

/* Butonlar */
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

/* Modal Stilleri */
/* Modal Stilleri */
.modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  position: absolute;
  top: 5%;
  left: 36%;
  transform: translate(-5%, -36%);
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

/* Modal Overlay */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}


  `}</style>
  

    </div>
  );
};

export default TeamPage;



    