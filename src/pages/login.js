import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../contacto/contacto.css";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Bienvenido " + data.nombre);

      localStorage.setItem("usuario", JSON.stringify(data));
      
      if (data.tipo === "admin") {
        navigate("/panel-admin");
      } else if (data.tipo === "empleado") {
        navigate("/panel-empleado");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="contacto-container">
      <h2 className="contacto-titulo">Iniciar Sesión</h2>

      <form className="contacto-form" onSubmit={handleSubmit}>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="contacto-btn">
          Ingresar
        </button>

      </form>
    </div>
  );
}
