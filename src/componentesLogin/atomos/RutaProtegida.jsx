import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { API_URL } from '../../config.js';
export default function RutaProtegida({ children, adminOnly = false }) {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();
  useEffect(() => {
    fetch(`${API_URL}api/checkOut`, {
      credentials: "include"
    })
      .then(res => {
        // Si el token expiro o no existe
        if (res.status === 401) {
          setAuth(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setAuth(data.auth);
          setUser(data.user);
        }
      })
      .catch(() => setAuth(false));
  }, [location.pathname]);

  if (auth === null) {
    return <p>Cargando...</p>;
  }

  if (!auth) return <Navigate to="/login" replace />;

  if (adminOnly && user?.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
