import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida';
//import Registro from './pages/Registro';
//import Login from './pages/Login';
//import Partidas from './pages/Partidas';
//import Juego from './pages/Juego';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        {/* <Route path="/registro" element={<Registro />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/partidas" element={<Partidas />} /> */}
        {/* <Route path="/juego/:id" element={<Juego />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
