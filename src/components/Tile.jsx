const Tile = ({ tipo, numero, tieneLadron, left, top }) => {
  const imagen = `/src/assets/bloque_${tipo}.png`;
  const ficha = numero ? `/src/assets/${numero}_catan.png` : null;
  const ladronImagen = `/src/assets/ladron.png`;

  const TILE_WIDTH = 149; // Aumenta el tamaño aquí
  const TILE_HEIGHT = 131; // Y aquí (proporcional al hexágono)

  return (
    <div
      className="tile"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translate(-50%, -50%)',
        width: `${TILE_WIDTH}px`,
        height: `${TILE_HEIGHT}px`,
        pointerEvents: 'none'
      }}
    >
      <img
        src={imagen}
        alt={tipo}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
      {numero && (
        <img
          src={ficha}
          alt={`Ficha ${numero}`}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '48px',
            height: '48px',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
      {tieneLadron && (
        <img
          src={ladronImagen}
          alt="Ladrón"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '32px',
            height: '32px'
          }}
        />
      )}
    </div>
  );
};

export default Tile;
