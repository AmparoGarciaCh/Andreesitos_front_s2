import React from 'react';
import '../styles/Bienvenida.css';
import tablero from '../assets/tablero.png';
import Navbar from '../components/Navbar';

function Bienvenida() {
  return (
    <div className="bienvenida-container">
      <Navbar />

      <main className="bienvenida-main">
        <section className="descripcion">
          <h1>WEBTAN</h1>
          <p><strong>Colonizar, pitutear y construir</strong> son las claves del éxito en la UC. Ubica estratégicamente tus departamentos, facultades y muros de ingeniería para dominar las mejores casillas, negocia con tus compañeros para conseguir a los especialistas que necesitas y utiliza con astucia al ladrón de cupos para bloquear terrenos rivales. Tal como en la vida universitaria, el pensamiento estratégico y la gestión de recursos son esenciales para destacar frente a los demás jugadores.</p>
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