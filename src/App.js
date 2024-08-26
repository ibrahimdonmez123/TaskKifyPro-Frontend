import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import UserPage from './pages/User/UserPage';
import PersonelDutyPage from './pages/PersonelDuty/PersonelDutyPage';
import TeamDutyPage from './pages/TeamDuty/TeamDutyPage';
import PersonelPerformancePage from './pages/PersonelPerformance/PersonelPerformancePage';
import TeamPerformancePage from './pages/TeamPerformance/TeamPerformancePage';
import TeamPage from './pages/Team/TeamPage';
import LoginPage from './pages/Login/LoginPage';
import axios from 'axios';
import './App.css';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (user && user.id) {
        const id = user.id;
        const response = await axios.get(`https://localhost:7189/api/User/GetUserById?id=${id}`);
        const theuser = response.data;
        setIsManager(theuser.type); 
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false); 
      }
    } catch (error) {
      console.error('Kullanıcı verisi getirilemedi:', error);
      setIsAuthenticated(false); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/loginPage" element={<LoginPage />} />
        {isAuthenticated ? (
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<Home />} />
            {isManager ? (
              <>
                <Route path="userPage" element={<UserPage />} />
                <Route path="teamDutyPage" element={<TeamDutyPage />} />
                <Route path="teamPerformancePage" element={<TeamPerformancePage />} />
              </>
            ) : (
              <>
                <Route path="userPage" element={<Navigate to="/" replace />} />
                <Route path="teamDutyPage" element={<Navigate to="/" replace />} />
                <Route path="teamPerformancePage" element={<Navigate to="/" replace />} />
              </>
            )}
            <Route path="personelDutyPage" element={<PersonelDutyPage />} />
            <Route path="personelPerformancePage" element={<PersonelPerformancePage />} />
            <Route path="teamPage" element={<TeamPage />} />
            <Route path="/" element={<Navigate to="home" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/loginPage" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
