import React, { useEffect, useState } from 'react';
import './Inventario.css';

function Inventario({ idPartida }) {
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
    <div className="inventario-container">
      <h3>📦 Inventario de jugadores</h3>
      {inventario.map((jugador) => (
        <div key={jugador.idJugador} className="inventario-jugador">
          <strong>
            Jugador
            {jugador.nombre ?? jugador.idJugador}
            :
          </strong>
          <ul>
            {Object.entries(jugador.especialistas).map(([tipo, cantidad]) => (
              <li key={tipo}>
                {tipo}
                :
                {' '}
                {cantidad}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Inventario;
