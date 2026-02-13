import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./panel.css";

export default function PanelEmpleado() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));

    if (!user || user.tipo !== "empleado") {
      navigate("/login");
    } else {
      setUsuario(user);
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h1>Panel Empleado</h1>
        {usuario && <span>Bienvenido, {usuario.nombre}</span>}
      </div>

      <div className="panel-cards">

        <div className="card" onClick={() => navigate("/ver-pedidos")}>
          <h3>Ver Pedidos</h3>
          <p>Revisar y cambiar estado</p>
        </div>

      </div>

      <button className="logout-btn" onClick={cerrarSesion}>
        Cerrar Sesión
      </button>
    </div>
  );
}
