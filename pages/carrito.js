import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function CarritoPage() {
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const router = useRouter();
  const session = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('session')) : null;


  useEffect(() => {
    // Si la página se cargó por primera vez, obtenemos los productos del local storage
    if (router.asPath === '/carrito') {
      const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
      setProductosSeleccionados(carritoActual);
    }
  }, [router.asPath]);

  // Función para eliminar un producto del carrito
  const eliminarProducto = (index) => {
    const nuevosProductosSeleccionados = [...productosSeleccionados];
    nuevosProductosSeleccionados.splice(index, 1);
    setProductosSeleccionados(nuevosProductosSeleccionados);
    localStorage.setItem('carrito', JSON.stringify(nuevosProductosSeleccionados));
  };

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    setProductosSeleccionados([]);
    localStorage.removeItem('carrito');
  };

  // Agrupamos los productos por id_articulo y agregamos la cantidad
  const productosAgrupados = productosSeleccionados.reduce((agrupados, producto) => {
    const index = agrupados.findIndex((p) => p.id_articulo === producto.id_articulo);
    if (index >= 0) {
      agrupados[index].cantidad += 1;
    } else {
      agrupados.push({ ...producto, cantidad: 1 });
    }
    return agrupados;
  }, []);

  // Calculamos el precio total de los productos seleccionados
  const precioTotal = productosSeleccionados.reduce((total, producto) => total + producto.precio_venta, 0);
  const X = () => {
    const router = useRouter();
    const session = JSON.parse(localStorage.getItem('session'));
  
    const handleClick = () => {
      if (session && Object.keys(session).length > 0) {
        router.push('/pago');
      } else {
        router.push('/login');
      }
    };}
  const handleClick = () => {
    if (session && Object.keys(session).length > 0) {
      router.push('/pago');
    } else {
      router.push('/cuenta/login');
    }
  };

  return (<Container>
          <button className='btn' onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} /> Volver Atrás
      </button>
    <h1>Carrito de compras</h1>
    {productosSeleccionados.length > 0 ? (
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosAgrupados.map((producto, index) => (
              <tr key={index}>
                <td>{producto.nombre}</td>
                <td>{producto.precio_venta.toLocaleString('es-CL')}</td>
                <td>{producto.cantidad}</td>
                <td>
                  <Button variant="danger" onClick={() => eliminarProducto(index)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="3" className="text-right">
                <strong>Precio total:</strong>
              </td>
              <td>{precioTotal.toLocaleString('es-CL')}</td>
            </tr>
          </tbody>
        </Table>
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="danger" onClick={vaciarCarrito}>
            Vaciar carrito
          </Button>
          <Button variant="success" onClick={handleClick}>
  {session && Object.keys(session).length > 0 ? 'Comprar' : 'Iniciar sesión'}
</Button>

        </div>
      </>
    ) : (
      <p>No hay productos en el carrito</p>
    )}
  </Container>
  
  );
}

