import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Login.css'; // usa los estilos base para coherencia
import fondoLogin from '../assets/fondo5.png'; // fondo similar al de login

function Instrucciones() {
  return (
    <div className="login-container" style={{ backgroundImage: `url(${fondoLogin})` }}>
      <Navbar />
      <main className="login-main">
        <section className="login-card">
          <h2 className="login-title">📘 Instrucciones del Juego</h2>

          <p>
            <strong>Webtan</strong> es una experiencia estratégica ambientada en la vida universitaria UC, donde competirás por convertirte en la figura más influyente del campus. En esta sección encontrarás todo lo que necesitas saber para dominar el juego: desde cómo construir <strong>Departamentos</strong> y <strong>Facultades</strong>, hasta cómo comerciar especialistas, activar cartas de <strong>feeling con investigadores UC</strong> y mover al temido <strong>Ladrón de Cupos</strong>. Conoce aquí las reglas, acciones posibles y condiciones de victoria para convertirte en leyenda de la Universidad.
          </p>

          <h3>🎯 Objetivo del juego</h3>
          <p>
            El objetivo de <strong>Webtán</strong> es ser el primer estudiante en alcanzar <strong>10 puntos de empresa</strong>, demostrando tu influencia y éxito dentro del ecosistema universitario UC. Puedes lograrlo construyendo <strong>Departamentos</strong> y <strong>Facultades</strong>, desarrollando <strong>muros de ingeniería</strong> que conecten tu presencia territorial, acumulando <strong>cartas de feeling</strong> con investigadores UC y cumpliendo condiciones especiales como tener el <strong>Muro más largo</strong> o ser parte del <strong>Grupo de Amigos más Carretero</strong>.
          </p>

          <h3>🧱 Tipos de Terreno (Facultades)</h3>
          <ul>
            <li>🏛️ Facultad de Derecho (produce Tesis)</li>
            <li>💡 Facultad de Ingeniería (produce Tecnología)</li>
            <li>🧬 Facultad de Ciencias Biológicas (produce Biología)</li>
            <li>📈 Facultad de Economía y Negocios (produce Recursos Financieros)</li>
            <li>🎨 Facultad de Artes (produce Creatividad)</li>
          </ul>

          <h3>🎲 Dinámica del Turno</h3>
          <ol>
            <li>Tirar dados para determinar producción de recursos según la suma.</li>
            <li>Recolectar recursos si tienes un laboratorio conectado a una facultad con el número del dado.</li>
            <li>Comerciar recursos con otros jugadores o con el decanato (comercio fijo 4:1 o variable si se está junto a una Facultad Especial).</li>
            <li>Construir o jugar cartas: puedes construir redes, laboratorios, laboratorios avanzados, o jugar una carta de feeling.</li>
          </ol>

          <h3>🏗️ Construcciones y Costos</h3>
          <ul>
            <li>🔹 Red de Colaboración: 1 Tecnología + 1 Creatividad</li>
            <li>🔹 Laboratorio: 1 Tesis + 1 Tecnología + 1 Biología + 1 Recursos Financieros</li>
            <li>🔹 Laboratorio Avanzado: +2 Recursos del tipo que elijas</li>
            <li>🔹 Carta de Feeling Investigativo: 1 de cada recurso</li>
          </ul>

          <h3>🃏 Cartas de Feeling Investigativo</h3>
          <p>
            Estas cartas representan momentos de inspiración, cooperación o descubrimientos clave. Algunas otorgan puntos directos de prestigio, otras permiten robar recursos o bloquear a otro jugador.
          </p>

          <h3>😈 El Procrastinador (equivalente al ladrón)</h3>
          <p>
            Al obtener un 7 en el dado, todos los jugadores con más de 7 cartas deben descartar la mitad. Luego, el jugador activa al <strong>Procrastinador</strong>, moviéndolo a una facultad para bloquear su producción y robar un recurso de otro investigador allí.
          </p>

          <h3>🏆 Fin del Juego</h3>
          <p>
            El primer jugador en alcanzar <strong>10 puntos de prestigio académico</strong> gana. Los puntos se obtienen por laboratorios, cartas, y construcciones avanzadas.
          </p>

          <hr />

          <p style={{ fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>
            Inspirado en "Catan" de Klaus Teuber. Adaptación estudiantil para fines académicos.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Instrucciones;