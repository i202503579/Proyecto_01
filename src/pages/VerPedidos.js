import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./panel.css";

export default function VerPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  // Obtener pedidos desde el backend
  const obtenerPedidos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/pedidos");
      const data = await res.json();
      setPedidos(data);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  // Cambiar estado del pedido
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await fetch(`http://localhost:4000/api/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      obtenerPedidos();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  // Función para mostrar botones según estado
  const renderBotones = (pedido) => {
  const estado = pedido.estado?.trim().toLowerCase();
  if (estado === "pendiente") {
    return (
      <>
        <button
          onClick={() => cambiarEstado(pedido.id_pedido, "entregado")}
        >
          Entregar
        </button>

        <button
          className="cancelar"
          onClick={() => cambiarEstado(pedido.id_pedido, "cancelado")}
        >
          Cancelar
        </button>
      </>
    );
  }
  return null;
};


  return (
    <div className="panel-container">
      <h1>Pedidos</h1>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id_pedido}>
              <td>{p.id_pedido}</td>
              <td>{p.cliente}</td>
              <td>{new Date(p.fecha).toLocaleString()}</td>
              <td>S/ {p.total}</td>
              <td>{p.estado}</td>
              <td>{renderBotones(p)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón para volver al panel */}
      <button
        className="logout-btn"
        onClick={() => navigate("/panel-empleado")}
        style={{ marginTop: "20px" }}
      >
        ⬅ Volver al Panel
      </button>
    </div>
  );
}
