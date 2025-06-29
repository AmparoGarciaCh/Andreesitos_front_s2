import { useState } from 'react';
import './ModalDescartarCartas.css';

function ModalDescartarCartas({
  visible, onClose, inventario, cantidadADescartar, onDescartar,
}) {
  const [seleccionadas, setSeleccionadas] = useState({});

  const totalSeleccionadas = Object.values(seleccionadas)
    .map((v) => Number(v))
    .reduce((sum, value) => sum + value, 0);

  const handleDescarte = (tipo, cantidad) => {
    setSeleccionadas((prev) => ({
      ...prev,
      [tipo]: Math.max(
        0,
        Math.min(
          cantidad,
          inventario.find((c) => c.tipoEspecialista === tipo)?.cantidad || 0,
        ),
      ),
    }));
  };

  const handleConfirmar = () => {
    if (totalSeleccionadas === cantidadADescartar) {
      onDescartar(seleccionadas);
      onClose();
    } else {
      alert(`Debes seleccionar exactamente ${cantidadADescartar} cartas para descartar.`);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <h2>
          Debes descartar
          {cantidadADescartar}
          {' '}
          cartas
        </h2>
        <p>
          Total seleccionadas:
          {totalSeleccionadas}
        </p>
        {inventario.map((carta) => (
          <div key={carta.tipoEspecialista}>
            <span>
              {carta.tipoEspecialista}
              {' '}
              (
              {carta.cantidad}
              ):
            </span>
            <input
              type="number"
              min={0}
              max={carta.cantidad}
              value={seleccionadas[carta.tipoEspecialista] || []}
              onChange={(e) => handleDescarte(carta.tipoEspecialista, parseInt(e.target.value, 10))}
            />
          </div>
        ))}
        <button onClick={handleConfirmar}>Confirmar descarte</button>
      </div>
    </div>
  );
}

export default ModalDescartarCartas;
