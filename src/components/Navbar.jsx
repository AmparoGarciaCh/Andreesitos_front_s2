import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

function Navbar() {
  return (
    <header className="bienvenida-header">
      <img src={logo} alt="Logo Webtan" className="logo" />
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/registro">Registro</Link></li>
          <li><Link to="/login">Iniciar Sesión</Link></li>
          <li>Jugar</li>
          <li>Sobre el juego</li>
          <li>Reglas</li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;