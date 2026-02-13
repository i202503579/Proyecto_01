import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./panel.css";

export default function ReporteVentas() {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/reporte-ventas")
      .then(res => res.json())
      .then(data => {
        setResumen(data.resumen);
        setPedidos(data.pedidos);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="panel-container">
      <h1>Reporte de Ventas - Hoy</h1>

      {resumen && (
        <div className="resumen-cards">
          <div className="card resumen">
            <h3>Total Generado</h3>
            <p>S/ {resumen.total_hoy}</p>
          </div>

          <div className="card resumen">
            <h3>Pedidos Entregados</h3>
            <p>{resumen.pedidos_hoy}</p>
          </div>
        </div>
      )}

      <h2>Pedidos del Día</h2>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id_pedido}>
              <td>{p.id_pedido}</td>
              <td>{p.cliente}</td>
              <td>S/ {p.total}</td>
              <td>{p.estado}</td>
              <td>{new Date(p.fecha).toLocaleString()}</td>
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
