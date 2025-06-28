import './GameBoard.css';
import Edge from './Edge';
import Vertex from './Vertex';
import Tile from './Tile';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useToast} from '../context/toast-context.jsx';

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
  const [mostrarModalOferta, setMostrarModalOferta] = useState(false);
  const [mostrarIntercambio, setMostrarIntercambio] = useState(false);
  const [tipoADar, setTipoADar] = useState('');
  const [tipoARecibir, setTipoARecibir] = useState('');
  const [ofertaRecibida, setOfertaRecibida] = useState(null);
  const [jugadorDestino, setJugadorDestino] = useState('');
  const [jugadores, setJugadores] = useState([]);
  const [recursoOfrecido, setRecursoOfrecido] = useState('');
  const [recursoSolicitado, setRecursoSolicitado] = useState('');
  const [cantidadOfrecida, setCantidadOfrecida] = useState(1);
  const [cantidadSolicitada, setCantidadSolicitada] = useState(1);
  const vertexOk = selectedVertexId !== null && selectedVertexId !== undefined;
  const edgeOk = selectedEdgeId !== null && selectedEdgeId !== undefined;
  




  const handleEnviarOferta = async () => {

    if (!jugadorDestino || !recursoOfrecido || !recursoSolicitado || !cantidadOfrecida || !cantidadSolicitada) {
      showToast("❌ Faltan campos para enviar la oferta", "error");
      console.warn("⚠️ Validación fallida: campos incompletos", {
        jugadorDestino,
        recursoOfrecido,
        recursoSolicitado,
        cantidadOfrecida,
        cantidadSolicitada
      });
      return;
    }


    console.log("📤 Enviando oferta con los siguientes datos:");

    const payload = {
        idJugador: jugadorIdPropio,
        idJugadorDestino: jugadorDestino, 
        recursoOfrecido,
        recursoSolicitado,
        cantidadOfrecida: Number(cantidadOfrecida),
        cantidadSolicitada: Number(cantidadSolicitada)
      };

    try {
      const response = await axios.post(`${import.meta.env.VITE_backendURL}/comercio/oferta`, payload ,{

        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      showToast("✅ Oferta enviada con éxito", "success");
      setMostrarModalOferta(false);
      setRecursoOfrecido('');
      setRecursoSolicitado('');
      setCantidadOfrecida(1);
      setCantidadSolicitada(1);
      setJugadorDestino('');
    } catch (err) {
        console.error("❌ Error al enviar oferta:", err);

        
        if (err.response) {
          console.error("📄 Código de estado:", err.response.status);
          console.error("📄 Headers:", err.response.headers);
          console.error("📄 Data completa:", JSON.stringify(err.response.data, null, 2));
        } else {
          console.error("📄 Error sin respuesta del servidor:", err.message);
        }

        const mensaje = err.response?.data?.error || '❌ Error desconocido al enviar la oferta';
        showToast(mensaje, 'error');
      }
  };


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


  useEffect(() => {
    if (!tableroId) return;
    axios.get(`${import.meta.env.VITE_backendURL}/tableros/${tableroId}`,{
      headers: { Authorization: `Bearer ${token}`}
    })
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
        setColoresJugadores(mapping);
        setJugadores(jugadoresDePartida);
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
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_backendURL}/comercio/pendientes/${jugadorIdPropio}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        const ofertas = response.data.ofertas;
        if (ofertas && ofertas.length > 0) {
          console.log("📨 Oferta recibida:", ofertas[0]);
          setOfertaRecibida(ofertas[0]);  
        } else {
          setOfertaRecibida(null);
        }

      } catch (error) {
        console.error("❌ Error al obtener ofertas pendientes:", error);
      }
    }, 5000); 
    return () => clearInterval(interval);
  }, [jugadorIdPropio]);


const handleAceptarOferta = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_backendURL}/comercio/aceptar`, {
      ofertaId: ofertaRecibida.id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    showToast("✅ Oferta aceptada", "success");
    setOfertaRecibida(null);
    fetchInventario(); 
  } catch (err) {
    console.error("Error al aceptar oferta:", err);
    const mensaje = err.response?.data?.error || 'Error al aceptar la oferta';
    showToast(mensaje, 'error');
  }
};

const handleRechazarOferta = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_backendURL}/comercio/rechazar`, {
      ofertaId: ofertaRecibida.id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    showToast("❌ Oferta rechazada", "info");
    setOfertaRecibida(null);
  } catch (err) {
    console.error("Error al rechazar oferta:", err);
    const mensaje = err.response?.data?.error || 'Error al rechazar la oferta';
    showToast(mensaje, 'error');
  }
};



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

  const handleIntercambioBanco = () => {
  setMostrarIntercambio(true);
};

return (
  <div className="tablero-centrado">
    {ofertaRecibida && (
      <div className="modal-oferta">
        <p><strong>¡Has recibido una oferta!</strong></p>
        <p>Te ofrecen {ofertaRecibida.cantidadOfrecida} {ofertaRecibida.recursoOfrecido}</p>
        <p>A cambio de {ofertaRecibida.cantidadSolicitada} {ofertaRecibida.recursoSolicitado}</p>
        <button onClick={handleAceptarOferta}>Aceptar</button>
        <button onClick={handleRechazarOferta}>Rechazar</button>
      </div>
    )}

    {mostrarModalOferta && (
      <div className="modal-oferta">
        <h3>Crear Oferta</h3>
        <label>Jugador destinatario:</label>
        <select value={jugadorDestino} onChange={(e) => setJugadorDestino(e.target.value)}>
          <option value="">Selecciona jugador</option>
          {jugadores
            .filter((jug) => jug.id !== jugadorIdPropio)
            .map((jug) => (
              <option key={jug.id} value={jug.id}>
                {jug.nombre || `Jugador ${jug.id}`}
              </option>
            ))}
        </select>

        <label>Recurso que ofreces:</label>
        <select value={recursoOfrecido} onChange={(e) => setRecursoOfrecido(e.target.value)}>
          <option value="">Selecciona</option>
          <option value="ñoño">Ñoño</option>
          <option value="zorrón">Zorrón</option>
          <option value="abogado">Abogado</option>
          <option value="suero">Suero</option>
          <option value="agricultor">Agricultor</option>
        </select>

        <label>Cantidad ofrecida:</label>
        <input type="number" min={1} value={cantidadOfrecida} onChange={(e) => setCantidadOfrecida(e.target.value)} />

        <label>Recurso que pides:</label>
        <select value={recursoSolicitado} onChange={(e) => setRecursoSolicitado(e.target.value)}>
          <option value="">Selecciona</option>
          <option value="ñoño">Ñoño</option>
          <option value="zorrón">Zorrón</option>
          <option value="abogado">Abogado</option>
          <option value="suero">Suero</option>
          <option value="agricultor">Agricultor</option>
        </select>

        <label>Cantidad solicitada:</label>
        <input type="number" min={1} value={cantidadSolicitada} onChange={(e) => setCantidadSolicitada(e.target.value)} />

        <button onClick={handleEnviarOferta} disabled={!jugadorDestino || !recursoOfrecido || !recursoSolicitado}>
          Enviar oferta
        </button>
        <button onClick={() => setMostrarModalOferta(false)}>Cancelar</button>
      </div>
    )}

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
          <button onClick={() => setMostrarModalOferta(true)}>🤝 Negociar con jugador</button>

          {mostrarIntercambio && (
            <div className="intercambio-banco">
              <p>Intercambia 4 de un tipo por 1 de otro</p>
              <label>Dar:</label>
              <select value={tipoADar} onChange={(e) => setTipoADar(e.target.value)}>
                <option value="">Selecciona tipo</option>
                <option value="ñoño">Ñoño</option>
                <option value="zorrón">Zorrón</option>
                <option value="abogado">Abogado</option>
                <option value="suero">Suero</option>
                <option value="agricultor">Agricultor</option>
              </select>
              <label>Recibir:</label>
              <select value={tipoARecibir} onChange={(e) => setTipoARecibir(e.target.value)}>
                <option value="">Selecciona tipo</option>
                <option value="ñoño">Ñoño</option>
                <option value="zorrón">Zorrón</option>
                <option value="abogado">Abogado</option>
                <option value="suero">Suero</option>
                <option value="agricultor">Agricultor</option>
              </select>
              <button
                onClick={handleIntercambiarConBanco}
                disabled={!tipoADar || !tipoARecibir || tipoADar === tipoARecibir}
              >
                Confirmar intercambio
              </button>
              <button onClick={() => setMostrarIntercambio(false)}>Cancelar</button>
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

      {esMiTurno() && partida?.estado === 'fundando' && (
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
      )}

      {esMiTurno() && <button onClick={onPasarTurno}>Pasar turno</button>}
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
      <img src="/hexagono_mar.png" alt="Fondo tablero hexagonal" className="fondo-hexagonal" />

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

      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 2 }}>
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
}

export default GameBoard;