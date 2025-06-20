const Tile = ({ tipo, numero, tieneLadron, left, top }) => {
  const imagen = `/bloque_${tipo}.png`;
  const ficha = numero ? `/${numero}_catan.png` : null;
  const ladronImagen = `/ladron.png`;

  return (
    <div
      className="tile"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(${left}px, ${top}px) translate(-50%, -50%)`,
        width: '120px',
        height: '104px',
        pointerEvents: 'none' // para que no bloquee clicks en vértices
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
            width: '30px',
            height: '30px',
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
            top: '10px',
            left: '10px',
            width: '30px',
            height: '30px'
          }}
        />
      )}
    </div>
  );
};

export default Tile;
