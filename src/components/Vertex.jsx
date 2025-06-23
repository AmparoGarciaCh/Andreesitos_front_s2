import './Vertex.css';
import { renderColorConstruccion } from '../utils/renderColor';

const Vertex = ({ x, y, selected, onClick, construccion, coloresJugadores }) => {
  let color = 'white'; 

console.log('🔍 Vertex props →', JSON.stringify({
  construccion,
  coloresJugadores
}, null, 2));
  if (construccion) {
    const idJ = Number(construccion.jugadorId ?? construccion.idJugador);
    color = renderColorConstruccion(idJ, coloresJugadores);

    console.log(`🟢 Vértice construido: tipo=${construccion.tipo} jugadorId=${idJ}`);
    console.log(`🎨 Color asignado al vértice: ${color}`);
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`vertex ${selected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: color,
        border: selected ? '3px solid orange' : '2px solid black',
        zIndex: 3,
        cursor: 'pointer'
      }}
    />
  );
};

export default Vertex;

