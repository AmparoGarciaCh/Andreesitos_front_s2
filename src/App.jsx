import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Jugar from './pages/Jugar';
import SalaEspera from './pages/SalaEspera';
import Juego from './pages/Juego';
import Instrucciones from './pages/Instrucciones';
import Nosotros from './pages/Nosotros';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/registro" element={<Registro />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/jugar" element={<Jugar />} />
        <Route path="/sala-espera/:id" element={<SalaEspera />} />
        <Route path="/juego/:id" element={<Juego />} />
        <Route path="/instrucciones" element={<Instrucciones />} />
        <Route path="/nosotros" element={<Nosotros />} />
      </Routes>
    </Router>
  );
}

export default App;
