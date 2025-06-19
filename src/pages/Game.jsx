// src/pages/Game.jsx
import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GameBoard from '../components/GameBoard';
import backendURL from '../config';

const Game = () => {
  const { id } = useParams(); // id de la partida
  const { state } = useLocation();
  const tableroId = state?.tableroId;

  if (!tableroId) {
    console.error('No se recibió tableroId en el estado de la ubicación');
    return <p>Error: No se recibió tableroId.</p>;
  }


  const { usuario } = useContext(AuthContext);

  const [jugadorIdPropio, setJugadorIdPropio] = useState(null);
  const [idJugadorTurnoActual, setIdJugadorTurnoActual] = useState(null);

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
  }, []);

  useEffect(() => {
    const fetchPartidaTurno = async () => {
      try {
        const resPartida = await fetch(`${backendURL}/partidas/${id}`);
        const dataPartida = await resPartida.json();

        const partidaActual = dataPartida.partida;
        console.log('Partida actual:', partidaActual);

        if (partidaActual) {
          setIdJugadorTurnoActual(partidaActual.idJugadorTurnoActual);
          console.log('idJugadorTurnoActual:', partidaActual.idJugadorTurnoActual);
        }
      } catch (err) {
        console.error('Error al obtener partida:', err);
      }
    };
    if (jugadorIdPropio) {
      fetchPartidaTurno();
    }
  }, [jugadorIdPropio]);

  return (
    <div>
      <h1>Vista del Juegoooo - Andreesitos 🚀</h1>

      {jugadorIdPropio !== null && idJugadorTurnoActual !== null && (
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
          {jugadorIdPropio === idJugadorTurnoActual
            ? '✅ Es tu turno'
            : '⌛ No es tu turno'}
        </p>
      )}

      {tableroId ? (
        <GameBoard partidaId={id} tableroId={parseInt(tableroId)} />
      ) : (
        <p>No se recibió tableroId.</p>
      )}
    </div>
  );
};

export default Game;