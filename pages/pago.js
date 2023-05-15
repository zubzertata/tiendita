import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { supabase } from '@/Lib/supabaseClient';

export default function CompraPage() {

  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [userId, setUserId] = useState(null);
//esta sección del código define una función que agrega un producto al carrito de compras. Verifica si ya hay elementos en el carrito y luego agrega el producto seleccionado a la lista de productos existente.
  useEffect(() => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    setProductosSeleccionados(carritoActual);
//esta sección del código define una función que agrega un producto al carrito de compras. Verifica si ya hay elementos en el carrito y luego agrega el producto seleccionado a la lista de productos existente.
    const userId = localStorage.getItem('userId');
    setUserId(userId);
  }, []);

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

  const handlePagarClick = async () => {
    // Obtener el id_usuario desde localStorage
    const session = JSON.parse(localStorage.getItem('session'));
    const id_usuario = session.userId;
    if (!id_usuario) {
      console.error('El id_usuario no está definido en localStorage');
      return;
    }
    
  
    // Obtener la hora actual en Chile
    const fecha_hora = new Date().toISOString().split('T')[0];

  
    // Calcular el total de la venta
    const total = productosSeleccionados.reduce((total, producto) => total + producto.precio_venta, 0);
  
    // Crear la venta
    const { data: venta, error: errorVenta } = await supabase
      .from('venta')
      .insert({ id_usuario, fecha_hora, total, estado: true })
      .single();
    // Si hay un error al crear la venta, mostrarlo y terminar la ejecución
    if (errorVenta) {
      console.error(errorVenta);
      return;
    }
  
    // Obtener el último id_venta
    const { data: ultimoIdVenta, error: errorUltimoIdVenta } = await supabase
      .from('venta')
      .select('id_venta')
      .order('id_venta', { ascending: false })
      .limit(1)
      .single();
  
    if (errorUltimoIdVenta) {
      console.error(errorUltimoIdVenta);
      return;
    }
    // Crear los detalles de la venta
    const productosConCantidad = productosSeleccionados.reduce((productos, producto) => {
      const index = productos.findIndex(p => p.id_articulo === producto.id_articulo);
      if (index !== -1) {
        productos[index].cantidad++;
      } else {
        productos.push({...producto, cantidad: 1});
      }
      return productos;
    }, []);
    // Agrupamos los productos por id_articulo y agregamos la cantidad
    const productosAgrupados = productosConCantidad.reduce((productos, producto) => {
      const index = productos.findIndex(p => p.id_articulo === producto.id_articulo);
      if (index !== -1) {
        productos[index].cantidad += producto.cantidad;
      } else {
        productos.push(producto);
      }
      return productos;
    }, []);

    
  // Crear los detalles de la venta
  const detalleVenta = productosAgrupados.map((producto) => ({
    id_venta: ultimoIdVenta.id_venta,
    id_articulo: producto.id_articulo,
    cantidad: producto.cantidad,
    precio: producto.precio_venta * producto.cantidad, // Usamos el precio unitario del producto multiplicado por la cantidad
    descuento: 0 // No se aplica descuento en este ejemplo
  }));
    // Insertar los detalles de la venta
    const { error: errorDetalleVenta } = await supabase.from('detalle_venta').insert(detalleVenta);
    // Si hay un error al crear los detalles de la venta, mostrarlo y terminar la ejecución
    if (errorDetalleVenta) {
      console.error(errorDetalleVenta);
      return;
    }
  
    // Mostrar mensaje de éxito
    alert('Su compra fue realizada');
  
    // Limpiar el carrito
    localStorage.removeItem('carrito');
    setProductosSeleccionados([]);
  

    // Actualizar el stock de los productos
    await Promise.all(productosAgrupados.map(async (producto) => {
      const { error } = await supabase
        .from("articulo")
        .update({ stock: producto.stock - producto.cantidad })
        .eq("id_articulo", producto.id_articulo);
    // Si hay un error al actualizar el stock, mostrarlo   
      if (error) {
        console.log(error);
      } else {
        console.log(`Articulo ${producto.id_articulo} actualizado exitosamente.`);
      }
    }));
    
  };
  

  return (
    <Container>
      <h1 className="text-center">Productos seleccionados</h1>
      <Row>
        <Col sm={12} md={6}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {productosAgrupados.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.nombre}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.precio_venta.toLocaleString('es-CL')}</td>
                  <td>{(producto.precio_venta * producto.cantidad).toLocaleString('es-CL')}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-end">
                  <strong>Total:</strong>
                </td>
                <td>{precioTotal.toLocaleString('es-CL')}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col sm={12} md={6} className="text-end">
          <Button variant="success" className="d-block d-sm-none mb-3" onClick={handlePagarClick}>
            Pagar
          </Button>
          <Button variant="success" className="d-none d-sm-block" onClick={handlePagarClick}>
            Pagar
          </Button>
        </Col>
      </Row>
    </Container>
  );
              }  