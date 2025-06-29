import './GameBoard.css';
import Edge from './Edge';
import Vertex from './Vertex';
import Tile from './Tile';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useToast} from '../context/toast-context.jsx';
import ModalDescartarCartas from './ModalDescartarCartas.jsx';
import ModalRobarCarta from './ModalRobo.jsx';

const HEX_SIZE = 60;
const CENTER_X = 520;
const CENTER_Y = 600;

function axialToPixel(q, r, size) {
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * 3 / 2 * r;
  return { x, y };
}

const GameBoard = ({ partida, jugadorIdPropio, partidaId, tableroId, onPasarTurno}) => {
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
  const [tipoConstruccion, setTipoConstruccion] = useState('');
  const { showToast } = useToast();
  const [mostrarIntercambio, setMostrarIntercambio] = useState(false);
  const [tipoADar, setTipoADar] = useState('');
  const [tipoARecibir, setTipoARecibir] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [cantidadADescartar, setCantidadADescartar] = useState(0);
  const [jugadorDebeDescartar, setJugadorDebeDescartar] = useState(false);
  const [modoMoverLadron, setModoMoverLadron] = useState(false);
  const [terrenoSeleccionadoId, setTerrenoSeleccionadoId] = useState(null);
  const [ultimaFechaActualizacion, setUltimaFechaActualizacion] = useState(null);
  const [mostrarModalRobo, setMostrarModalRobo] = useState(false);
  const [jugadoresAdyacentes, setJugadoresAdyacentes] = useState([]);

  const vertexOk = selectedVertexId !== null && selectedVertexId !== undefined;
  const edgeOk = selectedEdgeId !== null && selectedEdgeId !== undefined;

  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${partidaId}/updated-at`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const ultimaFecha = data.updatedAt;
        console.log("Última fecha de actualización del servidor:", ultimaFecha);
        const nuevaFecha = new Date(data.updatedAt);


        if (!ultimaFechaActualizacion || nuevaFecha > new Date(ultimaFechaActualizacion)) {
          console.log("Detecto cambios en el servidor, actualizando tablero...");
          setUltimaFechaActualizacion(nuevaFecha);
          await fetchTablero(); 
        }
      } catch (error) {
        console.error('Error en el polling de updatedAt:', error);
      }
    }, 3000);

  return () => clearInterval(intervalo);
}, [partidaId, ultimaFechaActualizacion]);
  
  const handleIntercambiarConBanco = async () => {
  try {
    console.log("jugadorId:", jugadorIdPropio);
    console.log("tipoADar:", tipoADar);
    console.log("tipoARecibir:", tipoARecibir);
    const response = await axios.post(`${import.meta.env.VITE_backendURL}/comercio/banco`, {
      jugadorId: jugadorIdPropio,
      tipoADar,
      tipoARecibir
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    showToast('✅ Intercambio realizado con éxito', 'success');
    fetchInventario();
    setMostrarIntercambio(false);
    setTipoADar('');
    setTipoARecibir('');
  } catch (err) {
    const mensaje = err.response?.data?.error || '❌ Error al intercambiar';
    showToast(mensaje, 'error');
  }
};


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

      setConstrucciones({ vertices, aristas });

    } catch (error) {
      console.error("❌ Error al cargar construcciones:", error);
    }
  };

  const fetchTablero = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_backendURL}/tableros/${tableroId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      setTablero({
        Terrenos: data.Terrenos || [],
        Vertices: data.Vertices || [],
        Aristas: data.Aristas || []
      });
    } catch (error) {
      console.error("Error al encontrar tablero", error);
    }
  };


  useEffect(() => {
    if (!tableroId) return;
    fetchTablero(); 
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
    if (!esMiTurno()) return;

    if (partida.estado === 'jugando' && tipoConstruccion !== 'departamento' && tipoConstruccion !== 'facultad') return;
    if (partida.estado === 'fundando') setSelectedVertexId(prev => (prev === vertexId ? null : vertexId));
    else setSelectedVertexId(prev => (prev === vertexId ? null : vertexId));
  };

  const handleEdgeClick = (edgeId) => {
    if (!esMiTurno()) return;

    if (partida.estado === 'jugando' && tipoConstruccion !== 'muro') return;
    if (partida.estado === 'fundando') setSelectedEdgeId(prev => (prev === edgeId ? null : edgeId));
    else setSelectedEdgeId(prev => (prev === edgeId ? null : edgeId));
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

      showToast('¡Construcción fundada con éxito!', 'success');

    } catch (err) {
      console.error('Error al fundar:', err);
      
      const mensaje = err.response?.data?.error || 'Error al intentar fundar';
      showToast(mensaje, 'error');
    }
  };

  const handleConstruirClick = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_backendURL}/jugada/construir`, {
        tipo: tipoConstruccion,
        idVertice: selectedVertexId,
        idArista: selectedEdgeId,
        jugadorId: jugadorIdPropio
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setTipoConstruccion('');
      setSelectedVertexId(null);
      setSelectedEdgeId(null);
      await fetchConstrucciones();
      fetchInventario();

      showToast('✅ ¡Construcción realizada con éxito!', 'success');

    } catch (err) {
      console.error('Error completo:', err);
      console.error('Respuesta del backend:', err.response?.data);

      const mensaje = err.response?.data?.error || 'Error al intentar construir';
      showToast(mensaje, 'error');
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

      const resultado = response.data.resultado;
      setResultadoDados(resultado);
      fetchInventario();

      if (resultado.suma === 7) {
        const jugadoresDescartar = response.data.jugadoresDescartar;
        console.log("Jugadores que deben descartar:", jugadoresDescartar);
        const yoDebo = jugadoresDescartar.find(j => Number(j.id) === Number(jugadorIdPropio));
        console.log("¿Yo debo descartar?", yoDebo);

        if (yoDebo) {
          setCantidadADescartar(yoDebo.cantidadADescartar);
          setJugadorDebeDescartar(true);
          setModalVisible(true);
        }
      }
    } catch (error) {
  console.error("Error al lanzar dados:", error);
  console.log("Mensaje del backend:", error.response?.data);
  showToast('❌ Error al lanzar dados', 'error');
    }
  };

  const handleDescarte = async (cartas) => {
      try {
        await axios.post(`${import.meta.env.VITE_backendURL}/jugada`, {
          tipo: 'descartar_cartas',
          jugadorId: jugadorIdPropio,
          idPartida: partidaId,
          cantidad: cantidadADescartar,
          cartas
        }, {
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        });
        setModalVisible(false);
        setJugadorDebeDescartar(false); 
        fetchInventario();
        showToast('✅ Cartas descartadas correctamente', 'success');
      } catch (error) {
        console.error("Error al descartar cartas:", error); 
        showToast('❌ Error al descartar cartas', 'error');
      }
    };

  const handleMoverLadron = async () => {
    try {
        console.log("Intentando mover ladrón con los siguientes datos:");
        console.log("jugadorId:", jugadorIdPropio);
        console.log("idPartida:", partidaId);
        console.log("idTerrenoNuevo:", terrenoSeleccionadoId);

      await axios.post(`${import.meta.env.VITE_backendURL}/jugada`, {
        tipo: 'mover_ladron',
        jugadorId: jugadorIdPropio,
        idPartida: partidaId,
        idTerrenoNuevo: terrenoSeleccionadoId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      showToast('✅ Ladrón movido exitosamente', 'success');
      await fetchTablero();
      setModoMoverLadron(false);
      setTerrenoSeleccionadoId(null);

      const { data } = await axios.get(
        `${import.meta.env.VITE_backendURL}/partidas/${partidaId}/jugadores-adyacentes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'jugador-id': jugadorIdPropio,
          }
        }
      );
      console.log("Jugadores adyacentes obtenidos:", data.jugadores);

    if (data.jugadores.length > 0) {
      setJugadoresAdyacentes(data.jugadores);        
      setMostrarModalRobo(true);           
    } else {
      showToast('⚠️ No hay jugadores válidos para robar', 'info');
    }
 
    } catch (error) {
      console.error('Error al mover el ladrón:', error);
      showToast('❌ Error al mover el ladrón', 'error');
    }
  };

  const handleRobarCarta = async (idJugadorObjetivo) => {
    try {
      await axios.post(`${import.meta.env.VITE_backendURL}/jugada`, {
        tipo: 'robar',
        jugadorId: jugadorIdPropio,
        idPartida: partidaId,
        idJugadorObjetivo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showToast('✅ Carta robada con éxito', 'success');
      setMostrarModalRobo(false);
      await fetchInventario()
    } catch (error) {
      console.error('Error al robar carta:', error);
      showToast('❌ Error al robar carta', 'error');
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
        const response = await axios.get(`${import.meta.env.VITE_backendURL}/jugada/partida/${partidaId}/ultimo-lanzamiento`,{
          headers: { Authorization: `Bearer ${token}` },
        });
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

  useEffect(() => {
    if (partida?.estado !== 'jugando') return;

    const verificarDescartesPendientes = async () => {
      try {
        const lanzamiento = await axios.get(`${import.meta.env.VITE_backendURL}/jugada/partida/${partidaId}/ultimo-lanzamiento`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const {suma} = lanzamiento.data;
        if (suma === 7) {
          const response = await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${partidaId}/jugadores-a-descartar`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const jugadoresDescartar = response.data;
          const yoDebo = jugadoresDescartar.find(j => Number(j.id) === Number(jugadorIdPropio));
          if (yoDebo) {
            setCantidadADescartar(yoDebo.cantidadADescartar);
            setJugadorDebeDescartar(true);
            setModalVisible(true);
          }
        }} catch (error) {
          console.log("Error al verificar descartes pendientes:", error);
        }
      }
      const interval = setInterval(verificarDescartesPendientes, 3000);
      return () => clearInterval(interval);
    },[partidaId, jugadorIdPropio, token]
  );
      

  const handleIntercambioBanco = () => {
  setMostrarIntercambio(true);
};


return (
  <>
  <div className="tablero-centrado">
    <div className="estado-turno">
      {esMiTurno() ? '✅ Es tu turno' : '⌛ No es tu turno'}
      {coloresJugadores[jugadorIdPropio] && (
        <div style={{ marginTop: '6px' }}>
          Eres el jugador: <strong style={{ color: coloresJugadores[jugadorIdPropio] }}>{coloresJugadores[jugadorIdPropio]}</strong>
        </div>
      )}

      {esMiTurno() && partida?.estado === 'jugando' && (
        <>
          <button onClick={handleLanzarDados}>Lanzar dados</button>
          <button onClick={handleIntercambioBanco}>Intercambiar con el banco</button>

          {mostrarIntercambio && (
            <div className="intercambio-banco">
              <p style={{ margin: '8px 0' }}>Intercambia 4 de un tipo por 1 de otro</p>

              <label>Dar:</label>
              <select value={tipoADar} onChange={(e) => setTipoADar(e.target.value)}>
                <option value="">Selecciona tipo a entregar</option>
                <option value="ñoño">Ñoño</option>
                <option value="zorrón">Zorrón</option>
                <option value="abogado">Abogado</option>
                <option value="suero">Suero</option>
                <option value="agricultor">Agricultor</option>
              </select>

              <label>Recibir:</label>
              <select value={tipoARecibir} onChange={(e) => setTipoARecibir(e.target.value)}>
                <option value="">Selecciona tipo a recibir</option>
                <option value="ñoño">Ñoño</option>
                <option value="zorrón">Zorrón</option>
                <option value="abogado">Abogado</option>
                <option value="suero">Suero</option>
                <option value="agricultor">Agricultor</option>
              </select>

              <button
                onClick={handleIntercambiarConBanco}
                disabled={!tipoADar || !tipoARecibir || tipoADar === tipoARecibir}
                style={{ marginTop: '6px' }}
              >
                Confirmar intercambio
              </button>
              <button onClick={() => setMostrarIntercambio(false)} style={{ marginLeft: '6px' }}>
                Cancelar
              </button>
            </div>
          )}

          <div style={{ marginTop: '10px' }}>
            <label htmlFor="tipoConstruccion">Elige tipo de construcción:</label>
            <select
              id="tipoConstruccion"
              value={tipoConstruccion}
              onChange={(e) => setTipoConstruccion(e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              <option value="">-- Seleccionar --</option>
              <option value="departamento">Departamento</option>
              <option value="muro">Muro</option>
              <option value="facultad">Facultad</option>
            </select>
          </div>

          <div style={{ marginTop: '10px' }}>
            <div>Vértice seleccionado: {selectedVertexId ?? 'Ninguno'}</div>
            <div>Arista seleccionada: {selectedEdgeId ?? 'Ninguna'}</div>
            <button
              className={`boton-fundar ${!tipoConstruccion ? 'disabled' : ''}`}
              disabled={!tipoConstruccion}
              onClick={handleConstruirClick}
            >
              Construir
            </button>
          </div>
        </>
      )}

      {resultadoDados && (
        <div style={{ marginTop: '10px' }}>
          Dados: 🎲 {resultadoDados.dado1} + {resultadoDados.dado2} = <strong>{resultadoDados.suma}</strong>
        </div>
      )}


      {esMiTurno() && resultadoDados?.suma === 7 && !jugadorDebeDescartar && (
        <>
          {!modoMoverLadron && (
            <button onClick={() => setModoMoverLadron(true)} style={{ marginTop: '10px' }}>
              Mover ladrón
            </button>
          )}
          {modoMoverLadron && (
            <div style={{ marginTop: '10px' }}>
              <p>Selecciona un terreno para mover el ladrón</p>
              {terrenoSeleccionadoId && (
                <button onClick={handleMoverLadron}>
                  Confirmar movimiento
                </button>
              )}
              <button onClick={() => {
                setModoMoverLadron(false);
                setTerrenoSeleccionadoId(null);
              }} style={{ marginLeft: '10px' }}>
                Cancelar
              </button>
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
        <button onClick={onPasarTurno}>Pasar turno</button>
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

      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
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
            onClick={() => {
              if (modoMoverLadron && esMiTurno()) {
                setTerrenoSeleccionadoId(terreno.id);
              }
            }}
            seleccionado={terrenoSeleccionadoId === terreno.id}
          />
        );
      })}

      {tablero.Vertices.map((vertex) => {
        const construccionVertice = construcciones.vertices[Number(vertex.id)];

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


    </div>
  </div>
  {jugadorDebeDescartar && modalVisible && (
      <ModalDescartarCartas
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        inventario={inventario[0]?.inventario || []}
        cantidadADescartar={cantidadADescartar}
        onDescartar={handleDescarte}
      />
  )}
  {mostrarModalRobo && (
  <ModalRobarCarta
    visible={mostrarModalRobo}
    onClose={() => setMostrarModalRobo(false)}
    jugadores={jugadoresAdyacentes}
    onRobar={handleRobarCarta}
  />
)}
    </>
 );
};

export default GameBoard;