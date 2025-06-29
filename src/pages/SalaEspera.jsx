import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Login.css';
import fondoLogin from '/fondo5.png';

function SalaEspera() {
  const { usuario } = useContext(AuthContext);
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [jugadores, setJugadores] = useState([]);
  const [partida, setPartida] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const resJugadores = await axios.get(`${import.meta.env.VITE_backendURL}/jugadores`);
        const todos = resJugadores.data;
        const enPartida = todos.filter((j) => j.idPartida === parseInt(id,10));

        setJugadores(enPartida);
      } catch (err) {
        console.error('Error al cargar jugadores:', err);
        setMensaje('❌ Error al cargar jugadores');
      }
    };

    fetchJugadores();
    const interval = setInterval(fetchJugadores, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const fetchPartida = async () => {
      try {
        const resPartida = await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${id}`);

        const dataPartida = resPartida.data;

        const partidaActual = dataPartida.partida;

        if (!partidaActual) return;

        setPartida(partidaActual);


        if (partidaActual.estado === 'fundando') {
          navigate(`/juego/${id}`, { state: { tableroId: partidaActual.idTablero } });
        }
      } catch (err) {
        console.error('Error completo al obtener partida:', err);
      }
    };

    fetchPartida();
    const interval = setInterval(fetchPartida, 3000);
    return () => clearInterval(interval);
  }, [id, navigate]);


  const handleIniciarPartida = async () => {
    try {
      const jugadorData = jugadores.find((j) => j.usuarioId === usuario.id);
      if (!jugadorData) {
        throw new Error('No se encontró tu jugador en esta partida');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_backendURL}/partidas/${id}/iniciar`,
        { idJugador: jugadorData.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const inicio = response.data;

      navigate(`/juego/${id}`, { state: { tableroId: inicio.tableroId } });
    } catch (err) {
      const mensajeError = err.response?.data?.error || err.message;
      setMensaje(`❌ ${mensajeError}`);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${fondoLogin})` }}>
      <Navbar />
      <main className="login-main">
        <section className="login-card">
          <h2 className="login-title">
            Código de la partida:
            {' '}
            <strong>{state?.codigo || '(desconocido)'}</strong>
          </h2>
          <p style={{ textAlign: 'center' }}>Esperando a otros jugadores...</p>

          <ul style={{ listStyle: 'none', paddingLeft: 0, textAlign: 'center' }}>
            {jugadores.map((j) => (
              <li key={j.id} style={{ margin: '8px 0' }}>
                {j.color ? `${j.color.toUpperCase()} — ` : ''}
                {usuario?.id === j.usuarioId ? 'Tú' : `Jugador ${j.id}`}
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
