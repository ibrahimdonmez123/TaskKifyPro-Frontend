import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form, Pagination } from 'react-bootstrap';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // CSS dosyasını eklemeyi unutmayın

const UserPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredUsers, setFilteredUsers] = useState([]); 

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Başlangıç değeri olarak 2 ayarlandı

  const handleChange = (event) => {
    setItemsPerPage(Number(event.target.value));
  };
  const handleSelectUser = (id) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((userId) => userId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  });
  
  const handleDeleteSelectedUsers = async () => {
    try {
      const selectedIds = selectedUsers.join(',');
      await axios.post(`https://localhost:7189/api/User/DeleteUsersMultiply?selectedIds=${selectedIds}`);
      fetchUsers();
      setSelectedUsers([]); 
      toast.success('Kullanıcılar başarıyla silindi!');
    } catch (error) {
      console.error('Kullanıcılar silinirken hata oluştu:', error);
      toast.error('Kullanıcılar silinirken bir hata oluştu.');
    }
  };

  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [newUser, setNewUser] = useState({
    Name: '',
    SurName: '',
    Adres: '',
    Phone: '',
    Email: '',
    Type: false,
    TeamId: user.teamId,
    Password: '',
    CreatedUserId:'',
    UpdatedUserId:'',
  });

  const [errors, setErrors] = useState({
    name: '',
    surName: '',
    adres: '',
    phone: '',
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    surName: false,
    adres: false,
    phone: false,
    email: false,
    password: false,
  });
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      surName: '',
      adres: '',
      phone: '',
      email: '',
      password: '',
    };
  
    if (newUser.Name.trim() === '') {
      newErrors.name = 'İsim gerekli.';
      valid = false;
    }
  
    if (newUser.SurName.trim() === '') {
      newErrors.surName = 'Soyisim gerekli.';
      valid = false;
    }
  
    if (newUser.Adres.trim() === '') {
      newErrors.adres = 'Adres gerekli.';
      valid = false;
    }
  
    if (newUser.Phone.trim() === '') {
      newErrors.phone = 'Telefon gerekli.';
      valid = false;
    }
  
    if (newUser.Email.trim() === '') {
      newErrors.email = 'Email gerekli.';
      valid = false;
    }
  
    if (newUser.Password.trim() === '') {
      newErrors.password = 'Şifre gerekli.';
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    fetchUsers();
  });


  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://localhost:7189/api/User/GetAll?TeamId=${user.teamId}`);
      setUsers(response.data);
      setFilteredUsers(response.data); 
    } catch (error) {
      console.error('Kullanıcılar getirilemedi:', error);
    }
  };


  const handleChangeValidation = (field, value, isUpdate = false) => {
    const stateToUpdate = isUpdate ? currentUser : newUser;
    const setState = isUpdate ? setCurrentUser : setNewUser;
  
    setState((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value.trim() === '' ? 
        `${field === 'Name' ? 'İsim' : 
        field === 'SurName' ? 'Soyisim' : 
        field === 'Adres' ? 'Adres' : 
        field === 'Phone' ? 'Telefon' : 
        field === 'Email' ? 'Email' : 
        field === 'Password' ? 'Şifre' : ''} gerekli.` : '',
    }));
  };


  const handleAddUser = async () => {
    setTouched({
      name: true,
      surName: true,
      adres: true,
      phone: true,
      email: true,
      password: true,
    });
  
    if (validateForm()) {
      try {
        newUser.TeamId = user.teamId;
        console.log(newUser);
       newUser.createdUserId = user.id;
       newUser.updatedUserId = user.id;
        await axios.post('https://localhost:7189/api/User/RegisterUser', newUser);
        fetchUsers();
        setShowAddModal(false);
        toast.success('Kayıt başarıyla oluşturuldu!');
      } catch (error) {
        console.error('Kullanıcı eklenirken hata oluştu:', error);
        toast.error('Kayıt yapılırken bir hata oluştu.');
      }
    }
  };
  


  const handleUpdateUser = async () => {
    setTouched({
      name: true,
      surName: true,
      adres: true,
      phone: true,
      email: true,
      password: true,
    });
    const isFormValid = validateFormForUpdate(); // Güncelleme için özel bir doğrulama fonksiyonu ekleyin

    if (isFormValid) {
    try {
      currentUser.updatedUserId = user.id;
      await axios.put('https://localhost:7189/api/User/UpdateUser', currentUser);
      fetchUsers();
      setShowUpdateModal(false);
      toast.success('Kullanıcı başarıyla güncellendi!');
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata oluştu:', error);
      toast.error('Kullanıcı güncellenirken bir hata oluştu.');
    }
  }
  };

  const validateFormForUpdate = () => {
    let valid = true;
    const newErrors = {
      name: '',
      surName: '',
      adres: '',
      phone:'',
      email:'',
      password:'',
    };
  
    if (currentUser.name?.trim() === '') {
      newErrors.name = 'İsim gerekli.';
      valid = false;
    }

    if (currentUser.surName?.trim() === '') {
      newErrors.surName = 'Soyisim gerekli.';
      valid = false;
    }
   
    if (currentUser.adres?.trim() === '') {
      newErrors.adres = 'Adres gerekli.';
      valid = false;
    }
    if (currentUser.phone?.trim() === '') {
      newErrors.phone = 'Telefon gerekli.';
      valid = false;
    }
    if (currentUser.email?.trim() === '') {
      newErrors.email = 'Email gerekli.';
      valid = false;
    }
    if (currentUser.password?.trim() === '') {
      newErrors.password = 'Şifre gerekli.';
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };


  const handleDeleteUser = async (id) => {
    try {
      currentUser.updatedUserId = user.id;
      await axios.delete(`https://localhost:7189/api/User/DeleteUser?id=${id}`);
      fetchUsers();
      setShowDeleteModal(false);
      toast.success('Kullanıcı başarıyla silindi!');
    } catch (error) {
      console.error('Kullanıcı silinirken hata oluştu:', error);
      toast.error('Kullanıcı silinirken bir hata oluştu.');
    }
  };

  // Sayfalama hesaplamaları
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="user-page" style={{ marginLeft: '280px', marginTop: "-110px", marginRight: "70px" }}>
<div className="header">
        <Button className="add-button" onClick={() => setShowAddModal(true)}>
          Katılımcı Ekle
        </Button>
        <div className="title-container">
          <div style={{marginLeft:"270px"}}className="title">Katılımcılar</div>
        </div>
        {selectedUsers.length > 0 && (
          <Button variant="danger" onClick={handleDeleteSelectedUsers} style={{ marginRight: '50px' }}>
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










 

      <Table striped bordered hover className="user-table">
        <thead>
          <tr>
            <th></th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Telefon</th>
            <th>Email</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  onChange={() => handleSelectUser(user.id)}
                  checked={selectedUsers.includes(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.surName}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>
                <div className="button-container">
                  <Button variant="info" onClick={() => { setCurrentUser(user); setShowDetailModal(true); }}>
                    <FaInfoCircle />
                  </Button>{' '}
                  <Button variant="warning" onClick={() => { setCurrentUser(user); setShowUpdateModal(true); }}>
                    <FaEdit />
                  </Button>{' '}
                  <Button variant="danger" onClick={() => { setCurrentUser(user); setShowDeleteModal(true); }}>
                    <FaTrash />
                  </Button>
                </div>
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

      

      {/* Kullanıcı Ekleme Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header>
          <Modal.Title>Kullanıcı Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Ad</Form.Label>
              <Form.Control
  type="text"
  placeholder="Ad"
  onChange={(e) => handleChangeValidation('Name', e.target.value)}
  isInvalid={touched.name && !!errors.name}
/>
            </Form.Group>
            <Form.Group controlId="formSurName">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
  type="text"
  placeholder="Soyad"
  onChange={(e) => handleChangeValidation('SurName', e.target.value)}
  isInvalid={touched.surName && !!errors.surName}
/>
              
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Adres</Form.Label>
              <Form.Control
  type="text"
  placeholder="Adres"
  onChange={(e) => handleChangeValidation('Adres', e.target.value)}
  isInvalid={touched.adres && !!errors.adres}
/>
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
  type="text"
  placeholder="Telefon"
  onChange={(e) => handleChangeValidation('Phone', e.target.value)}
  isInvalid={touched.phone && !!errors.phone}
/>
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
  type="email"
  placeholder="Email"
  onChange={(e) => handleChangeValidation('Email', e.target.value)}
  isInvalid={touched.email && !!errors.email}
/>
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
  type="password"
  placeholder="Şifre"
  onChange={(e) => handleChangeValidation('Password', e.target.value)}
  isInvalid={touched.password && !!errors.password}
/>
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Check
                type="checkbox"
                label="Yönetici"
                onChange={(e) => setNewUser({ ...newUser, Type: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Kapat
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Kullanıcı Güncelleme Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header>
          <Modal.Title>Kullanıcı Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.name || ''}
                onChange={(e) => handleChangeValidation('name', e.target.value, true)}
                isInvalid={touched.name && !!errors.name}              />
            </Form.Group>
            <Form.Group controlId="formSurName">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.surName || ''}
                onChange={(e) => handleChangeValidation('surName', e.target.value, true)}
                isInvalid={touched.surName && !!errors.surName}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Adres</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.adres || ''}
                onChange={(e) => handleChangeValidation('adres', e.target.value, true)}
                isInvalid={touched.adres && !!errors.adres}              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.phone || ''}
                onChange={(e) => handleChangeValidation('phone', e.target.value, true)}
                isInvalid={touched.phone && !!errors.phone}              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser.email || ''}
                onChange={(e) => handleChangeValidation('email', e.target.value, true)}
                isInvalid={touched.email && !!errors.email}              />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Check
                type="checkbox"
                label="Yönetici"
                checked={currentUser.type || false}
                onChange={(e) => setCurrentUser({ ...currentUser, type: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Kapat
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Güncelle
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header>
          <Modal.Title>Kullanıcı Güncelle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.name || ''}
              />
            </Form.Group>
            <Form.Group controlId="formSurName">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.surName || ''}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Adres</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.adres || ''}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.phone || ''}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser.email || ''}
              />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Check
                type="checkbox"
                label="Yönetici"
                checked={currentUser.type || false}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Kapat
          </Button>
        
        </Modal.Footer>
      </Modal>


      {/* Kullanıcı Silme Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Kullanıcı Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{currentUser.name} kullanıcısını silmek istediğinize emin misiniz?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={() => handleDeleteUser(currentUser.id)}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
      <style jsx>{`
  /* CSS dosyası: user-page.css */

.user-page {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-left: 220px;
  margin-top: 20px;
  margin-right: 30px;
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

/* Kullanıcı Tablosu */
.user-table {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.user-table th {
  background-color: #f1f3f5;
  color: #495057;
  text-align: left;
  padding: 12px;
}

.user-table td {
  vertical-align: middle;
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
}

.user-table tr:last-child td {
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
.modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  position: absolute;
  top: 10%;
  left: 36%;
  transform: translate(-10%, -36%);
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

<ToastContainer />
    </div>
  );
};

export default UserPage;

    