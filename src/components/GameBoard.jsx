import './GameBoard.css';
import Edge from './Edge';
import Vertex from './Vertex';
import Tile from './Tile';
import { useEffect, useState } from 'react';
import axios from 'axios';

const HEX_SIZE = 60;
const CENTER_X = 520;
const CENTER_Y = 600;

function axialToPixel(q, r, size) {
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * 3 / 2 * r;
  return { x, y };
}

const GameBoard = ({ partida, jugadorIdPropio, partidaId, tableroId }) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const [tablero, setTablero] = useState({ Terrenos: [], Vertices: [], Aristas: [] });
  const [jugadorEsperadoId, setJugadorEsperadoId] = useState(null);
  const [selectedVertexId, setSelectedVertexId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [construcciones, setConstrucciones] = useState({ vertices: {}, aristas: {} });
  const [coloresJugadores, setColoresJugadores] = useState({});
  const [inventario, setInventario] = useState([]);
  const [resultadoDados, setResultadoDados] = useState(null);

  const vertexOk = selectedVertexId !== null && selectedVertexId !== undefined;
  const edgeOk = selectedEdgeId !== null && selectedEdgeId !== undefined;

  const fetchConstrucciones = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_backendURL}/construcciones/juego/${partidaId}`);
      const data = response.data;
      const vertices = {};
      const aristas = {};

      (data.construcciones || []).forEach(c => {
        if (c.idPartida === Number(partidaId)) {
          if (c.tipo === 'departamento' && c.Vertice?.id) {
            vertices[c.Vertice.id] = {
              tipo: c.tipo,
              jugadorId: c.idJugador
            };
          }
          if (c.tipo === 'muro' && c.Aristum?.id) {
            aristas[c.Aristum.id] = {
              tipo: c.tipo,
              jugadorId: c.idJugador
            };
          }
        }
      });

      console.log('✅ Construcciones parseadas:', { vertices, aristas });
      setConstrucciones({ vertices, aristas });

    } catch (error) {
      console.error("❌ Error al cargar construcciones:", error);
    }
  };


  useEffect(() => {
    if (!tableroId) return;
    axios.get(`${import.meta.env.VITE_backendURL}/tableros/${tableroId}`)
      .then(response => {
        const data = response.data;
        setTablero({
          Terrenos: data.Terrenos || [],
          Vertices: data.Vertices || [],
          Aristas: data.Aristas || []
        });
      })
      .catch(error => {
        console.error("Error al encontrar tablero", error);
      });
  }, [tableroId]);

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backendURL}/jugadores`);
        const jugadores = response.data;
        const jugadoresDePartida = jugadores.filter(j => Number(j.idPartida) === Number(partidaId));
        const traduccionesCSS = {
          rojo: 'red', azul: 'blue', amarillo: 'yellow', blanco: '#bfbfbf', verde: 'green', negro: 'black'
        };
        const mapping = {};
        jugadoresDePartida.forEach(j => {
          mapping[j.id] = traduccionesCSS[j.color] || j.color;
        });
        console.log('🎯 Jugadores de la partida:', jugadoresDePartida);
        console.log('🎨 Mapping de colores (coloresJugadores):', mapping);
        setColoresJugadores(mapping);
      } catch (error) {
        console.error('Error al obtener colores de jugadores:', error);
      }
    };

    fetchJugadores();
  }, [partidaId]);

  useEffect(() => {
    fetchConstrucciones();
    const interval = setInterval(fetchConstrucciones, 3000);
    return () => clearInterval(interval);
  }, [partidaId]);

  useEffect(() => {
    if (partida?.estado !== 'fundando') return;
    const fetchSiguienteFundador = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${partidaId}/siguiente-fundador`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        setJugadorEsperadoId(data.jugadorEsperadoId);
      } catch (error) {
        console.error("Error al obtener siguiente fundador:", error);
      }
    };

    fetchSiguienteFundador();
    const interval = setInterval(fetchSiguienteFundador, 3000);
    return () => clearInterval(interval);
  }, [partida?.estado, partidaId]);

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
      await axios.post(`${import.meta.env.VITE_backendURL}/partidas/${partidaId}/fundar`, {
        idVertice: selectedVertexId,
        idArista: selectedEdgeId,
        jugadorId: jugadorIdPropio
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSelectedVertexId(null);
      setSelectedEdgeId(null);
      await fetchConstrucciones();
    } catch (err) {
      console.error('Error al fundar:', err);
    }
  };

  const handleLanzarDados = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backendURL}/jugada`,
        { tipo: 'lanzar_dado', jugadorId: jugadorIdPropio },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setResultadoDados(response.data.resultado);
      fetchInventario();
    } catch (error) {
      console.error("Error al lanzar dados:", error);
    }
  };

  const fetchInventario = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${partidaId}/inventario-propio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventario([response.data]);
    } catch (err) {
      console.error("Error al obtener inventario:", err);
    }
  };

  useEffect(() => {
    if (partida?.estado !== 'jugando') return;
    fetchInventario();
    const interval = setInterval(fetchInventario, 3000);
    return () => clearInterval(interval);
  }, [partida?.estado]);

  useEffect(() => {
    if (partida?.estado !== 'jugando') return;
    const fetchUltimoLanzamiento = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_backendURL}/jugada/partida/${partidaId}/ultimo-lanzamiento`);
        const data = response.data;
        if (data.dado1 !== undefined && data.dado2 !== undefined) {
          setResultadoDados({
            dado1: data.dado1,
            dado2: data.dado2,
            suma: data.suma,
            jugadorId: data.jugadorId
          });
        }
      } catch (err) {
        console.error("Error al obtener último lanzamiento de dados:", err);
      }
    };

    fetchUltimoLanzamiento();
    const interval = setInterval(fetchUltimoLanzamiento, 3000);
    return () => clearInterval(interval);
  }, [partida?.estado]);

  const handlePasarTurno = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_backendURL}/partidas/${partidaId}/pasar-turno`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('Error al pasar turno:', err);
    }
  };

  return (
    <div className="tablero-centrado">
      <div className="estado-turno">
        {esMiTurno() ? '✅ Es tu turno' : '⌛ No es tu turno'}
        {coloresJugadores[jugadorIdPropio] && (
          <div style={{ marginTop: '6px' }}>
            Eres el jugador: <strong style={{ color: coloresJugadores[jugadorIdPropio] }}>{coloresJugadores[jugadorIdPropio]}</strong>
          </div>
        )}
        {esMiTurno() && partida?.estado === 'jugando' && (
          <button onClick={handleLanzarDados}>Lanzar dados</button>
        )}
        {resultadoDados && (
          <div style={{ marginTop: '10px' }}>
            Dados: 🎲 {resultadoDados.dado1} + {resultadoDados.dado2} = <strong>{resultadoDados.suma}</strong>
          </div>
        )}
        {esMiTurno() && partida?.estado === 'fundando' && (
          <>
            <div style={{ marginTop: '10px' }}>
              <div>Vértice seleccionado: {selectedVertexId ?? 'Ninguno'}</div>
              <div>Arista seleccionada: {selectedEdgeId ?? 'Ninguna'}</div>
              <button
                className={`boton-fundar ${!(vertexOk && edgeOk) ? 'disabled' : ''}`}
                disabled={!(vertexOk && edgeOk)}
                onClick={handleFundarClick}
              >
                Fundar
              </button>
            </div>
          </>
        )}
        {esMiTurno() && (
          <button onClick={handlePasarTurno}>Pasar turno</button>
        )}
      </div>

      {inventario.length > 0 && (
        <div className="inventario">
          <h4>📦 Tu inventario:</h4>
          <ul>
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

      <div className="tablero">
        <img
          src="/hexagono_mar.png"
          alt="Fondo tablero hexagonal"
          className="fondo-hexagonal"
        />

        {tablero.Terrenos.map((terreno) => {
          const { x, y } = axialToPixel(terreno.posicionX, terreno.posicionY, HEX_SIZE);
          return (
            <Tile
              key={terreno.id}
              tipo={terreno.tipo}
              numero={terreno.numeroFicha}
              tieneLadron={terreno.tieneLadron}
              left={x + CENTER_X}
              top={y + CENTER_Y}
            />
          );
        })}

        {tablero.Vertices.map((vertex) => {
          const construccionVertice = construcciones.vertices[Number(vertex.id)];
          console.log(`🎯 Vertex ID: ${vertex.id}`, construccionVertice);

          return (
            <Vertex
              key={vertex.id}
              x={vertex.posicionX + CENTER_X}
              y={vertex.posicionY + CENTER_Y}
              onClick={() => handleVertexClick(vertex.id)}
              selected={selectedVertexId === vertex.id}
              construccion={construccionVertice}
              coloresJugadores={coloresJugadores}
            />
          );
        })}

        <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'auto' }}>
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
                construccion={construcciones.aristas[Number(arista.id)]}
                coloresJugadores={coloresJugadores}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default GameBoard;
