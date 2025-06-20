import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import './Navbar.css';
import { AuthContext } from '../context/AuthContext';
import franja from '/franja_decorativa.png';

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
      <div className="navbar-superior">
        <div className="logo-container">
          <img src={logo} alt="Logo Webtan" className="logo" />
          <span className="logo-text">WEBTAN</span>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Inicio</Link></li>
            {!usuario && (
              <>
                <li><Link to="/registro">Registro</Link></li>
                <li><Link to="/login">Iniciar Sesión</Link></li>
              </>
            )}

            <li><Link to="/instrucciones">Instrucciones</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            {usuario && (
              <>
                <li><strong>👤 {usuario.nombre}</strong></li>
                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar sesión</li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* ✅ Franja decorativa ahora dentro del header */}
      <img src={franja} alt="Franja decorativa" className="franja-decorativa" />
    </header>
  );
}

export default Navbar;