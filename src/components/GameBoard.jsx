import './GameBoard.css';
import Edge from './Edge';
import Vertex from './Vertex';
import Tile from './Tile';
import { useEffect, useState } from 'react';
import backendURL from '../config'; // ✅ Importar backendURL

const HEX_SIZE = 60;

function axialToPixel(q, r, size) {
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * 3/2 * r;
  return { x, y };
}

const CENTER_X = window.innerWidth / 2;
const CENTER_Y = window.innerHeight / 2;

const GameBoard = ({ tableroId }) => {
  const partidaId = parseInt(tableroId);
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const [tablero, setTablero] = useState({ Terrenos: [], Vertices: [], Aristas: [] });
  const [partida, setPartida] = useState(null);
  const [jugadorIdPropio, setJugadorIdPropio] = useState(null);

  const [selectedVertexId, setSelectedVertexId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);

  const [construcciones, setConstrucciones] = useState({ vertices: {}, aristas: {} });

  useEffect(() => {
    const fetchTablero = async () => {
      const res = await fetch(`${backendURL}/tableros/${tableroId}`);
      const data = await res.json();
      setTablero({
        Terrenos: data.Terrenos || [],
        Vertices: data.Vertices || [],
        Aristas: data.Aristas || []
      });
    };

    fetchTablero();
  }, [tableroId]);

  useEffect(() => {
    const fetchPartida = async () => {
      const resPartida = await fetch(`${backendURL}/partidas/${partidaId}`);
      const dataPartida = await resPartida.json();
      setPartida(dataPartida.partida);
    };

    fetchPartida();
    const interval = setInterval(fetchPartida, 3000);
    return () => clearInterval(interval);
  }, [partidaId]);

  useEffect(() => {
    const fetchJugadorPropio = async () => {
      const resJugadores = await fetch(`${backendURL}/jugadores`);
      const jugadores = await resJugadores.json();

      const miJugador = jugadores.find(j =>
        j.usuarioId === usuario.id && j.idPartida === partidaId
      );

      if (miJugador) {
        setJugadorIdPropio(miJugador.id);
      }
    };

    fetchJugadorPropio();
  }, [partidaId, usuario.id]);

  useEffect(() => {
    const fetchConstrucciones = async () => {
      try {
        const res = await fetch(`${backendURL}/construcciones`);
        const data = await res.json();

        const vertices = {};
        const aristas = {};

        (data.construcciones || []).forEach(c => {
          if (c.idPartida === partidaId) {
            if (c.tipo === 'departamento') {
              vertices[c.idVertice] = 'facultad';
            }
            if (c.tipo === 'muro') {
              aristas[c.idArista] = 'muro';
            }
          }
        });

        setConstrucciones({ vertices, aristas });
      } catch (error) {
        console.error("Error al cargar construcciones:", error);
      }
    };

    fetchConstrucciones();
    const interval = setInterval(fetchConstrucciones, 3000);
    return () => clearInterval(interval);
  }, [partidaId]);

  function handleVertexClick(vertexId) {
    if (!esMiTurno() || !enFaseFundando()) return;
    setSelectedVertexId(prev => (prev === vertexId ? null : vertexId));
  }

  const handleEdgeClick = (edgeId) => {
    if (!esMiTurno() || !enFaseFundando()) return;
    setSelectedEdgeId(prev => (prev === edgeId ? null : edgeId));
  };

  const handleFundarClick = async () => {
    try {
      const res = await fetch(`${backendURL}/partidas/${partidaId}/fundar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idVertice: selectedVertexId,
          idArista: selectedEdgeId,
          jugadorId: jugadorIdPropio
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      console.log('✅ Fundación realizada:', data);

      setSelectedVertexId(null);
      setSelectedEdgeId(null);
    } catch (err) {
      console.error('Error al fundar:', err);
    }
  };

  const esMiTurno = () => partida?.idJugadorTurnoActual === jugadorIdPropio;
  const enFaseFundando = () => partida?.estado === 'fundando';

  const handlePasarTurno = async () => {
    try {
      const res = await fetch(`${backendURL}/partidas/${partidaId}/pasar-turno`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      console.log('✅ Turno pasado:', data);
    } catch (err) {
      console.error('Error al pasar turno:', err);
    }
  };

  return (
    <div className="tablero-centrado">
      <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '18px' }}>
        {esMiTurno() ? '✅ Es tu turno' : '⌛ No es tu turno'}

        {esMiTurno() && (
          <>
            <button
              style={{ marginTop: '10px', padding: '8px 16px', fontSize: '16px', cursor: 'pointer', display: 'block' }}
              onClick={handlePasarTurno}
            >
              Pasar turno
            </button>

            <div style={{ marginTop: '10px' }}>
              <div>Vértice seleccionado: {selectedVertexId ?? 'Ninguno'}</div>
              <div>Arista seleccionada: {selectedEdgeId ?? 'Ninguna'}</div>

              <button
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  fontSize: '16px',
                  cursor: selectedVertexId && selectedEdgeId ? 'pointer' : 'not-allowed',
                  opacity: selectedVertexId && selectedEdgeId ? 1 : 0.5
                }}
                disabled={!(selectedVertexId && selectedEdgeId)}
                onClick={handleFundarClick}
              >
                Fundar
              </button>
            </div>
          </>
        )}
      </div>

      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {tablero.Aristas.map((arista) => {
          const vInicio = tablero.Vertices.find(v => v.id === arista.idVerticeInicio);
          const vFin = tablero.Vertices.find(v => v.id === arista.idVerticeFin);
          if (!vInicio || !vFin) return null;

          const construida = construcciones.aristas[arista.id];
          const isSelected = selectedEdgeId === arista.id;

          return (
            <line
              key={arista.id}
              x1={vInicio.posicionX + CENTER_X}
              y1={vInicio.posicionY + CENTER_Y}
              x2={vFin.posicionX + CENTER_X}
              y2={vFin.posicionY + CENTER_Y}
              stroke={
                construida ? '#8B0000' :
                isSelected ? 'orange' :
                'lightgray'
              }
              strokeWidth={construida ? 10 : isSelected ? 6 : 3}
              onClick={(e) => {
                e.stopPropagation();
                handleEdgeClick(arista.id);
              }}
              style={{
                cursor: 'pointer',
                pointerEvents: 'visiblePainted'
              }}
            />
          );
        })}
      </svg>

      {tablero.Vertices.map((vertex) => (
        <Vertex
          key={vertex.id}
          x={vertex.posicionX + CENTER_X}
          y={vertex.posicionY + CENTER_Y}
          onClick={() => handleVertexClick(vertex.id)}
          selected={selectedVertexId === vertex.id}
          construccion={construcciones.vertices[vertex.id]}
        />
      ))}

      {tablero.Terrenos.map((terreno) => {
        const { x: cx, y: cy } = axialToPixel(terreno.posicionX, terreno.posicionY, HEX_SIZE);
        return (
          <Tile
            key={terreno.id}
            tipo={terreno.tipo}
            numero={terreno.numeroFicha}
            tieneLadron={terreno.tieneLadron}
            left={cx}
            top={cy}
          />
        );
      })}
    </div>
  );
};

export default GameBoard;
