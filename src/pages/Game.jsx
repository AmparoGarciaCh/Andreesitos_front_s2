import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GameBoard from '../components/GameBoard';
import backendURL from '../config';
import '../styles/Juego.css';

const Game = () => {
  const { id } = useParams(); // id de la partida
  const { state } = useLocation();
<<<<<<< HEAD
  const tableroIdFromState = state?.tableroId;
=======
  const tableroId = state?.tableroId ?? id;
  const [jugadores, setJugadores] = useState([]);
>>>>>>> ramacata

  const { usuario } = useContext(AuthContext);
  const [partida, setPartida] = useState(null);
  const [jugadorIdPropio, setJugadorIdPropio] = useState(null);
  const [idJugadorTurnoActual, setIdJugadorTurnoActual] = useState(null);
<<<<<<< HEAD
  const [tableroIdFinal, setTableroIdFinal] = useState(tableroIdFromState || null);
=======
  const [estadoPartida, setEstadoPartida] = useState(null); // ✅ NUEVO
>>>>>>> ramacata

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
        if (partidaActual) {
          setIdJugadorTurnoActual(partidaActual.idJugadorTurnoActual);
<<<<<<< HEAD
          setPartida(partidaActual);
=======
          setEstadoPartida(partidaActual.estado); // <- nuevo
>>>>>>> ramacata
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

<<<<<<< HEAD
      <GameBoard
        partida={partida}
        jugadorIdPropio={jugadorIdPropio}
        partidaId={id}
        tableroId={parseInt(tableroIdFinal)}
      />
=======
      {tableroId ? (
        <GameBoard tableroId={parseInt(tableroId)} />
      ) : (
        <p>No se recibió tableroId.</p>
      )}

      <div className="tabla-costes"></div>
      
>>>>>>> ramacata
    </div>
  );
};

export default Game;
