import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Victoria.css'; 

const Victoria = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ganador = location.state?.ganador || 'Jugador desconocido';

  const handleVolverInicio = () => {
    navigate('/');
  };

  const handleJugarDeNuevo = () => {
    navigate('/Jugar');
  };

  return (
    <div className="victoria-container">
      <h1>🏆 ¡Fin del Juego!</h1>
      <h2>🎉 ¡El ganador es: <span className="ganador-nombre">{ganador}</span>!</h2>

      <div className="victoria-botones">
        <button onClick={handleVolverInicio}>Volver al Inicio</button>
        <button onClick={handleJugarDeNuevo}>Jugar de Nuevo</button>
      </div>
    </div>
  );
};

export default Victoria;