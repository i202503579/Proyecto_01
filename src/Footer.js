
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 p-6 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sección de la cafetería */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Herrero Coffe Bakery</h3>
          <p>RUC: 20612918229</p>
          <p>Dirección: Av. Independencia 249 Santa clara - Lima</p>
          <p>Teléfono: +51 981 115 430</p>
        </div>

        {/* Sección de navegación */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Enlaces rápidos</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-white">Menú</Link></li>
            <li><Link to="/nosotros" className="hover:text-white">Nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-white">Contacto</Link></li>
            <li><Link to="/Registro" className="hover:text-white">Registrarme</Link></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Síguenos</h3>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/profile.php?id=61571059784243" target='_blank' className="hover:text-white">Facebook</a>
            <a href="https://www.instagram.com/herrerocafebar/" target='_blank' className="hover:text-white">Instagram</a>
            <a href="https://www.tiktok.com/@herrerocoffe" target='_blank' className="hover:text-white">TikTok</a>
          </div>
        </div>
      </div>

      {/* Créditos */}
      <div className="text-center text-sm text-gray-500 mt-6 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Herrero Coffe Bakery - Todos los derechos reservados
      </div>
    </footer>
  );
}
