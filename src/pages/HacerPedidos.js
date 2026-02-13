import React, { useEffect, useState } from "react";
import "./panel.css";

export default function HacerPedido() {

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    fetch("http://localhost:4000/api/productos")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(p => p.id_producto === producto.id_producto);

    if (existe) {
      setCarrito(carrito.map(p =>
        p.id_producto === producto.id_producto
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // 🔹 Quitar producto del carrito completamente
  const quitarDelCarrito = (id_producto) => {
    setCarrito(carrito.filter(p => p.id_producto !== id_producto));
  };

  // 🔹 Disminuir cantidad
  const disminuirCantidad = (id_producto) => {
    setCarrito(carrito.map(p =>
      p.id_producto === id_producto
        ? { ...p, cantidad: Math.max(p.cantidad - 1, 1) }
        : p
    ));
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const confirmarPedido = async () => {

    const productosEnviar = carrito.map(item => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad
    }));

    await fetch("http://localhost:4000/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_usuario: usuario.id_usuario,
        productos: productosEnviar
      })
    });

    alert("Pedido realizado correctamente ✅");
    setCarrito([]);
  };

  return (
    <div className="panel-container">

      <h1>Hacer Pedido</h1>

      <div className="panel-cards">
        {productos.map(prod => (
          <div className="card" key={prod.id_producto}>
            <h3>{prod.nombre}</h3>
            <p>Precio: S/ {prod.precio}</p>
            <button onClick={() => agregarAlCarrito(prod)}>Agregar</button>
          </div>
        ))}
      </div>

      <h2>Carrito</h2>

      <table className="tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th> {/* nueva columna */}
          </tr>
        </thead>
        <tbody>
          {carrito.map(item => (
            <tr key={item.id_producto}>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
              <td>S/ {item.precio * item.cantidad}</td>
              <td>
                <button onClick={() => disminuirCantidad(item.id_producto)}>
                  -
                </button>
                <button onClick={() => agregarAlCarrito(item)}>
                  +
                </button>
                <button onClick={() => quitarDelCarrito(item.id_producto)}>
                  🗑 Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: S/ {total}</h3>

      {carrito.length > 0 && (
        <button className="logout-btn" onClick={confirmarPedido}>
          Confirmar Pedido
        </button>
      )}

    </div>
  );
}
