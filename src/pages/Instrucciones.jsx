import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Instrucciones.css';
import fondoLogin from '/fondo6.png';

function Instrucciones() {
  return (
    <div className="instrucciones-container" style={{ backgroundImage: `url(${fondoLogin})` }}>
      <Navbar />

      <header className="instrucciones-header">
        <h1 className="instrucciones-title">Instrucciones del Juego</h1>
      </header>

      <main className="instrucciones-main">
        <section className="instrucciones-card">
          <div className="instrucciones-intro">
            <p>
              <strong>Webtan</strong> es una experiencia estratégica ambientada en la vida universitaria UC, donde competirás por convertirte en la figura más influyente del campus. En esta sección encontrarás todo lo que necesitas saber para dominar el juego: desde cómo construir <strong>Departamentos</strong> y <strong>Facultades</strong>, hasta cómo comerciar especialistas, activar cartas de <strong>feeling con investigadores UC</strong> y mover al temido <strong>Ladrón de Cupos</strong>. Conoce aquí las reglas, acciones posibles y condiciones de victoria para convertirte en leyenda de la Universidad.
            </p>
          </div>

          <div className="instrucciones-section">
            <h3>🎯 Objetivo del juego</h3>
            <p>
            El objetivo de <strong>Webtán</strong> es ser el primer estudiante en alcanzar <strong>10 puntos de empresa</strong>, demostrando tu influencia y éxito dentro del ecosistema universitario UC. Puedes lograrlo construyendo <strong>Departamentos</strong> y <strong>Facultades</strong>, desarrollando <strong>muros de ingeniería</strong> que conecten tu presencia territorial, acumulando <strong>cartas de feeling</strong> con investigadores UC y cumpliendo condiciones especiales como tener el <strong>Muro más largo</strong> o ser parte del <strong>Grupo de Amigos más Carretero</strong>.
            </p>
          </div>

          <div className="instrucciones-section">
            <h3>🧱 Tipos de Terreno (Facultades) y especialistas asociados</h3>
            <ul>
              <li>🏛️ Derecho → Abogados</li>
              <li>🧠 Ingeniería → Ñoños</li>
              <li>🌾 Agronomía → Agricultores</li>
              <li>😎 Comercial → Zorrones</li>
              <li>💉 Medicina → Especialistas en Suero</li>
              <li>😈 College → Ladrón de Cupos</li>
            </ul>
          </div>

          <div className="instrucciones-section">
            <h3>🎲 Dinámica del Turno</h3>
            <ol>
              <li>El jugador lanza los dados.</li>
              <li>Las casillas con ese número producen especialistas para jugadores con construcciones adyacentes.</li>
              <li>El jugador puede comerciar con otros jugadores, con el banco (4:1) o mediante pitutos (3:1 o 2:1).</li>
              <li>Puede construir, comprar cartas de feeling o mover el Ladrón de Cupos si corresponde.</li>
              <li>Finaliza su turno para dar paso al siguiente jugador.</li>
            </ol>
          </div>

          <div className="instrucciones-section">
            <h3>🏗️ Construcciones y Costos</h3>
            <ul>
              <li>🧱 Muros de Ingeniería: 1 ñoño + 1 abogado</li>
              <li>🏠 Departamento: 1 ñoño + 1 agricultor + 1 abogado + 1 especialista en suero</li>
              <li>🏛️ Facultad: Mejora del departamento (2 agricultores + 3 zorrones)</li>
              <li>🃏 Feeling: 1 zorrón + 1 abogado + 1 especialista en suero</li>
            </ul>
          </div>

          <div className="instrucciones-section">
            <h3>🃏 Cartas de Feeling</h3>
            <p>
            Las cartas de feeling representan alianzas y situaciones influyentes dentro del campus. Algunas otorgan puntos ocultos, otras permiten mover el Ladrón de Cupos, obtener recursos gratis o construir sin costo.
            </p>
          </div>

          <div className="instrucciones-section">
            <h3>👤 Ladrón de Cupos</h3>
            <p>
            Si alguien lanza un 7, todos los jugadores con más de 7 especialistas deben descartar la mitad. Luego, el jugador mueve al <strong>Ladrón de Cupos</strong> a una casilla, bloqueando su producción, y roba un recurso de otro jugador con presencia en esa casilla.
            </p>
          </div>

          <div className="instrucciones-section">
            <h3>🏆 Fin del Juego</h3>
            <p>
            Cuando un jugador alcanza 10 puntos de empresa, el juego termina automáticamente. El servidor mostrará un resumen con estadísticas: cartas jugadas, recursos recolectados, turnos jugados y construcciones.
            </p>
          </div>

          <div className="instrucciones-section" style={{ gridColumn: 'span 2' }}>
            <hr />
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>
              Inspirado en "Catan" de Klaus Teuber. Adaptación estudiantil para fines académicos.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Instrucciones;