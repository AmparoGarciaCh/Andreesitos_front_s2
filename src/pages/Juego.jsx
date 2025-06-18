// src/pages/Juego.jsx
import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GameBoard from '../components/GameBoard';
import backendURL from '../config';

const Juego = () => {
  const { id } = useParams(); // id de la partida



  const { usuario } = useContext(AuthContext);

  const [jugadorIdPropio, setJugadorIdPropio] = useState(null);
  const [tableroId, setTableroId] = useState(null);
  const [jugadorEsperadoFundarId, setJugadorEsperadoFundarId] = useState(null);

  useEffect(() => {
    const fetchJugadorPropio = async () => {
      try {
        const resJugadores = await fetch(`${backendURL}/jugadores`);
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
    const fetchPartida = async () => {
      try {
        const res = await fetch(`${backendURL}/partidas/${id}`);
        const data = await res.json();

        if (data.partida?.idTablero && !tableroId) {
          setTableroId(data.partida.idTablero);
        }
      } catch (err) {
        console.error('Error al obtener partida:', err);
      }
    };

    fetchPartida();
  }, [id, tableroId]);

  useEffect(() => {
    const fetchSiguienteFundador = async () => {
      try {
        const res = await fetch(`${backendURL}/partidas/${id}/siguiente-fundador`);
        const data = await res.json();
        setJugadorEsperadoFundarId(data.jugadorEsperadoId);
      } catch (err) {
        console.error('Error al obtener el siguiente jugador que debe fundar:', err);
      }
    };

    fetchSiguienteFundador();
    const interval = setInterval(fetchSiguienteFundador, 3000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div>
      <h1>Vista del Juego - Andreesitos 🚀</h1>

      {jugadorIdPropio && jugadorEsperadoFundarId && (
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
          {jugadorIdPropio === jugadorEsperadoFundarId
            ? '✅ Te toca fundar'
            : '⌛ Esperando a que funden los demás'}
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
