// src/pages/Game.jsx
import { useParams, useLocation } from 'react-router-dom';
import GameBoard from '../components/GameBoard';

const Game = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const tableroId = state?.tableroId ?? id;

  return (
    <div>
      <h1>Vista del Juego - Andreesitos 🚀</h1>
      {tableroId ? (
        <GameBoard tableroId={parseInt(tableroId)} />
      ) : (
        <p>No se recibió tableroId.</p>
      )}
    </div>
  );
};

export default Game;
