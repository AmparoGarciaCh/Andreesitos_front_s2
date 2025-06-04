// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bienvenida from './pages/Bienvenida';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
      </Routes>
    </Router>
  );
}

export default App;
