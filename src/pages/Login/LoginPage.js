import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7189/api/User/login', {
        email,
        password
      });

      const { teamId, id } = response.data;

      const user = { email, password, teamId, id };
      localStorage.setItem('user', JSON.stringify(user));

      if (response.status === 200) {
        navigate('/Home');
      }
    } catch (err) {
      setError('Geçersiz e-posta veya şifre.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Giriş Yap</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-posta:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Giriş Yap</button>
        </form>
      </div>
      <style jsx>{`
      /* CSS dosyası: login.css */

/* Genel stil ayarları */
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
    background: linear-gradient(270deg, #89CFF0, #1E90FF, #4682B4, #5F9EA0);
    background-size: 800% 800%;
    animation: gradientBackground 15s ease infinite;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

h1 {
    font-size: 3em;
    color: #fff;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

/* Giriş sayfası kapsayıcı */
.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width:400px;

}

/* Giriş formu */
.login-form {
  display: flex;
  flex-direction: column;
}

.login-form h2 {
  margin-bottom: 20px;
  color: #007BFF;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}

/* Form grupları */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #212529;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #CED4DA;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  color: #495057;
}

.form-group input:focus {
  border-color: #007BFF;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
}

/* Hata mesajı */
.error-message {
  color: #DC3545;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

/* Giriş yap düğmesi */
button {
  background-color: #007BFF;
  color: #FFFFFF;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  transform: scale(0.98);
}


        `}</style>
    </div>
  );
  
};



 
export default LoginPage;
