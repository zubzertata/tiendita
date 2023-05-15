import { useState } from 'react';
import { supabase } from '@/Lib/supabaseClient';
import Link from 'next/link';
import { Container, Row, Col, Button,Card } from 'react-bootstrap';


export async function getStaticProps() {
   //esta sección del código realiza una consulta a la tabla "articulos" en la base de datos Supabase para obtener las categorías que tienen estado "true".
  const { data: articulos, error } = await supabase
    .from('articulo')
    .select('*')
    .eq('estado', true);
  if (error) {
    return { props: { error: error.message } };
  }
  //esta sección del código realiza una consulta a la tabla "categoria" en la base de datos Supabase para obtener las categorías que tienen estado "true".
  const { data: categorias } = await supabase
    .from('categoria')
    .select('*')
    .eq('estado', true);
  if (error) {
    return { props: { error: error.message } };
  }
  return { props: { articulos, categorias } };
}
//esta sección del código define una función que agrega un producto al carrito de compras. Verifica si ya hay elementos en el carrito y luego agrega el producto seleccionado a la lista de productos existente.
const agregarAlCarrito = (producto) => {
  const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
  const nuevoCarrito = [...carritoActual, producto];
  localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
};
// Define la página de inicio con un estado inicial para el filtro de categoría. Si hay un error, se muestra en pantalla.
export default function HomePage({ articulos, categorias, error }) {
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  if (error) {
    return <div>{error}</div>;
  }
 // Filtra los artículos según la categoría seleccionada o muestra todos si no hay filtro.
  const articulosFiltrados = articulos.filter((articulo) => {
    if (filtroCategoria === null) {
      return true;
    }
    return articulo.id_categoria === filtroCategoria;
  });

  return (
    <Container className="my-5">
            <Row className="mb-4 text-center">
        <Col>
            <h3>Filtrar por categoría:</h3>
            <Button
            variant={!filtroCategoria ? '' : ''}
            onClick={() => setFiltroCategoria(null)}
            className="me-2"
            style={{ backgroundColor: filtroCategoria === null ? '#D2CEF2' : '' }}
            >
            Todos
            </Button>
            {categorias.map((categoria) => (
            <Button
                key={categoria.id_categoria}
                variant={filtroCategoria === categoria.id_categoria ? '' : ''}
                onClick={() => setFiltroCategoria(categoria.id_categoria)}
                className="me-2"
                style={{ backgroundColor: filtroCategoria === categoria.id_categoria ? '#D2CEF2' : '' }}
            >
                {categoria.nombre}
            </Button>
            ))}
        </Col>
        </Row>
        <Row xs={1} md={3} className="g-4">
            {articulosFiltrados.map((articulo) => (
            <Col key={articulo.id_articulo}>
            <Card className='card h-100 d-flex flex-column'>
              <Card.Img variant="top" src={articulo.url_imagen} alt={articulo.nombre} />
              <Card.Body>
                <Card.Title>{articulo.nombre}</Card.Title>
                <Card.Text>{articulo.descripcion}</Card.Text>
                <Card.Text>Precio: {articulo.precio_venta.toLocaleString('es-CL')}</Card.Text>
                <Card.Text>Stock: {articulo.stock}</Card.Text>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-primary" onClick={() => agregarAlCarrito(articulo)}>Agregar al carrito</button>
                  <Link href={`./producto/${articulo.nombre.replaceAll(' ', '-')}`}>
                    <button className="btn btn-secondary" style={{ backgroundColor: '#D2CEF2' }}>ver producto</button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
            </Col>
            ))}
        </Row>
    </Container>
  );
}
// 