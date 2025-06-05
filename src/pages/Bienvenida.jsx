import React, { useContext, useState } from 'react'; // 👈 agrega useState
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Bienvenida.css';
import logo from '../assets/logo.png';
import tablero from '../assets/tablero.png';
import Navbar from '../components/Navbar';

function Bienvenida() {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState('');

  const handleClick = () => {
    if (usuario) {
      navigate('/jugar');
    } else {
      setMensaje('⚠️ Debes iniciar sesión o registrarte para jugar');
    }
  };

  return (
    <div className="bienvenida-container">
      <Navbar />
      <main className="bienvenida-main">
        <section className="descripcion">
          <h1>WEBTAN</h1>
          <p><strong>Colonizar, pitutear y construir</strong> son las claves del éxito en la UC...</p>
          
          <button className="jugar-btn" onClick={handleClick}>Ir a jugar</button>
          {mensaje && <p className="mensaje-alerta">{mensaje}</p>}
        </section>
        <section className="imagen-tablero">
          <img src={tablero} alt="Tablero Webtan" />
        </section>
      </main>
    </div>
  );
}

export default Bienvenida;