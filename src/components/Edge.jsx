import './Edge.css';
import { renderColorConstruccion } from '../utils/renderColor';

function Edge({
  x1, y1, x2, y2, selected, onClick, construccion, coloresJugadores,
}) {
  let strokeColor = 'lightgray';
  let strokeWidth = 3;

  if (construccion?.tipo === 'muro') {
    const jugadorId = Number(construccion.jugadorId);
    strokeColor = renderColorConstruccion(jugadorId, coloresJugadores);
    strokeWidth = 8;
  } else if (selected) {
    strokeColor = 'orange';
    strokeWidth = 6;
  }

  return (
    <line
      className={`edge ${selected ? 'selected' : ''}`}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
}

export default Edge;
