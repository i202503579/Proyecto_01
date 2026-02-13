import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./panel.css";

export default function PanelAdmin() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));

    if (!user || user.tipo !== "admin") {
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
        <h1>Panel Administrador</h1>
        {usuario && <span>Bienvenido, {usuario.nombre}</span>}
      </div>

      <div className="panel-cards">

        <div className="card" onClick={() => navigate("/gestionar-usuarios")}>
          <h3>Gestionar Usuarios</h3>
          <p>Crear, editar y desactivar usuarios</p>
        </div>

        <div className="card" onClick={() => navigate("/reporte-ventas")}>
          <h3>Reporte de Ventas</h3>
          <p>Ver total generado hoy</p>
        </div>

        <div className="card" onClick={() => navigate("/ver-consultas")}>
          <h3>Consultas</h3>
          <p>Ver mensajes de clientes</p>
        </div>

      </div>

      <button className="logout-btn" onClick={cerrarSesion}>
        Cerrar Sesión
      </button>
    </div>
  );
}
