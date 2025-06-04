import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleJugarClick = () => {
    if (usuario) {
      navigate('/partidas');
    } else {
      alert('⚠️ Debes iniciar sesión para jugar');
    }
  };

  return (
    <header className="bienvenida-header">
      <img src={logo} alt="Logo Webtan" className="logo" />
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          {!usuario && (
            <>
              <li><Link to="/registro">Registro</Link></li>
              <li><Link to="/login">Iniciar Sesión</Link></li>
            </>
          )}
          <li onClick={handleJugarClick} style={{ cursor: 'pointer' }}>Jugar</li>
          <li>Sobre el juego</li>
          <li>Reglas</li>
          {usuario && (
            <>
              <li><strong>👤 {usuario.nombre}</strong></li>
              <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar sesión</li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;