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
        <div className="columna-izquierda">
          <h1 className="titulo-webtan">WEBTAN</h1>
          <section className="descripcion">
            <p><strong>Colonizar, pitutear y construir</strong> son las claves del éxito en la UC. Ubica estratégicamente tus departamentos, facultades y muros de ingeniería para dominar las mejores casillas, negocia con tus compañeros para conseguir a los especialistas que necesitas y utiliza con astucia al ladrón de cupos para bloquear terrenos rivales. Tal como en la vida universitaria, el pensamiento estratégico y la gestión de recursos son esenciales para destacar frente a los demás jugadores.</p>
          </section>
          <div className="barra-sumergete">SUMÉRGETE EN EL MUNDO DE WEBTAN</div>
          <button className="jugar-btn" onClick={handleClick}>Ir a jugar</button>
          {mensaje && <p className="mensaje-alerta">{mensaje}</p>}
        </div>

        <div className="columna-derecha">
          <img src={tablero} alt="Tablero Webtan" className="tablero-img" />
        </div>
      </main>
    </div>
  );
}

export default Bienvenida;