import './Tile.css';

const Tile = ({ tipo, numero, tieneLadron, left, top }) => {
  const imagen = `/bloque_${tipo}.png`;
  const ficha = numero ? `/${numero}_catan.png` : null;
  const ladronImagen = `/ladron.png`;

  return (
    <div
      className="tile"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <img
        src={imagen}
        alt={tipo}
        className="tile-img"
      />
      {numero && (
        <img
          src={ficha}
          alt={`Ficha ${numero}`}
          className="tile-ficha"
        />
      )}
      {tieneLadron && (
        <img
          src={ladronImagen}
          alt="Ladrón"
          className="tile-ladron"
        />
      )}
    </div>
  );
};

export default Tile;
