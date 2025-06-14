import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Bienvenida.css'; // Reutilizamos los estilos ya definidos

function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const respuesta = await fetch('http://localhost:3000/usuarios/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    <div className="bienvenida-container">
      <Navbar />

      <main className="bienvenida-main">
        <section className="descripcion">
          <h2>Registro de Usuario</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            /><br />
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
            <button type="submit" className="jugar-btn">Registrarse</button>
          </form>
          {mensaje && <p>{mensaje}</p>}
        </section>
      </main>
    </div>
  );
}

export default Registro;