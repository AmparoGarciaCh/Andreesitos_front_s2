// Edge.jsx

const Edge = ({ x1, y1, x2, y2, selected, onClick, construccion, coloresJugadores }) => {
  let strokeColor = 'lightgray';
  let strokeWidth = 3;

  if (construccion?.tipo === 'muro') {
    const colorJugador = coloresJugadores?.[construccion.jugadorId];
    if (colorJugador) {
      strokeColor = colorJugador;
      strokeWidth = 8;
      console.log(`✅ Pintando arista construida del jugador ${construccion.jugadorId} con color ${strokeColor}`);
    } else {
      console.warn(`⚠️ No se encontró color para jugadorId: ${construccion.jugadorId}`);
    }
  } else if (selected) {
    strokeColor = 'orange';
    strokeWidth = 6;
    console.log('🎯 Arista seleccionada');
  } else {
    console.log('🔘 Arista neutra');
  }

  return (
    <line
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
      style={{
        pointerEvents: 'stroke',
        cursor: 'pointer',
        visibility: 'visible'
      }}
    />
  );
};

export default Edge;

