import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Nosotros.css';
import fondoNosotros from '/fondo5.png'; // Puedes usar el mismo fondo del login
import catalinaImg from '/cata.jpg';
import juanImg from '/juanpa.jpg';
import amparoImg from '/ampa.jpg';

function Nosotros() {
  return (
    <div className="nosotros-container" style={{ backgroundImage: `url(${fondoNosotros})` }}>
      <Navbar />

      <main className="nosotros-main">
        <h1 className="nosotros-title">Sobre el equipo</h1>
        <p className="nosotros-intro">
          Somos estudiantes de Ingeniería UC desarrollando <strong>Webtan</strong>, una adaptación universitaria del clásico juego Catan. Nuestro equipo combina habilidades de diseño, lógica y desarrollo web para entregar una experiencia entretenida y académica.
        </p>

        <section className="nosotros-cards">
          <div className="nosotros-card">
            <img src={catalinaImg} alt="Catalina Aguirre" className="nosotros-img" />
            <h3>Catalina Aguirre</h3>
            <p><strong>Frontend & UI</strong></p>
            <p>Encargada del diseño visual, implementación de vistas en React y coherencia estética del juego.</p>
          </div>

          <div className="nosotros-card">
            <img src={juanImg} alt="Juan Pablo Montoya" className="nosotros-img" />
            <h3>Juan Pablo Montoya</h3>
            <p><strong>Backend & API</strong></p>
            <p>Responsable del desarrollo del servidor en Koa.js, diseño de la base de datos y conexión con el frontend.</p>
          </div>

          <div className="nosotros-card">
            <img src={amparoImg} alt="Amparo García" className="nosotros-img" />
            <h3>Amparo García</h3>
            <p><strong>Game Logic & Testing</strong></p>
            <p>Diseño de las reglas internas del juego, lógica de turnos, testing y balance de condiciones de victoria.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Nosotros;