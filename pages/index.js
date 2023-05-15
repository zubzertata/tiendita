import { supabase } from '@/Lib/supabaseClient';
import Link from 'next/link';
import { Container, Row, Col, Card, Carousel,Button } from 'react-bootstrap';

export async function getStaticProps() {

  //esta sección del código realiza una consulta a la tabla "articulo" en la base de datos Supabase para obtener los artículos que tienen estado "true" y los ordena por stock de mayor a menor.
  const { data: articulos, error } = await supabase
    .from('articulo')
    .select('*')
    .eq('estado', true)
    .order('stock', { ascending: false });
  
  if (error) {
    return { props: { error: error.message } };
  }
  
  return { props: { articulos } };
}
//esta sección del código define una función que agrega un producto al carrito de compras. Verifica si ya hay elementos en el carrito y luego agrega el producto seleccionado a la lista de productos existente.
const agregarAlCarrito = (producto) => {
  const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
  const nuevoCarrito = [...carritoActual, producto];
  localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
};
//esta sección del código maneja el caso en que haya un error al obtener los artículos de la base de datos. En este caso, se muestra el mensaje de error en pantalla.
export default function HomePage({ articulos, error }) {
  if (error) {
    return <div>{error}</div>;
  }
  
  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Card style={{ borderRadius:'25px',backgroundColor: '#D2CEF8'}} >
          <Col>
            <h1 className="text-center " >¡Bienvenido a nuestra tienda de productos para mascotas!</h1>
            <p className="text-center">Aquí encontrarás todo lo que necesitas para cuidar a tu mascota.</p>
          </Col>
        </Card>
      </Row>
      <Row xs={1} md={3} className="g-4 mt-5">
        {articulos.map((articulo) => (
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
