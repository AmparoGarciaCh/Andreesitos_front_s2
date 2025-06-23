import './Edge.css';
import { renderColorConstruccion } from '../utils/renderColor';

const Edge = ({ x1, y1, x2, y2, selected, onClick, construccion, coloresJugadores }) => {
  let strokeColor = 'lightgray';
  let strokeWidth = 3;

  // DEBUG: log de entrada
  console.log('🎯 EDGE PROPS →', {
    construccion,
    coloresJugadores
  });

  if (construccion?.tipo === 'muro') {
    const jugadorId = Number(construccion.jugadorId); // aseguramos tipo número
    const color = renderColorConstruccion(jugadorId, coloresJugadores);
    strokeColor = color;
    strokeWidth = 8;
    console.log(`✅ Pintando arista construida del jugador ${jugadorId} con color ${strokeColor}`);
  } else if (selected) {
    strokeColor = 'orange';
    strokeWidth = 6;
  }

  return (
    <line
      className="edge"
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
};

export default Edge;
