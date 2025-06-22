const Vertex = ({ x, y, selected, onClick, construccion, coloresJugadores }) => {
  let color = 'white';

  if (construccion) {
    const idJ = construccion.jugadorId ?? construccion.idJugador;
    color = coloresJugadores?.[idJ] || 'gray';
    console.log(`🟢 Vértice ${construccion.tipo} del jugador ${idJ}`);
    console.log(`🎨 Color asignado: ${color}`);
  }

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${x - 10}px`,
        top: `${y - 10}px`,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: color,
        border: selected ? '3px solid black' : '2px solid black',
        zIndex: 1000,
        cursor: 'pointer',
        pointerEvents: 'auto'
      }}
    />
  );
};

export default Vertex;
