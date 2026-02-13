import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./panel.css";

export default function VerConsultas() {

  const [consultas, setConsultas] = useState([]);
    const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:4000/api/consultas")
      .then(res => res.json())
      .then(data => setConsultas(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="panel-container">
      <h1>Consultas de Clientes</h1>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Mensaje</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map(c => (
            <tr key={c.id_consulta}>
              <td>{c.id_consulta}</td>
              <td>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.descripcion}</td>
              <td>{new Date(c.fecha).toLocaleString()}</td>
            </tr>
          ))}
          <button onClick={() => navigate("/panel-admin")}>
                     ⬅ Volver al Panel
                     </button>
        </tbody>
      </table>
    </div>
  );
}
