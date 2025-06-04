// src/pages/Bienvenida.jsx
import React from 'react';
import './Bienvenida.css';
import logo from '../assets/logo.png';
import tablero from '../assets/tablero.png';

function Bienvenida() {
  return (
    <div className="bienvenida-container">
      <header className="bienvenida-header">
        <img src={logo} alt="Logo Webtan" className="logo" />
        <nav>
          <ul className="nav-links">
            <li className="active">Inicio</li>
            <li>Jugar</li>
            <li>Sobre el juego</li>
            <li>Reglas</li>
          </ul>
        </nav>
      </header>

      <main className="bienvenida-main">
        <section className="descripcion">
          <h1>WEBTAN</h1>
          <p><strong>Colonizar, pitutear y construir</strong> son las claves del éxito en la UC.Ubica estratégicamente tus Departamentos, facultades y muros de ingeniería para dominar las mejores casillas, negocia con tus compañeros para conseguir a los especialistas que necesitas y utiliza con astucia al ladrón de cupos para bloquear terrenos rivales. Tal como en la vida universitaria, el pensamiento estratégico y la gestión de recursos son esenciales para destacar frente a los demás jugadores.</p>
          <button className="jugar-btn">Ir a jugar</button>
        </section>

        <section className="imagen-tablero">
          <img src={tablero} alt="Tablero Webtan" />
        </section>
      </main>
    </div>
  );
}

export default Bienvenida;