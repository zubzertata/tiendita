import { useState,useEffect  } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const Pagina1 = dynamic(() => import("./cuenta/productos"));
const Pagina2 = dynamic(() => import("./cuenta/crearProducto"));
const Pagina3 = dynamic(() => import("./cuenta/datosUsuarios"));
const Pagina4 = dynamic(() => import("./cuenta/compras"));
const Pagina5 = dynamic(() => import("./cuenta/datos"));
const Pagina6 = dynamic(() => import("./cuenta/ventas"));

function Page() {
    
    const [paginaActual, setPaginaActual] = useState("home");
  
    const mostrarHomeHandler = () => {
        setPaginaActual("home");
    };

    const mostrarProductosHandler = () => {
        setPaginaActual("productos");
    };

    const mostrarUsuariosHandler = () => {
        setPaginaActual("usuarios");
    };

    const mostrarVentasHandler = () => {
        setPaginaActual("ventas");
    };
    const mostrarDatosHandler = () => {
        setPaginaActual("datos");
    };
    const mostrarComprasHandler = () => {
        setPaginaActual("compras");
    };

    const [role, setRole] = useState(null);

    useEffect(() => {
      const session = JSON.parse(localStorage.getItem("session"));
      if (session) {
        setRole(session.role);
      }
    }, []);
    
    return (
        <div>
        <div className="container-fluid">
          <div className="row flex-nowrap">
            <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 col-12">
              <div className="d-flex flex-column align-items-center px-3 pt-2 text-white container-fluid">
                <Link href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none">
                  <span className="fs-5 d-none d-sm-inline">Menu</span>
                </Link>
      
                <ul className="nav nav-pills flex-column col-12 mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                  {role === 1 && (
                    <>
                      <li className="nav-item">
                        <Link href="#" className="nav-link align-middle px-0" onClick={mostrarHomeHandler}>
                          <i className="fs-4 bi-house"></i> <span className="ms-1 d-sm-inline">Dashboard</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link href="#" className="nav-link align-middle px-0" onClick={mostrarProductosHandler}>
                          <i className="fs-4 bi-house"></i> <span className="ms-1 d-sm-inline">Producto</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link href="#" className="nav-link align-middle px-0" onClick={mostrarUsuariosHandler}>
                          <i className="fs-4 bi-house"></i> <span className="ms-1 d-sm-inline">Usuario</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link href="#" className="nav-link align-middle px-0" onClick={mostrarVentasHandler}>
                          <i className="fs-4 bi-house"></i> <span className="ms-1 d-sm-inline">Ventas</span>
                        </Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <Link href="#" className="nav-link align-middle px-0" onClick={mostrarDatosHandler}>
                      <i className="fs-4 bi-house"></i> <span className="ms-1 d-sm-inline">Datos Personales</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="#" className="nav-link align-middle px-0" onClick={mostrarComprasHandler}>
                      <i className="fs-4 bi-house"></i> <span className="ms-1 d-sm-inline">Compras</span>
                    </Link>
                  </li>
                </ul>
      
                <hr />
              </div>
            </div>
            <div className="d-none d-md-block container">
              <div className="row">
                <div className="col-md-6 col-lg-9 order-md-last">
                  <div className="card">
                    {paginaActual === "home" && <div></div>}
                    {paginaActual === "productos" && <Pagina1 />}
                    {paginaActual === "crearProducto" && <Pagina2 />}
                    {paginaActual === "usuarios" && <Pagina3 />}
                    {paginaActual === "compras" && <Pagina4 />}
                    {paginaActual === "datos" && <Pagina5 />}
                    {paginaActual === "ventas" && <Pagina6 />}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-md-none col-12">
            <div className="d-md-none container">
                <div className="row">
                    <div className="col">
                        <div className="card">
                        {paginaActual === "home" && <div></div>}
                        {paginaActual === "productos" && <Pagina1 />}
                        {paginaActual === "crearProducto" && <Pagina2 />}
                        {paginaActual === "usuarios" && <Pagina3 />}
                        {paginaActual === "compras" && <Pagina4 />}
                        {paginaActual === "datos" && <Pagina5 />}
                        {paginaActual === "ventas" && <Pagina6 />}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
      </div>
      
    )
}

export default Page