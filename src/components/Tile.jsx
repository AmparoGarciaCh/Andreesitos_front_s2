import './Tile.css';

function Tile({
  tipo, numero, tieneLadron, onClick, left, top, seleccionado,
}) {
  const imagen = `/bloque_${tipo}.png`;
  const ficha = numero ? `/${numero}_catan.png` : null;
  const ladronImagen = '/ficha ladron de cupos.png';

  return (
    <div
      className={`tile ${seleccionado ? 'seleccionado' : ''}`}
      style={{ left: `${left}px`, top: `${top}px` }}
      onClick={onClick}
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
}

export default Tile;
