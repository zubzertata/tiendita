import Link from 'next/link'
import { useState, useEffect } from "react";
import { Navbar, Nav, Button } from 'react-bootstrap';  
function Navegation() {
  const [sessionData, setSessionData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session) {
      setSessionData(session);
    }
  }, []);

  return (
    <Navbar bg="body-tertiary" expand="lg">
    <div className="container-fluid">
      <Navbar.Brand href="/">FURRYFOODS</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarSupportedContent" onClick={() => setIsOpen(!isOpen)} />
      <Navbar.Collapse id="navbarSupportedContent" className={isOpen ? 'show' : ''}>
        <Nav className="ms-auto">
          <Nav.Item className="mx-auto">
            <Nav.Link href="/">Inicio</Nav.Link>
          </Nav.Item>
          <Nav.Item className="mx-auto">
            <Nav.Link href="/categorias">Categorías</Nav.Link>
          </Nav.Item>
          {sessionData ? (
            <Nav.Item className="mx-auto">
              <Nav.Link href="/cuenta">Cuenta</Nav.Link>
            </Nav.Item>
          ) : (
            <>
              <Nav.Item className="mx-auto">
                <Nav.Link href="/cuenta/login">Iniciar sesión</Nav.Link>
              </Nav.Item>
              <Nav.Item className="mx-auto">
                <Nav.Link href="/cuenta/registro">Registrarse</Nav.Link>
              </Nav.Item>
            </>
          )}
          {isOpen ? (
            <Nav.Item className="mx-auto align-items-center justify-content-center ">
              <Nav.Link href="/carrito">Carrito</Nav.Link>
            </Nav.Item>
          ) : (
            <Nav.Item >
              <Nav.Link href="/carrito">
                <Button className="shadow-sm d-flex align-items-center justify-content-center" style={{ width: '3rem', height: '1.5rem', padding: '0.5rem' }}>
                  <img
                    src="https://jvawjhgzotsabzvwyvro.supabase.co/storage/v1/object/public/imagen/shopping-cart.svg?t=2023-04-23T05%3A40%3A10.996Z"
                    alt="shopping cart"
                    className="img-fluid"
                    style={{ width: '1.5rem' }}
                  />
                </Button>
              </Nav.Link>
            </Nav.Item>
          )}
          {sessionData && (
            <Nav.Item className="mx-auto">
              <Button
                variant="danger"
                className="btn btn-danger shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: '5rem', height: '2rem', padding: '0.5rem', backgroundColor: '#ff9aa2', border: 'none'}}
                onClick={() => {
                  localStorage.removeItem('session');
                  setSessionData(null);
                  window.location.href = '/';
                }}
              >
                Cerrar sesión
              </Button>
            </Nav.Item>
          )}
        </Nav>
      </Navbar.Collapse>
    </div>
  </Navbar>

  
  )
}

export default Navegation;
