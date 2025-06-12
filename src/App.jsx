import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Jugar from './pages/Jugar';
import SalaEspera from './pages/SalaEspera';
import Juego from './pages/Juego';
import Game from './pages/Game'; // <--- importas tu Game.jsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jugar" element={<Jugar />} />
        <Route path="/sala-espera/:id" element={<SalaEspera />} />
        <Route path="/juego/:id" element={<Game />} /> {/* usar Game para pruebas */}
        <Route path="/game" element={<Game />} /> {/* ruta manual para pruebas */}
      </Routes>
    </Router>
  );
}

export default App;
