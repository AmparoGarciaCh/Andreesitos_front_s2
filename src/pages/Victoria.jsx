import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Victoria.css';

function Victoria() {
  const { partidaId } = useParams();
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      if (!partidaId) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_backendURL}/partidas/${partidaId}`);
        if (response.data.ranking) {
          setRanking(response.data.ranking);
        }
      } catch (err) {
        navigate('/');
      }
    };

    fetchRanking();
  }, [partidaId, navigate]);

  const handleVolverInicio = () => {
    navigate('/');
  };

  return (
    <div className="victoria-mockup-container">
      <img src="/serpentina.png" alt="Serpentina izquierda" className="serpentina serpentina-izquierda" />
      <img src="/serpentina.png" alt="Serpentina derecha" className="serpentina serpentina-derecha" />

      <div className="victoria-panel">
        <div className="podio">
          {ranking.slice(0, 3).map((jug, idx) => (
            <div key={idx} className={`puesto puesto-${idx + 1}`}>
              <div className="jugador-wrapper">
                {idx === 0 && <img src="/corona.png" alt="Corona" className="corona" />}
                <div className={`jugador-icon bg-${jug.color} ${idx === 0 ? 'ganador' : ''}`} />
              </div>
              <div className="numero-puesto">{idx + 1}</div>
            </div>
          ))}
        </div>

        <h2>🎉 FELICIDADES!</h2>

        <div className="ranking">
          {ranking.map((jug, idx) => (
            <div className="fila-ranking" key={idx}>
              <div className="posicion">{idx + 1}</div>
              <div className={`nombre text-${jug.color}`}>{jug.nombre}</div>
              <div className="pe">
                {jug.puntosEmpresa}
                {' '}
                PE
              </div>
            </div>
          ))}
        </div>

        <button className="boton-salir" onClick={handleVolverInicio}>Salir</button>
      </div>
    </div>
  );
}

export default Victoria;
