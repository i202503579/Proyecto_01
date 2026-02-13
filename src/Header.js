import { Link } from 'react-router-dom';
export default function Header() {
  
  return (
    <header className="p-4 bg-cafe-brown text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">Herrero Coffe Bakery</h1>
      <nav>
        <ul className="flex gap-4">
          <li><Link to="/">Menu</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/Registro">Registrarme</Link></li>
          <li><Link to="/hacer-pedido">Hacer pedido</Link></li>
        </ul>
      </nav>
    </header>
  );
}
