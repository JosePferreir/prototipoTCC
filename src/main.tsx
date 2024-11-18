import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './views/home/Home.tsx'
import Layout from './views/Layout.tsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookDetails from './views/details/BookDetails.tsx'
import Library from './views/biblioteca/Library.tsx'
import BookProgress from './views/biblioteca/bookProgress/BookProgress.tsx'
import Profile from './views/profile/Profile.tsx'
import Emblems from './views/emblems/Emblems.tsx'
import Login from './views/login/Login.tsx'
import { useState } from 'react';
import { User } from './model/User.ts'
import Register from './views/register/Register';
const App = () => {
  // Estado para controlar a autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('user') !== null
  );

  // Função para autenticar o usuário
  const handleLogin = (userData: User) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  // Função para logout do usuário
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/library" element={<Library />} />
            <Route path="/emblems" element={<Emblems />} />
            <Route path="/library/bookProgress/:id" element={<BookProgress />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </Router>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
