import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Bienvenida.css'; // Reutiliza los estilos base

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const respuesta = await fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      setMensaje('✅ Sesión iniciada correctamente');
      setTimeout(() => navigate('/partidas'), 1000);
    } catch (error) {
      setMensaje('❌ ' + error.message);
    }
  };

  return (
    <div className="bienvenida-container">
      <Navbar />

      <main className="bienvenida-main">
        <section className="descripcion">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            /><br />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /><br />
            <button type="submit" className="jugar-btn">Ingresar</button>
          </form>
          {mensaje && <p>{mensaje}</p>}
        </section>
      </main>
    </div>
  );
}

export default Login;