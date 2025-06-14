// src/pages/Jugar.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Bienvenida.css';

function Jugar() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

  const handleCrearPartida = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/partidas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await respuesta.json();

      if (!respuesta.ok) throw new Error(data.error || 'Error al crear partida');

      // ✅ Redirigir a sala de espera con id y código (corregido)
      navigate(`/sala-espera/${data.partida.id}`, {
        state: {
          codigo: data.partida.codigoAcceso,
          soyAdmin: true // es creador
        }
      });
    } catch (error) {
      setMensaje(`❌ ${error.message}`);
    }
  };

  const handleUnirse = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:3000/partidas/unirse', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigoAcceso: codigo })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) throw new Error(data.error || 'Error al unirse');

      // ✅ Redirigir a sala de espera con el id recibido
      navigate(`/sala-espera/${data.partidaId}`, {
        state: {
          codigo: codigo,
          soyAdmin: false // es invitado
        }
      });
    } catch (error) {
      setMensaje(`❌ ${error.message}`);
    }
  };

  return (
    <div className="bienvenida-container">
      <Navbar />
      <main className="bienvenida-main">
        <section className="descripcion">
          <h2>¡Hola {usuario?.nombre || 'jugador'}!</h2>
          <p>¿Quieres crear una nueva partida o unirte a una existente?</p>

          <button className="jugar-btn" onClick={handleCrearPartida}>Crear partida</button>

          <hr style={{ margin: '20px 0', width: '60%' }} />

          <form onSubmit={handleUnirse}>
            <input
              type="text"
              placeholder="Código de partida"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              required
            /><br />
            <button type="submit" className="jugar-btn">Unirse a partida</button>
          </form>

          {mensaje && <p style={{ marginTop: '15px' }}>{mensaje}</p>}
        </section>
      </main>
    </div>
  );
}

export default Jugar;
