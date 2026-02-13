import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./panel.css";

export default function GestionarUsuarios() {

    const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
const [nuevoUsuario, setNuevoUsuario] = useState({
  nombre: "",
  email: "",
  password: "",
  tipo: "cliente"
});
const crearUsuario = async (e) => {
  e.preventDefault();

  await fetch("http://localhost:4000/api/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoUsuario)
  });

  setNuevoUsuario({
    nombre: "",
    email: "",
    password: "",
    tipo: "cliente"
  });

  obtenerUsuarios();
};

  const obtenerUsuarios = async () => {
    const res = await fetch("http://localhost:4000/api/usuarios");
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const cambiarTipo = async (id, nuevoTipo) => {
    await fetch(`http://localhost:4000/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: nuevoTipo })
    });

    obtenerUsuarios();
  };

  const toggleUsuario = async (id) => {
    await fetch(`http://localhost:4000/api/usuarios/${id}/toggle`, {
      method: "PUT"
    });

    obtenerUsuarios();
  };

  return (
    <div className="panel-container">
      <h1>Gestión de Usuarios</h1>
        <h2>Crear Nuevo Usuario</h2>

<form className="form-crear" onSubmit={crearUsuario}>

  <input
    type="text"
    placeholder="Nombre"
    value={nuevoUsuario.nombre}
    onChange={(e) =>
      setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
    }
    required
  />

  <input
    type="email"
    placeholder="Email"
    value={nuevoUsuario.email}
    onChange={(e) =>
      setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
    }
    required
  />

  <input
    type="password"
    placeholder="Contraseña"
    value={nuevoUsuario.password}
    onChange={(e) =>
      setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
    }
    required
  />

  <select
    value={nuevoUsuario.tipo}
    onChange={(e) =>
      setNuevoUsuario({ ...nuevoUsuario, tipo: e.target.value })
    }
  >
    <option value="cliente">Cliente</option>
    <option value="empleado">Empleado</option>
    <option value="admin">Admin</option>
  </select>

  <button type="submit">Crear</button>

</form>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <tr key={user.id_usuario}>
              <td>{user.id_usuario}</td>
              <td>{user.nombre}</td>
              <td>{user.email}</td>

              <td>
                <select
                  value={user.tipo}
                  onChange={(e) =>
                    cambiarTipo(user.id_usuario, e.target.value)
                  }
                >
                  <option value="cliente">Cliente</option>
                  <option value="empleado">Empleado</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td>{user.activo ? "Sí" : "No"}</td>

              <td>
                <button
                  style={{
                    backgroundColor: user.activo ? "#e74c3c" : "#2ecc71",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer"
                  }}
                  onClick={() => toggleUsuario(user.id_usuario)}
                >
                  {user.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
                   
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


