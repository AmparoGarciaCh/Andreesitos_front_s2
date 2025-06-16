const Edge = ({ x1, y1, x2, y2, selected, onClick, construccion, coloresJugadores }) => {
  let strokeColor = 'lightgray';

  if (construccion) {
    const jugadorId = construccion.jugadorId;
    strokeColor = coloresJugadores?.[jugadorId] || 'gray';
  } else if (selected) {
    strokeColor = 'orange';
  }

  const strokeWidth = construccion ? 10 : selected ? 6 : 3;

  return (
    <line
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
      style={{
        position: 'absolute',
        pointerEvents: 'visiblePainted',
        cursor: 'pointer',
      }}
    />
  );
};

export default Edge;
