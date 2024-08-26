import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiOutlineClose } from 'react-icons/ai';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));


  const [notifications, setNotifications] = useState([]);
  const [visibleCards, setVisibleCards] = useState({
    completed: true,
    today: true,
    failed: true,
  });

  const teamId = user.teamId;
useEffect(() => {
  axios.get(`https://localhost:7189/api/Home/GetAllNotification?teamId=${teamId}`)
    .then(response => {
      setNotifications(response.data);
      console.log('Birazdan notificationlar yazdırılacak');
      console.log(response.data); 
    })
    .catch(error => {
      console.error("Hata", error);
    });
}, []);

  const getTodayTasks = () => notifications.filter(notification => 
    notification.title === 'Görevin son günü' &&
    new Date(notification.createdTime).toDateString() === new Date().toDateString()
  );

  const getCompletedTasks = () => notifications.filter(notification =>
    notification.title === 'Görev Tamamlandı'
  );

  const getFailedTasks = () => notifications.filter(notification =>
    notification.title === 'Görev Başarısız' &&
    new Date(notification.updatedTime) < new Date()
  );

  const handleClose = (cardType) => {
    setVisibleCards(prevState => ({
      ...prevState,
      [cardType]: false
    }));
  };


  const [userinfo, setUserinfo] = useState(null); 
  const id = user.id;

  useEffect(() => {
    axios.get(`https://localhost:7189/api/User/GetUserInfo?id=${id}`)
      .then(response => {
        setUserinfo(response.data);
        console.log('Birazdan notificationlar yazdırılacak');
        console.log(response.data); 
      })
      .catch(error => {
        console.error("Hata", error);
      });
  }, [id]); 

  if (!userinfo) {
    return <div>Yükleniyor...</div>;
  }


  return (
    <Container className="container">
    <div class="user-info-container">
  <div class="user-info-item">
    <span class="user-info-label">Kullanıcı Adı:</span>
    <span class="user-info-value">{userinfo.userName}</span>
  </div>
  <div class="user-info-item">
    <span class="user-info-label">Kullanıcı Soyadı:</span>
    <span class="user-info-value">{userinfo.userSurname}</span>
  </div>
  <div class="user-info-item">
    <span class="user-info-label">Takım Adı:</span>
    <span class="user-info-value">{userinfo.userTeamName}</span>
  </div>
</div>


      <Row>
        {visibleCards.completed && (
          <Col md={4}>
            <Card className="card card-success">
              <Card.Header>
              <strong style={{marginLeft:'70px' }}>TAMAMLANANLAR</strong>
              <Button variant="link" onClick={() => handleClose('completed')} style={{ float: 'right' }}>
                  <AiOutlineClose />
                </Button>
              </Card.Header>
              <Card.Body>
                {getCompletedTasks().map(notification => (
                  <Card key={notification.id} className="mb-2">
                    <Card.Body>
                      <Card.Title>{notification.title}</Card.Title>
                      <Card.Text>{notification.message}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Col>
        )}
        {visibleCards.today && (
          <Col md={4}>
            <Card className="card card-warning">
              <Card.Header>
              <strong style={{marginLeft:'105px' }}>DEADLINE</strong>
              <Button variant="link" onClick={() => handleClose('today')} style={{ float: 'right' }}>
                  <AiOutlineClose />
                </Button>
              </Card.Header>
              <Card.Body>
                {getTodayTasks().map(notification => (
                  <Card key={notification.id} className="mb-2">
                    <Card.Body>
                      <Card.Title>{notification.title}</Card.Title>
                      <Card.Text>{notification.message}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Col>
        )}
        {visibleCards.failed && (
          <Col md={4}>
            <Card className="card card-danger">
              <Card.Header>
              <strong style={{marginLeft:'105px' }}>BAŞARISIZ</strong>
                <Button variant="link" onClick={() => handleClose('failed')} style={{ float: 'right' }}>
                  <AiOutlineClose />
                </Button>
              </Card.Header>
              <Card.Body>
                {getFailedTasks().map(notification => (
                  <Card key={notification.id} className="mb-2">
                    <Card.Body>
                      <Card.Title>{notification.title}</Card.Title>
                      <Card.Text>{notification.message}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
      <style jsx>{`
        /* CSS dosyası: Home.css */

        /* Genel stil ayarları */
        .container {
          padding: 20px;
          margin-left: 250px;
          margin-top: -131px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          min-height: 100vh;
          transition: all 0.3s ease;
        }

        /* Başlık */
        h1 {
          font-size: 28px;
          font-weight: 600;
          color: #343a40;
          margin: 0;
        }

        /* Row ayarları */
        .row {
          margin-left: 0;
          margin-right: 0;
        }

        /* Kolayca birbirine yaslanması için */
        .col-md-4 {
          padding: 0 15px;
        }

        /* Card Stilleri */
        .card {
          border-radius: 8px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          margin-bottom: 15px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #ffffff;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          font-size: 20px;
          font-weight: 600;
          background-color: transparent;
          border-bottom: none;
          transition: background-color 0.3s ease;
        }

        .card-body {
          padding: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 500;
          color: #343a40;
        }

        .card-text {
          font-size: 14px;
          color: #495057;
        }

        /* Card Renkleri */
   .card-success {
background: linear-gradient(270deg, #4caf50, #66bb6a, #81c784, #a5d6a7, #4caf50);
  background-size: 800% 800%;
  color: #ffffff;
  animation: gradientAnimation 5s ease infinite;
}


  .card-warning {
background: linear-gradient(270deg, #f7e81d, #f7d54c, #f7c20f, #f7b400, #f7a02d, #f7e81d);
  background-size: 800% 800%;
  color: #ffffff;
  animation: gradientAnimation 5s ease infinite;
        }

        .card-danger {
background: linear-gradient(270deg, #ff4b5c, #ff6f61, #ff8a80, #ff4b5c);
  background-size: 800% 800%;
  color: #ffffff;
  animation: gradientAnimation 5s ease infinite;
        }


@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}


      

        /* Close Button */
        .btn-link {
          color: #ffffff;
          transition: color 0.3s ease;
        }

        .btn-link:hover {
          color: #f8f9fa;
        }

        /* Background için hafif hareket efekti */
        .container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(220, 53, 69, 0.1));
          opacity: 0.5;
          z-index: -1;
          animation: backgroundAnimation 5s infinite alternate ease-in-out;
        }

        @keyframes backgroundAnimation {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

       .user-info-container {
  display: flex; /* Flexbox ile düzenleme */
  justify-content: space-between; /* Öğeleri aralarındaki boşlukları eşit şekilde dağıtmak için */
  background-color: #f5f5f5; /* Açık gri arka plan rengi */
  border-radius: 8px; /* Köşeleri yuvarlatmak için */
  padding: 20px; /* İçerik alanı etrafında boşluk */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Hafif gölge efekti */
  max-width: 800px; /* Maksimum genişlik */
  margin: 20px auto; /* Ortalanmış margin */
}

.user-info-item {
  display: flex; /* Flexbox ile düzenleme */
  flex-direction: column; /* Etiket ve değeri dikey olarak hizalamak için */
  align-items: center; /* Merkezi hizalama */
}

.user-info-label {
  font-weight: bold; /* Etiketlerin kalın yazılması için */
  color: #333; /* Koyu gri renk */
  margin-bottom: 5px; /* Alt boşluk */
}

.user-info-value {
  font-size: 16px; /* Yazı boyutu */
  color: #555; /* Açık gri renk */
}


      `}</style>
    </Container>
  );
};

export default Home;
