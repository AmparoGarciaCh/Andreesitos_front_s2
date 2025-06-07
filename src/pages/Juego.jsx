// src/pages/Juego.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Juego.css'; // crea tu estilo con fondo madera, fichas, etc.
import backendURL from '../config';

function Juego() {
  const { id } = useParams(); // id de partida
  const { state } = useLocation(); // contiene { tableroId }
  const [tablero, setTablero] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchTablero = async () => {
      try {
        const res = await fetch(`${backendURL}/tableros/${state?.tableroId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setTablero(data);
      } catch (err) {
        setMensaje(`❌ ${err.message}`);
      }
    };

    fetchTablero();
  }, [state]);

  return (
    <div className="juego-container">
      <Navbar />
      <main className="juego-main">
        <h2>Tablero de la partida {id}</h2>
        {mensaje && <p>{mensaje}</p>}
        {tablero ? (
          <div>
            <p><strong>ID Tablero:</strong> {tablero.id}</p>
            <p><strong>Terrenos:</strong> {tablero.Terrenos.length}</p>
            {/* Aquí después renderizarás el hexágono, vértices, etc. */}
          </div>
        ) : (
          <p>Cargando tablero...</p>
        )}
      </main>
    </div>
  );
}

export default Juego;