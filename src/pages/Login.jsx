import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Login.css';
import fondoLogin from '/fondo5.png';
import backendURL from '../config';

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const respuesta = await fetch(`${backendURL}/usuarios/login`, { // ✅ corregido
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) throw new Error(data.error || 'Error al iniciar sesión');

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      login(data.usuario);

      setMensaje('✅ Sesión iniciada correctamente');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      setMensaje('❌ ' + error.message);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${fondoLogin})` }}>
      <Navbar />
      <main className="login-main">
        <section className="login-card">
          <h1 className="login-title">Iniciar Sesión</h1>
          <form onSubmit={handleLogin} className="login-form">
            <label>CORREO ELECTRÓNICO</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <label>CONTRASEÑA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">INICIAR SESIÓN</button>
            {mensaje && <p className="login-message">{mensaje}</p>}
          </form>

          <a className="login-link" href="#">HE OLVIDADO MI CONTRASEÑA</a>

          <div className="login-buttons">
            <button className="secondary" onClick={() => navigate('/registro')}>
              REGISTRARSE
            </button>
            <button className="danger" onClick={() => navigate('/')}>
              SALIR
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;