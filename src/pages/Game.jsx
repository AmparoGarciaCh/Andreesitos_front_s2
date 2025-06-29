import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GameBoard from '../components/GameBoard';
import axios from 'axios';
import '../styles/Juego.css';

const Game = () => {
  const { id } = useParams(); 
  const { state } = useLocation();
  const navigate = useNavigate();
  const tableroIdFromState = state?.tableroId;
  const [jugadores, setJugadores] = useState([]);
  const { usuario } = useContext(AuthContext);
  const [partida, setPartida] = useState(null);
  const [jugadorIdPropio, setJugadorIdPropio] = useState(null);
  const [idJugadorTurnoActual, setIdJugadorTurnoActual] = useState(null);
  const [tableroIdFinal, setTableroIdFinal] = useState(tableroIdFromState || null);
  const [estadoPartida, setEstadoPartida] = useState(null); 
  const [puntosEmpresa, setPuntosEmpresa] = useState(0);

  useEffect(() => {
    const fetchTableroId = async () => {
      if (!tableroIdFromState && id) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_backendURL}/tableros/partida/${id}`);
          const data = response.data;

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

  useEffect(() => {
    const fetchJugadorPropio = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backendURL}/jugadores`);
        const jugadores = response.data;

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

  useEffect(() => {
    const fetchJugadoresDePartida = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backendURL}/jugadores/partida/${id}`);
        const data = response.data;
        setJugadores(data.jugadores || []);
      } catch (error) {
        console.error('Error al obtener jugadores de la partida:', error);
      }
    };

    fetchJugadoresDePartida();
    const interval = setInterval(fetchJugadoresDePartida, 3000);
    return () => clearInterval(interval);
  }, [id]);

const fetchPartidaTurno = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${id}`);
    const dataPartida = response.data;

    const partidaActual = dataPartida.partida;
    if (partidaActual) {
      setIdJugadorTurnoActual(partidaActual.idJugadorTurnoActual);
      setPartida(partidaActual);
      setEstadoPartida(partidaActual.estado);
    }
  } catch (err) {
    console.error('Error al obtener partida:', err);
  }
};

useEffect(() => {
  if (jugadorIdPropio) {
    fetchPartidaTurno();
  }
}, [jugadorIdPropio, id]);

useEffect(() => {
  if (!id) return;

  const interval = setInterval(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const partidaActualizada = response.data.partida;
      const ganadorNombre = response.data.ganadorNombre;

      if (partidaActualizada.estado === 'finalizada') {
        console.log("Redirigiendo a victoria con id:", id);
        navigate(`/victoria/${id}`);
      }
    } catch (err) {
      console.error('Error al chequear estado de la partida:', err);
    }
  }, 3000);

  return () => clearInterval(interval);
}, [id, navigate]);

useEffect(() => {
  if (estadoPartida !== 'fundando') return;

  const fetchFundador = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${id}/siguiente-fundador`);
    } catch (error) {
      console.error('Error actualizando el siguiente fundador:', error);
    }
  };

  fetchFundador();
  const interval = setInterval(fetchFundador, 3000);
  return () => clearInterval(interval);
}, [estadoPartida, id]);

useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${id}`);
      const nuevaPartida = response.data.partida;

      if (!nuevaPartida) return;

      const turnoCambio = nuevaPartida.idJugadorTurnoActual !== idJugadorTurnoActual;
      const estadoCambio = nuevaPartida.estado !== estadoPartida;

      if (turnoCambio || estadoCambio) {
        setPartida(nuevaPartida);
        setEstadoPartida(nuevaPartida.estado);
        setIdJugadorTurnoActual(nuevaPartida.idJugadorTurnoActual);
      }
    } catch (err) {
      console.error('Error actualizando partida:', err);
    }
  }, 3000);

  return () => clearInterval(interval);
}, [idJugadorTurnoActual, estadoPartida, id]);

const fetchPuntosEmpresa = async () => {
  if (!jugadorIdPropio) return;
  try {
    const response = await axios.get(`${import.meta.env.VITE_backendURL}/jugadores/${jugadorIdPropio}`);
    if (response.data && response.data.puntosEmpresa !== undefined) {
      setPuntosEmpresa(response.data.puntosEmpresa);
    }
  } catch (err) {
    console.error('Error al obtener puntos de empresa:', err);
  }
};

useEffect(() => {
  if (estadoPartida !== 'jugando' || !jugadorIdPropio) return;

  fetchPuntosEmpresa();
  const interval = setInterval(fetchPuntosEmpresa, 3000);

  return () => clearInterval(interval);
}, [estadoPartida, jugadorIdPropio]);

const handlePasarTurno = async () => {
  try {
    const token = localStorage.getItem('token');

    await axios.post(
      `${import.meta.env.VITE_backendURL}/partidas/${id}/pasar-turno`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    await fetchPartidaTurno();

  } catch (err) {
    console.error('❌ Error al pasar turno:', err);
  }
};



  return (
    <div className="juego-container">
      <div className="jugadores-lista">
        {jugadores.map((j) => (
          <div key={j.id} className={`jugador-item ${j.id === idJugadorTurnoActual ? 'jugador-turno' : ''}`}>
            <div className={`color-circulo color-${j.color || 'gris'}`} />
            <div className="jugador-nombre">{j.nombre}</div>
          </div>
        ))}
      </div>

      {estadoPartida === 'jugando' && (
        <div className="contador-puntos-empresa">
          {puntosEmpresa} PE
        </div>
      )}

      {tableroIdFinal ? (
        <GameBoard
        key={idJugadorTurnoActual}
        partida={partida}
        jugadorIdPropio={jugadorIdPropio}
        partidaId={id}
        tableroId={parseInt(tableroIdFinal)}
        onPasarTurno={handlePasarTurno}
        estadoPartida={estadoPartida}
        idJugadorTurnoActual={idJugadorTurnoActual}
      />
      ) : (
        <p>No se recibió tableroId.</p>
      )}
      <div className="tabla-costes"></div>
    </div>
  );
};

export default Game;
