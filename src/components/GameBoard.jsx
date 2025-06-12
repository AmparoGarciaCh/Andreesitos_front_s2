// src/components/GameBoard.jsx
import './GameBoard.css';
import Edge from './Edge';
import Vertex from './Vertex';
import Tile from './Tile';

import { useEffect, useState, useMemo } from 'react';

const HEX_SIZE = 60;

function axialToPixel(q, r, size) {
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * 3 / 2 * r;
  return { x, y };
}

const GameBoard = ({ tableroId }) => {
  const [tablero, setTablero] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tableroId) {
      console.warn('⚠️ No se recibió tableroId como prop');
      setError('No se recibió tableroId');
      return;
    }

    setLoading(true);
    setError(null);
    console.log('→ Fetching tablero:', `/tableros/${tableroId}`);

    fetch(`http://localhost:3000/tableros/${tableroId}`)
      .then((res) => {
        console.log('→ Response status:', res.status);
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('→ Tablero data:', data);
        setTablero(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('→ Error al cargar tablero', err);
        setError('No se pudo cargar el tablero.');
        setLoading(false);
      });
  }, [tableroId]);

  const vertexMap = useMemo(() => {
    const map = new Map();
    if (tablero?.Vertices) {
      tablero.Vertices.forEach((v) => {
        map.set(v.id, {
          x: v.posicionX * HEX_SIZE,
          y: v.posicionY * HEX_SIZE
        });
      });
    }
    return map;
  }, [tablero]);

  if (loading) {
    return <div className="tablero-centrado">Cargando tablero...</div>;
  }

  if (error) {
    return <div className="tablero-centrado">{error}</div>;
  }

  if (!tablero) {
    return <div className="tablero-centrado">No se pudo cargar el tablero.</div>;
  }

  return (
    <div className="tablero">
      {/* Aristas */}
      {tablero.Arista.map((arista) => {
        const vStart = vertexMap.get(arista.idVerticeInicio);
        const vEnd = vertexMap.get(arista.idVerticeFin);

        if (!vStart || !vEnd) return null;

        return (
          <Edge
            key={arista.id}
            x1={vStart.x}
            y1={vStart.y}
            x2={vEnd.x}
            y2={vEnd.y}
          />
        );
      })}

      {/* Vértices */}
      {tablero.Vertices.map((v) => (
        <Vertex
          key={v.id}
          x={v.posicionX * HEX_SIZE}
          y={v.posicionY * HEX_SIZE}
        />
      ))}

      {/* Tiles */}
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
