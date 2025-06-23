import './Vertex.css';
import { renderColorConstruccion } from '../utils/renderColor';

const Vertex = ({ x, y, selected, onClick, construccion, coloresJugadores }) => {
  let color = 'white';

  if (construccion) {
    const idJ = Number(construccion.jugadorId ?? construccion.idJugador);
    color = renderColorConstruccion(idJ, coloresJugadores);

    console.log(`🟢 Vértice construido: tipo=${construccion.tipo} jugadorId=${idJ}`);
    console.log(`🎨 Color asignado al vértice: ${color}`);
  }

  return (
    <div
      className={`vertex ${selected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: color
      }}
    />
  );
};

export default Vertex;
