// src/pages/Game.jsx
import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GameBoard from '../components/GameBoard';
import backendURL from '../config';
import '../styles/Juego.css';

const Game = () => {
  const { id } = useParams(); // id de la partida
  const { state } = useLocation();
  const tableroId = state?.tableroId ?? id;
  const [jugadores, setJugadores] = useState([]);

  const { usuario } = useContext(AuthContext);

  const [jugadorIdPropio, setJugadorIdPropio] = useState(null);
  const [idJugadorTurnoActual, setIdJugadorTurnoActual] = useState(null);
  const [estadoPartida, setEstadoPartida] = useState(null); // ✅ NUEVO

  useEffect(() => {
    const fetchJugadorPropio = async () => {
      try {
        const resJugadores = await fetch(`${backendURL}/jugadores`);
        const jugadores = await resJugadores.json();

        // Buscamos el jugador que corresponde al usuario actual en esta partida
        const miJugador = jugadores.find(j =>
          j.usuarioId === usuario.id && j.idPartida === parseInt(id)
        );

        if (miJugador) {
          setJugadorIdPropio(miJugador.id);
          console.log('Mi jugadorId propio:', miJugador.id);
        } else {
          console.warn('No se encontró tu jugador en esta partida');
        }
      } catch (err) {
        console.error('Error al obtener jugadores:', err);
      }
    };

    fetchJugadorPropio();
  }, [id, usuario.id]);

  useEffect(() => {
    const fetchJugadoresDePartida = async () => {
      try {
        const res = await fetch(`${backendURL}/jugadores/partida/${id}`);
        const data = await res.json();
        setJugadores(data.jugadores || []);
      } catch (error) {
        console.error('Error al obtener jugadores de la partida:', error);
      }
    };

    fetchJugadoresDePartida();
    const interval = setInterval(fetchJugadoresDePartida, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const fetchPartidaTurno = async () => {
      try {
        const resPartida = await fetch(`${backendURL}/partidas/${id}`);
        const dataPartida = await resPartida.json();

        const partidaActual = dataPartida.partida;
        console.log('Partida actual:', partidaActual);

        if (partidaActual) {
          setIdJugadorTurnoActual(partidaActual.idJugadorTurnoActual);
          setEstadoPartida(partidaActual.estado); // <- nuevo
        }
      } catch (err) {
        console.error('Error al obtener partida:', err);
      }
    };

    fetchPartidaTurno();
    const interval = setInterval(fetchPartidaTurno, 3000); // actualizamos cada 3 seg
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (estadoPartida !== 'fundando') return;

    const fetchFundador = async () => {
      try {
        await fetch(`${backendURL}/partidas/${id}/siguiente-fundador`);
      } catch (error) {
        console.error('Error actualizando el siguiente fundador:', error);
      }
    };

    fetchFundador();
    const interval = setInterval(fetchFundador, 3000);
    return () => clearInterval(interval);
  }, [estadoPartida, id]);

  return (
    <div className="juego-container">
      <div className="jugadores-lista">
        {jugadores.map((j) => (
          <div key={j.id} className="jugador-item">
            <div className={`color-circulo color-${j.color || 'gris'}`} />
            <span>{j.nombre}</span>
            {j.id === idJugadorTurnoActual && <span className="turno-indicador">⏳</span>}
          </div>
        ))}
      </div>

      {jugadorIdPropio !== null && idJugadorTurnoActual !== null && (
        <p className="estado-turno">
          {jugadorIdPropio === idJugadorTurnoActual
            ? estadoPartida === 'fundando'
              ? '🏗️ Te toca fundar'
              : '✅ Es tu turno'
            : estadoPartida === 'fundando'
              ? '⌛ Esperando fundación'
              : '⌛ No es tu turno'}
        </p>
      )}

      {tableroId ? (
        <GameBoard tableroId={parseInt(tableroId)} />
      ) : (
        <p>No se recibió tableroId.</p>
      )}

      <div className="tabla-costes"></div>
      
    </div>
  );
};

export default Game;
