import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config.js';

export default function YaLogeado({ children }) {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}api/checkOut`, {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          setAuth(false); // No logeado
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setAuth(data.auth);
      })
      .catch(() => setAuth(false));
  }, []);

  // Mientras chequea la cookie
  if (auth === null) {
    return <p>Cargando...</p>;
  }

  // Si está logeado redirigir al home
  if (auth === true) {
    navigate("/");
    return null;
  }

  // Si NO está logeado, mostrar los componentes de login/register
  return children;
}
