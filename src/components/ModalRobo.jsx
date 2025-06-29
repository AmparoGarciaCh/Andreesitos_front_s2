import React, { useState } from 'react';
import './ModalRobo.css';

const ModalRobarCarta = ({ visible, jugadores, onClose, onRobar}) => {
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

  if (!visible) return null;

    return (
    <div className="modal-fondo">
        <div className="modal-contenido">
        <h3>Robar carta</h3>

        {!jugadores || jugadores.length === 0 ? (
            <p>No hay jugadores adyacentes con cartas.</p>
        ) : (
            <ul className="jugador-lista">
            {jugadores.map((j) => (
                <li key={j.id} className="jugador-item">
                <label>
                    <input
                    type="radio"
                    name="jugador"
                    value={j.id}
                    onChange={() => setJugadorSeleccionado(j.id)}
                    />
                    {j.color} ({j.cantidadCartas} cartas)
                </label>
                </li>
            ))}
            </ul>
        )}

        <div className="botones-robo">
            <button
            className="boton-confirmar"
            onClick={() => onRobar(jugadorSeleccionado)}
            disabled={!jugadorSeleccionado}
            >
            Confirmar robo
            </button>
            <button className="boton-cancelar" onClick={onClose}>
            Cancelar
            </button>
        </div>
        </div>
    </div>
    );

};

export default ModalRobarCarta;
