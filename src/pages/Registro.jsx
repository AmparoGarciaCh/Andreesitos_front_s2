import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Registro.css';
import fondoRegistro from '/fondo2.png';
import carta1 from '/zorron_comercial.png';
import carta2 from '/ñoño_ingenieria.png';
import carta3 from '/abogado5.png';
import carta4 from '/medico2.png';
import carta5 from '/agronomo1.png';
import backendURL from '../config'; // ✅ AÑADIDO

function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmacion) {
      setMensaje('❌ Las contraseñas no coinciden');
      return;
    }

    const respuesta = await fetch(`${backendURL}/usuarios/registrar`, { // ✅ CORREGIDO
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, password }),
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
      setMensaje('✅ Usuario registrado con éxito');
    } else {
      setMensaje(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div className="registro-container" style={{ backgroundImage: `url(${fondoRegistro})` }}>
      <Navbar />
      <main className="registro-main">
        <div className="cartas-grid">
          <img src={carta1} alt="carta1" className="carta carta1" />
          <img src={carta2} alt="carta2" className="carta carta2" />
          <img src={carta3} alt="carta3" className="carta carta3" />
          <img src={carta4} alt="carta4" className="carta carta4" />
          <img src={carta5} alt="carta5" className="carta carta5" />
        </div>

        <form className="formulario-registro" onSubmit={handleSubmit}>
          <h1 className="titulo-registro">REGISTRARSE</h1>
          <label>¿CUÁL ES TU CORREO ELECTRÓNICO?</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          
          <label>CREA UNA CONTRASEÑA</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label>CONFIRMA LA CONTRASEÑA</label>
          <input type="password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} required />
          
          <label>NOMBRE</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <button type="submit">REGISTRARSE</button>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </main>
    </div>
  );
}

export default Registro;