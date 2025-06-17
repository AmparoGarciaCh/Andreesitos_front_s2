// GameBoard.jsx
import './GameBoard.css';
import Edge from './Edge';
import Vertex from './Vertex';
import Tile from './Tile';
import { useEffect, useState } from 'react';

const HEX_SIZE = 60;

function axialToPixel(q, r, size) {
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * 3 / 2 * r;
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
  const [jugadorEsperadoId, setJugadorEsperadoId] = useState(null);
  const [selectedVertexId, setSelectedVertexId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [construcciones, setConstrucciones] = useState({ vertices: {}, aristas: {} });
  const [coloresJugadores, setColoresJugadores] = useState({});
  const [inventario, setInventario] = useState([]);
  const [resultadoDados, setResultadoDados] = useState(null);

  const vertexOk = selectedVertexId !== null && selectedVertexId !== undefined;
  const edgeOk = selectedEdgeId !== null && selectedEdgeId !== undefined;

  useEffect(() => {
    const fetchTablero = async () => {
      const res = await fetch(`http://localhost:3000/tableros/${tableroId}`);
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
      const resPartida = await fetch(`http://localhost:3000/partidas/${partidaId}`);
      const dataPartida = await resPartida.json();
      setPartida(dataPartida.partida);
    };
    fetchPartida();
    const interval = setInterval(fetchPartida, 3000);
    return () => clearInterval(interval);
  }, [partidaId]);

  useEffect(() => {
    const fetchJugadorPropio = async () => {
      const resJugadores = await fetch('http://localhost:3000/jugadores');
      const jugadores = await resJugadores.json();
      const miJugador = jugadores.find(j => j.usuarioId === usuario.id && j.idPartida === partidaId);
      if (miJugador) setJugadorIdPropio(miJugador.id);
    };
    fetchJugadorPropio();
  }, [partidaId, usuario.id]);

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const res = await fetch(`http://localhost:3000/jugadores`);
        const data = await res.json();
        const jugadoresDePartida = data.filter(j => j.idPartida === partidaId);
        const mapping = {};
        const traduccionesCSS = {
          rojo: 'red', azul: 'blue', amarillo: 'yellow', blanco: '#bfbfbf', verde: 'green', negro: 'black'
        };
        jugadoresDePartida.forEach(j => {
          mapping[j.id] = traduccionesCSS[j.color] || j.color;
        });
        setColoresJugadores(mapping);
      } catch (err) {
        console.error('Error al obtener colores de jugadores:', err);
      }
    };
    fetchJugadores();
  }, [partidaId]);

  useEffect(() => {
    const fetchConstrucciones = async () => {
      try {
        const res = await fetch('http://localhost:3000/construcciones');
        const data = await res.json();
        const vertices = {};
        const aristas = {};
        (data.construcciones || []).forEach(c => {
          if (c.idPartida === partidaId) {
            if (c.tipo === 'departamento') {
              vertices[c.idVertice] = { tipo: 'facultad', jugadorId: c.idJugador };
            }
            if (c.tipo === 'muro') {
              aristas[c.idArista] = { tipo: 'muro', jugadorId: c.idJugador };
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

  useEffect(() => {
    const fetchSiguienteFundador = async () => {
      try {
        const res = await fetch(`http://localhost:3000/partidas/${partidaId}/siguiente-fundador`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setJugadorEsperadoId(data.jugadorEsperadoId);
      } catch (error) {
        console.error("Error al obtener siguiente fundador:", error);
      }
    };
    fetchSiguienteFundador();
    const interval = setInterval(fetchSiguienteFundador, 3000);
    return () => clearInterval(interval);
  }, [partidaId]);

  const esMiTurno = () => {
    if (!partida || !jugadorIdPropio) return false;
    if (partida.estado === 'fundando') return jugadorIdPropio === jugadorEsperadoId;
    return partida.idJugadorTurnoActual === jugadorIdPropio;
  };

  const enFaseFundando = () => partida?.estado === 'fundando';

  const handleVertexClick = (vertexId) => {
    if (!esMiTurno() || !enFaseFundando()) return;
    setSelectedVertexId(prev => (prev === vertexId ? null : vertexId));
  };

  const handleEdgeClick = (edgeId) => {
    if (!esMiTurno() || !enFaseFundando()) return;
    setSelectedEdgeId(prev => (prev === edgeId ? null : edgeId));
  };

  const handleFundarClick = async () => {
    try {
      const res = await fetch(`http://localhost:3000/partidas/${partidaId}/fundar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ idVertice: selectedVertexId, idArista: selectedEdgeId, jugadorId: jugadorIdPropio })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelectedVertexId(null);
      setSelectedEdgeId(null);
    } catch (err) {
      console.error('Error al fundar:', err);
    }
  };

  const handleLanzarDados = async () => {
    console.log("Presionando lanzar dados... ID jugador:", jugadorIdPropio);
    try {
      const res = await fetch(`http://localhost:3000/jugada`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tipo: 'lanzar_dado', jugadorId: jugadorIdPropio })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResultadoDados(data.resultado);
      fetchInventario(); // 👈 actualiza inventario propio
    } catch (error) {
      console.error("Error al lanzar dados:", error);
    }
  };

  const fetchInventario = async () => {
    try {
      const res = await fetch(`http://localhost:3000/partidas/${partidaId}/inventario-propio`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("📦 Inventario recibido del backend:", data);
      setInventario([data]);
    } catch (err) {
      console.error("Error al obtener inventario:", err);
    }
  };

  useEffect(() => {
    if (partida?.estado === 'jugando') {
      fetchInventario();
    }
  }, [partida?.estado]);

  const handlePasarTurno = async () => {
    try {
      const res = await fetch(`http://localhost:3000/partidas/${partidaId}/pasar-turno`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      console.error('Error al pasar turno:', err);
    }
  };

  return (
    <div className="tablero-centrado">
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '10px',
        zIndex: 1000,
        fontSize: '16px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        {esMiTurno() ? '✅ Es tu turno' : '⌛ No es tu turno'}
        {coloresJugadores[jugadorIdPropio] && (
          <div style={{ marginTop: '6px' }}>
            Eres el jugador: <strong style={{ color: coloresJugadores[jugadorIdPropio] }}>{coloresJugadores[jugadorIdPropio]}</strong>
          </div>
        )}
        {esMiTurno() && partida?.estado === 'jugando' && (
          <>
            <button
              style={{ marginTop: '10px', padding: '8px 16px', fontSize: '16px' }}
              onClick={handleLanzarDados}
            >
              Lanzar dados
            </button>
            {resultadoDados && (
              <div style={{ marginTop: '10px' }}>
                Dados: 🎲 {resultadoDados.dado1} + {resultadoDados.dado2} = <strong>{resultadoDados.suma}</strong>
              </div>
            )}
          </>
        )}
        {esMiTurno() && partida?.estado === 'fundando' && (
          <>
            <div style={{ marginTop: '10px' }}>
              <div>Vértice seleccionado: {selectedVertexId ?? 'Ninguno'}</div>
              <div>Arista seleccionada: {selectedEdgeId ?? 'Ninguna'}</div>
              <button
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  fontSize: '16px',
                  cursor: vertexOk && edgeOk ? 'pointer' : 'not-allowed',
                  opacity: vertexOk && edgeOk ? 1 : 0.5
                }}
                disabled={!(vertexOk && edgeOk)}
                onClick={handleFundarClick}
              >
                Fundar
              </button>
            </div>
          </>
        )}
        {esMiTurno() && (
          <button
            style={{ marginTop: '10px', padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}
            onClick={handlePasarTurno}
          >
            Pasar turno
          </button>
        )}
      </div>

      {/* ✅ Sección de inventario corregida */}
      {inventario.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'white',
          padding: '12px',
          borderRadius: '10px',
          zIndex: 1000,
          fontSize: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          maxWidth: '240px'
        }}>
          <h4 style={{ marginBottom: '8px' }}>📦 Tu inventario:</h4>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {inventario[0].inventario
              .filter(i => i.tipoEspecialista !== 'ninguno')
              .map((item, idx) => (
                <li key={idx}>
                  {item.tipoEspecialista}: {item.cantidad}
                </li>
              ))}
          </ul>
        </div>
      )}

      {tablero.Vertices.map((vertex) => (
        <Vertex
          key={vertex.id}
          x={vertex.posicionX + CENTER_X}
          y={vertex.posicionY + CENTER_Y}
          onClick={() => handleVertexClick(vertex.id)}
          selected={selectedVertexId === vertex.id}
          construccion={construcciones.vertices[vertex.id]}
          coloresJugadores={coloresJugadores}
        />
      ))}

      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'auto' }}>
        {tablero.Aristas.map((arista) => {
          const vInicio = tablero.Vertices.find(v => v.id === arista.idVerticeInicio);
          const vFin = tablero.Vertices.find(v => v.id === arista.idVerticeFin);
          if (!vInicio || !vFin) return null;
          return (
            <Edge
              key={arista.id}
              x1={vInicio.posicionX + CENTER_X}
              y1={vInicio.posicionY + CENTER_Y}
              x2={vFin.posicionX + CENTER_X}
              y2={vFin.posicionY + CENTER_Y}
              selected={selectedEdgeId === arista.id}
              onClick={() => handleEdgeClick(arista.id)}
              construccion={construcciones.aristas[arista.id]}
              coloresJugadores={coloresJugadores}
            />
          );
        })}
      </svg>

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
