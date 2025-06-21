import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GameBoard from '../components/GameBoard';
import backendURL from '../config';

const Game = () => {
  const { id } = useParams(); // id de la partida
  const { state } = useLocation();
  const tableroIdFromState = state?.tableroId;

  const { usuario } = useContext(AuthContext);
  const [partida, setPartida] = useState(null);
  const [jugadorIdPropio, setJugadorIdPropio] = useState(null);
  const [idJugadorTurnoActual, setIdJugadorTurnoActual] = useState(null);
  const [tableroIdFinal, setTableroIdFinal] = useState(tableroIdFromState || null);

  // 🔍 Si no se recibió tableroId en el state, lo obtenemos desde el backend
  useEffect(() => {
    const fetchTableroId = async () => {
      if (!tableroIdFromState && id) {
        try {
          const res = await fetch(`${backendURL}/tableros/partida/${id}`);
          const data = await res.json();
          if (data.id) {
            setTableroIdFinal(data.id);
          } else {
            console.error('No se encontró tablero para esta partida.');
          }
        } catch (err) {
          console.error('Error al obtener tableroId desde backend:', err);
        }
      }
    };

    fetchTableroId();
  }, [tableroIdFromState, id]);

  // 🎮 Obtener jugador propio
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
  }, [usuario.id, id]);

  // ⏳ Obtener turno actual
  useEffect(() => {
    const fetchPartidaTurno = async () => {
      try {
        const resPartida = await fetch(`${backendURL}/partidas/${id}`);
        const dataPartida = await resPartida.json();

        const partidaActual = dataPartida.partida;
        if (partidaActual) {
          setIdJugadorTurnoActual(partidaActual.idJugadorTurnoActual);
          setPartida(partidaActual);
        }
      } catch (err) {
        console.error('Error al obtener partida:', err);
      }
    };

    if (jugadorIdPropio) {
      fetchPartidaTurno();
    }
  }, [jugadorIdPropio, id]);

  // 🧱 Renderizado final
  if (!tableroIdFinal) {
    return <p>Cargando tablero...</p>;
  }

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

      <GameBoard
        partida={partida}
        jugadorIdPropio={jugadorIdPropio}
        partidaId={id}
        tableroId={parseInt(tableroIdFinal)}
      />
    </div>
  );
};

export default Game;
