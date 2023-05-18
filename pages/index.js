import { supabase } from "@/Lib/supabaseClient";
import Link from "next/link";
import { Container, Row, Col, Card, Carousel, Button } from "react-bootstrap";
import { useState, useEffect } from "react";


export async function getServerSideProps() {
  const { data: articulos, error } = await supabase
    .from("articulo")
    .select("*")
    .eq("estado", true)
    .order("stock", { ascending: false });

  if (error) {
    return { props: { error: error.message } };
  }

  return { props: { articulos } };
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }

  const truncatedText = text.slice(0, maxLength);
  const lastSpaceIndex = truncatedText.lastIndexOf(" ");

  if (lastSpaceIndex === -1) {
    return truncatedText + "...";
  }

  return truncatedText.slice(0, lastSpaceIndex) + "...";
};

const agregarAlCarrito = (producto) => {
  const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
  const nuevoCarrito = [...carritoActual, producto];
  localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
};

export default function HomePage({ articulos, error }) {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("carrito")) || [];
    setCartItemCount(cartItems.length);
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Container className="my-5">
        <Row className="mb-4">
          <Card style={{ borderRadius: "25px", backgroundColor: "#D2CEF8" }}>
            <Col>
              <h1 className="text-center">
                ¡Bienvenido a nuestra tienda de productos para mascotas!
              </h1>
              <p className="text-center">
                Aquí encontrarás todo lo que necesitas para cuidar a tu mascota.
              </p>
            </Col>
          </Card>
        </Row>
        <Row xs={1} md={3} className="g-4 mt-5">
          {articulos.map((articulo) => (
            <Col key={articulo.id_articulo}>
              <Card className="card h-100 d-flex flex-column">
                <Card.Img variant="top" src={articulo.url_imagen} alt={articulo.nombre} />
                <Card.Body>
                  <Card.Title>{articulo.nombre}</Card.Title>
                  <Card.Text>{truncateText(articulo.descripcion, 150)}</Card.Text>
                  <Card.Text>Precio: {articulo.precio_venta.toLocaleString("es-CL")}</Card.Text>
                  <Card.Text>Stock: {articulo.stock}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        agregarAlCarrito(articulo);
                        setCartItemCount(cartItemCount + 1);
                      }}
                    >
                      Agregar al carrito
                    </button>
                    <Link href={`./producto/${articulo.nombre.replaceAll(" ", "-")}`}>
                      <button className="btn btn-secondary" style={{ backgroundColor: "#D2CEF2" }}>
                        ver producto
                      </button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
