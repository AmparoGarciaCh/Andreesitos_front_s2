import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bienvenida from '../pages/Bienvenida';
import Registro from '../pages/Registro';
import Login from '../pages/Login';
import Jugar from '../pages/Jugar';
import SalaEspera from '../pages/SalaEspera';
import Instrucciones from '../pages/Instrucciones';
import Nosotros from '../pages/Nosotros';
import PrivateRoute from '../components/PrivateRoute';
import Game from '../pages/Game';
import Victoria from '../pages/Victoria'; 

const AppRouter= () => {
  return (
    <Routes>

      <Route path="/" element={<Bienvenida />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/Instrucciones" element={<Instrucciones />} />
      <Route path="/Nosotros" element={<Nosotros />} />
      <Route path="/Jugar" element={<Jugar />} />

      <Route path="/victoria" element={
        <PrivateRoute><Victoria /></PrivateRoute>
      } />

      <Route path="/sala-espera/:id" element={
        <PrivateRoute><SalaEspera /></PrivateRoute>
      } />
      <Route path="/juego/:id" element={
        <PrivateRoute><Game /></PrivateRoute>
      } />

    </Routes>
  );
}

export default AppRouter;