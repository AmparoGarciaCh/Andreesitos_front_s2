import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './PrivateRoute.css';

const PrivateRoute = ({ children }) => {
  const { usuario } = useContext(AuthContext);
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!usuario) {
      setShowMessage(true);
      console.log("⏳ Mostrando mensaje antes de redirigir...");
      const timeout = setTimeout(() => {
        setRedirect(true);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [usuario]);

  if (!usuario) {
    if (redirect) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
      <div className="private-route-container">
        {showMessage && (
          <p className="private-route-message">
            ⚠️ Debes iniciar sesión para acceder a esta función
          </p>
        )}
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
