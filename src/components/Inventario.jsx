// components/Inventario.jsx
import React, { useEffect, useState } from 'react';

const Inventario = ({ idPartida }) => {
  const [inventario, setInventario] = useState([]);

  const fetchInventario = async () => {
    try {
      const res = await fetch(`/inventario/${idPartida}`);
      const data = await res.json();
      setInventario(data);
    } catch (error) {
      console.error('❌ Error al obtener el inventario:', error);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, [idPartida]);

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', margin: '1rem', borderRadius: '8px' }}>
      <h3>📦 Inventario de jugadores</h3>
      {inventario.map((jugador) => (
        <div key={jugador.idJugador} style={{ marginBottom: '1rem' }}>
          <strong>Jugador {jugador.nombre ?? jugador.idJugador}:</strong>
          <ul>
            {Object.entries(jugador.especialistas).map(([tipo, cantidad]) => (
              <li key={tipo}>{tipo}: {cantidad}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Inventario;
