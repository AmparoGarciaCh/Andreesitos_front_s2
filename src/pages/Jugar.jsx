import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Login.css'; // ✅ reutiliza estilos modernos
import fondoLogin from '../assets/fondo5.png'; // fondo similar al de login

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

      navigate(`/sala-espera/${data.id}`, {
        state: {
          codigo: data.codigoAcceso,
          soyAdmin: true
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

      navigate(`/sala-espera/${data.partidaId}`, {
        state: {
          codigo,
          soyAdmin: false
        }
      });
    } catch (error) {
      setMensaje(`❌ ${error.message}`);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${fondoLogin})` }}>
      <Navbar />
      <main className="login-main">
        <section className="login-card">
          <h2 className="login-title">¡Hola {usuario?.nombre || 'jugador'}!</h2>
          <p style={{ textAlign: 'center' }}>¿Quieres crear una nueva partida o unirte a una existente?</p>

          <button type="button" className="login-form-button" onClick={handleCrearPartida}>
            Crear partida
          </button>

          <hr style={{ margin: '1.5rem auto', width: '70%' }} />

          <form onSubmit={handleUnirse} className="login-form">
            <label>Código de partida</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              required
            />
            <button type="submit">Unirse a partida</button>
          </form>

          {mensaje && <p className="login-message">{mensaje}</p>}
        </section>
      </main>
    </div>
  );
}

export default Jugar;
