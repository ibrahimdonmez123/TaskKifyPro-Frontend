import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isManager, setIsManager] = useState(false);
  const [open, setOpen] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const id = user.id;
      const response = await axios.get(`https://localhost:7189/api/User/GetUserById?id=${id}`);
      const theuser = response.data;
      setIsManager(theuser.type);
    } catch (error) {
      console.error('Kullanıcı verisi getirilemedi:', error);
    }
  };

  const toggleSubmenu = (index) => {
    setOpen(open === index ? null : index);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/loginPage');
  };

  return (
    <>
      <div>
        <div className="sidebar">
          <Link to="/home" className="sidebar-logo">TASKKİFYPRO</Link>

          <button className="toggle-btn" onClick={() => toggleSubmenu(1)}>Görevler</button>
          <div className={`submenu ${open === 1 ? 'open' : ''}`}>
            <ul>
              <li><Link to="personelDutyPage">Bireysel </Link></li>
              {isManager && <li><Link to="teamDutyPage">Ekip</Link></li>}
            </ul>
          </div>

          {isManager && (
            <>
              <button className="toggle-btn" onClick={() => toggleSubmenu(0)}>Takım</button>
              <div className={`submenu ${open === 0 ? 'open' : ''}`}>
                <ul>
                  <li><Link to="userPage">Katılımcılar</Link></li>
                  <li><Link to="teamPage">Takımımız</Link></li>
                </ul>
              </div>
            </>
          )}

          <button className="toggle-btn" onClick={() => toggleSubmenu(2)}>Performanslar</button>
          <div className={`submenu ${open === 2 ? 'open' : ''}`}>
            <ul>
              <li><Link to="personelPerformancePage">Bireysel</Link></li>
              {isManager && <li><Link to="teamPerformancePage">Ekip</Link></li>}
            </ul>
          </div>

          <button className="toggle-btn" onClick={handleLogout}>Çıkış Yap</button>
        </div>

        <div className="content">
        </div>

        <style jsx>{`
          @keyframes gradientBackground {
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

  body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    color: #212529;
    background-color: #F8F9FA;
  }

  .sidebar {
    width: 280px;
    height: 100vh;
    background: linear-gradient(270deg, #4a90e2, #007BFF, #0056b3);
    background-size: 400% 400%;
    animation: gradientBackground 12s ease infinite;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    padding: 30px 20px;
    position: fixed;
    left: 0;
    top: 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: width 0.3s ease;
  }

  .sidebar-logo {
    font-size: 25px;
    font-weight: bold;
    color: #FFFFFF;
    text-decoration: none;
    margin-bottom: 25px;
    display: block;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
    transition: transform 0.3s ease, color 0.3s ease;
    border: 2px solid #FFFFFF;
    padding: 10px 15px;
    border-radius: 10px;
    background: linear-gradient(45deg, #1E90FF, #89CFF0);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  }

  .sidebar-logo:hover {
    transform: scale(1.1);
    color: #f8f9fa;
    background: linear-gradient(45deg, #89CFF0, #1E90FF);
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3);
  }

  .toggle-btn {
    background: none;
    border: none;
    color: #FFFFFF;
    font-size: 20px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    padding: 15px;
    border-radius: 8px;
    width: 100%;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  }

  .toggle-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: #f8f9fa;
    transform: scale(1.05);
  }

  .submenu {
    display: none;
    margin-left: 20px;
    transition: all 0.3s ease;
  }

  .submenu.open {
    display: block;
  }

  .submenu ul {
    list-style: none;
    padding: 5px;
    margin: 0;
  }

  .submenu li {
    margin-bottom: 12px;
  }

  .submenu a {
    color: #FFFFFF;
    text-decoration: none;
    font-size: 18px;
    transition: color 0.3s ease, transform 0.3s ease;
  }

  .submenu a:hover {
    color: #f8f9fa;
    transform: translateX(5px);
  }

  .content {
    margin-left: 280px;
    padding: 30px;
    transition: margin-left 0.3s ease;
  }

  button {
    background-color: #0056b3;
    color: #FFFFFF;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  button:hover {
    background-color: #004080;
    transform: scale(1.05);
  }

  button:active {
    transform: scale(0.98);
  }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar;
