// React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import Submenu from "./Submenu";
import Promociones from "./pages/promociones"
import Novedades from "./pages/novedades"
import Contacto from './contacto/contacto';
import Nosotros from './Nosotros';
import Registro from "./pages/Registro";
import Login from "./pages/login";
import PanelAdmin from './pages/PanelAdmin';
import PanelEmpleado from './pages/PanelEmpleado';
import GestionarUsuarios from "./pages/GestionarUsuarios";
import ReportesVentas from "./pages/ReportesVentas"
import VerConsultas from './pages/VerConsultas';
import VerPedidos from './pages/VerPedidos';
import HacerPedido from './pages/HacerPedidos';
function App() {
  return (
    <div className="App">
      <Router>
      <Header />
      <Submenu />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/nosotros" element={<Nosotros />} /> 
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel-admin" element={<PanelAdmin />} />
        <Route path="/panel-empleado" element={<PanelEmpleado />} />
        <Route path="/gestionar-usuarios" element={<GestionarUsuarios />} />
        <Route path="/reporte-ventas" element={<ReportesVentas />} />
        <Route path="/ver-consultas" element={<VerConsultas />} />
        <Route path="/ver-pedidos" element={<VerPedidos />} />
        <Route path="/hacer-pedido" element={<HacerPedido />} />

      </Routes>

      <Footer />
    </Router>
    </div>
  );
}

export default App;

