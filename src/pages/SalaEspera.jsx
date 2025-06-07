// src/pages/SalaEspera.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Login.css'; // o tu estilo personalizado
import fondoLogin from '../assets/fondo5.png';

function SalaEspera() {
  const { usuario } = useContext(AuthContext);
  const { id } = useParams(); // ID de la partida
  const { state } = useLocation(); // contiene { codigo, soyAdmin }
  const navigate = useNavigate();

  const [jugadores, setJugadores] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

  // 🔁 Cargar jugadores cada cierto tiempo (polling)
  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const res = await fetch(`http://localhost:3000/partidas/${id}`);
        const partida = await res.json();

        if (!res.ok) throw new Error(partida.error);
        
        // Obtener jugadores asociados a la partida
        const resJugadores = await fetch('http://localhost:3000/jugadores');
        const todos = await resJugadores.json();
        const enPartida = todos.filter(j => j.idPartida === parseInt(id));

        setJugadores(enPartida);
      } catch (err) {
        setMensaje('❌ Error al cargar jugadores');
      }
    };

    fetchJugadores();
    const interval = setInterval(fetchJugadores, 3000); // cada 3 segundos
    return () => clearInterval(interval);
  }, [id]);

  const handleIniciarPartida = async () => {
    try {
        const jugadorData = jugadores.find(j => j.usuarioId === usuario.id);
        if (!jugadorData) return;

        // 1. Iniciar partida
        const resInicio = await fetch(`http://localhost:3000/partidas/${id}/iniciar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idJugador: jugadorData.id })
        });

        const inicio = await resInicio.json();
        if (!resInicio.ok) throw new Error(inicio.error);

        // 2. Crear tablero
        const resTablero = await fetch('http://localhost:3000/tableros', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idPartida: id })
        });

        const dataTablero = await resTablero.json();
        if (!resTablero.ok) throw new Error(dataTablero.error);

        // 3. Redirigir al juego
        navigate(`/juego/${id}`, { state: { tableroId: dataTablero.tableroId } });

    } catch (err) {
        setMensaje(`❌ ${err.message}`);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${fondoLogin})` }}>
      <Navbar />
      <main className="login-main">
        <section className="login-card">
          <h2 className="login-title">
            Código de la partida: <strong>{state?.codigo || '(desconocido)'}</strong>
          </h2>
          <p style={{ textAlign: 'center' }}>Esperando a otros jugadores...</p>

          <ul style={{ listStyle: 'none', paddingLeft: 0, textAlign: 'center' }}>
            {jugadores.map(j => (
              <li key={j.id} style={{ margin: '8px 0' }}>
                {j.color ? `${j.color.toUpperCase()} — ` : ''}{usuario?.id === j.usuarioId ? 'Tú' : `Jugador ${j.id}`}
              </li>
            ))}
          </ul>

          {jugadores.length < 4 && (
            <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
              Se necesitan 4 jugadores para comenzar.
            </p>
          )}

          {state?.soyAdmin && jugadores.length === 4 && (
            <button className="login-form-button" onClick={handleIniciarPartida}>
              Comenzar partida
            </button>
          )}

          {mensaje && <p className="login-message">{mensaje}</p>}
        </section>
      </main>
    </div>
  );
}

export default SalaEspera;