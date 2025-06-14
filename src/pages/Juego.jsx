// src/pages/Game.jsx
import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GameBoard from '../components/GameBoard';

const Juego = () => {
  const { id } = useParams(); // id de la partida
  const { state } = useLocation();
  const tableroIdFromState = state?.tableroId ?? null; // ojo: solo lo sacamos si viene explícito

  const { usuario } = useContext(AuthContext);

  const [jugadorIdPropio, setJugadorIdPropio] = useState(null);
  const [idJugadorTurnoActual, setIdJugadorTurnoActual] = useState(null);
  const [tableroId, setTableroId] = useState(tableroIdFromState); // manejamos el tableroId correctamente

  useEffect(() => {
    const fetchJugadorPropio = async () => {
      try {
        const resJugadores = await fetch('http://localhost:3000/jugadores');
        const jugadores = await resJugadores.json();

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
    const fetchPartidaTurno = async () => {
      try {
        console.log('--- FETCH PARTIDA EN GAME ---');
        const resPartida = await fetch(`http://localhost:3000/partidas/${id}`);
        const dataPartida = await resPartida.json();

        const partidaActual = dataPartida.partida;
        console.log('Partida actual:', partidaActual);

        if (partidaActual) {
          setIdJugadorTurnoActual(partidaActual.idJugadorTurnoActual);
          console.log('idJugadorTurnoActual:', partidaActual.idJugadorTurnoActual);

          // Si no teníamos tableroId (por ejemplo en reload), lo obtenemos desde la partida
          if (!tableroId && partidaActual.idTablero) {
            setTableroId(partidaActual.idTablero);
            console.log('TableroId actualizado desde partida:', partidaActual.idTablero);
          }
        }
      } catch (err) {
        console.error('Error al obtener partida:', err);
      }
    };

    fetchPartidaTurno();
    const interval = setInterval(fetchPartidaTurno, 3000);
    return () => clearInterval(interval);
  }, [id, tableroId]);

  return (
    <div>
      <h1>Vista del Juego - Andreesitos 🚀</h1>

      {jugadorIdPropio !== null && idJugadorTurnoActual !== null && (
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
          {jugadorIdPropio === idJugadorTurnoActual
            ? '✅ Es tu turno'
            : '⌛ No es tu turno'}
        </p>
      )}

      {tableroId ? (
        <GameBoard tableroId={parseInt(tableroId)} />
      ) : (
        <p>No se recibió tableroId todavía...</p>
      )}
    </div>
  );
};

export default Juego;
