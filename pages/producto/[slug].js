import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/Lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';


function Product() {
  const [producto, setProducto] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [calificacion, setCalificacion] = useState(1);
  const [comentario, setComentario] = useState('');
  const router = useRouter();
  const { slug } = router.query;
  const [usuario, setUsuario] = useState(null);

  // Función para obtener el producto desde Supabase
  const fetchProducto = useCallback(async () => {
    if (!slug) return;
    const { data: producto, error } = await supabase
      .from('articulo')
      .select('*')
      .eq('nombre', slug.replace(/-/g, ' '))
      .single();
    if (error) {
      console.error(error);
    } else {
      setProducto(producto);
    }
  }, [slug]);

  const handleCalificacionChange = (value) => {
    setCalificacion(value);
  };


// Función para obtener los comentarios del producto desde Supabase
const fetchComentarios = useCallback(async () => {
  if (!producto) return;

  // Obtener los comentarios del producto
  const { data: comentarios, error: comentariosError } = await supabase
    .from('calificacion')
    .select('*')
    .eq('id_producto', producto.id_articulo);

  if (comentariosError) {
    console.error(comentariosError);
  } else {
    // Obtener los detalles de usuario para cada comentario
    const comentariosConUsuario = await Promise.all(comentarios.map(async (comentario) => {
      const userId = comentario.id_usuario;
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuario')
        .select('nombre')
        .eq('id_usuario', userId)
        .single();

      if (usuarioError) {
        console.error(usuarioError);
        return comentario;
      } else {
        return { ...comentario, usuario };
      }
    }));

    setComentarios(comentariosConUsuario);
  }
}, [producto]);



  // Ejecutar las funciones fetchProducto y fetchComentarios al cargar la página o cuando el slug cambie
  useEffect(() => {
    fetchProducto();
  }, [fetchProducto]);

  useEffect(() => {
    fetchComentarios();
  }, [fetchComentarios]);

  if (!producto) {
    return <p>Cargando...</p>;
  }

  const { nombre, descripcion, precio_venta, url_imagen } = producto;

  // Función para agregar el producto al carrito
  function agregarAlCarrito(producto) {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    const nuevoCarrito = [...carritoActual, producto];
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  }

  // Función para enviar un comentario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const session = localStorage.getItem('session');
    const userId = session ? JSON.parse(session).userId : null;
  
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario.');
      return;
    }
  
    const { data, error } = await supabase.from('calificacion').insert([
      {
        id_producto: producto.id_articulo,
        id_usuario: userId,
        calificacion: calificacion,
        comentario: comentario,
        fecha: new Date(),
      },
    ]);
  
    if (error) {
      console.error(error);
    } else {
      fetchComentarios();
      setCalificacion(1);
      setComentario('');
    }
  };
// Calcular la nota promedio
const calcularNotaPromedio = () => {
  if (comentarios.length === 0) {
    return 'Sin calificaciones';
  }

  const totalCalificaciones = comentarios.reduce(
    (total, comentario) => total + comentario.calificacion,
    0
  );
    return totalCalificaciones / comentarios.length;
  };

  return (
    <div>
      <Button className='btn' onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} /> Volver Atrás
      </Button>
      <Container className="shadow p-3 mb-5 bg-body-tertiary rounded">
        <Row>
          <Col md={4}>
            <Card style={{ borderRadius: "15px" }}>
              <Card.Img variant="top" src={url_imagen} alt={nombre} style={{ borderRadius: "15px" }} />
            </Card>
          </Col>
          <Col md={4} className="offset-md-4 align-self-center">
            <h1>{nombre}</h1>
            <p>{descripcion}</p>
            <p className="text-right">Precio: ${precio_venta.toLocaleString('es-CL')}</p>
            <Button className="btn btn-primary" onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</Button>
          </Col>
        </Row>
      </Container>
      <Container className="shadow p-3 mb-5 bg-body-tertiary rounded">
        <h2>Opiniones de {nombre}</h2>
        <Row>
          <Col md={6}>
            <h4>Nota Promedio </h4>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <FontAwesomeIcon
                  key={value}
                  icon={value <= calcularNotaPromedio() ? solidStar : regularStar}
                  className="star"
                />
              ))}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Comentarios ({comentarios.length})</h4>
            {comentarios.map((comentario) => (
              <Card key={comentario.id}>
                <Card.Body>
                  <Row>
                    <Col md={3}>
                    <p>{comentario.usuario && comentario.usuario.nombre}</p>
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <FontAwesomeIcon
                            key={value}
                            icon={value <= comentario.calificacion ? solidStar : regularStar}
                            className="star"
                          />
                        ))}
                      </div>
                    </Col>
                    <Col md={9}>
                      <p>{comentario.comentario}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
        {process.browser && localStorage.getItem('session') && (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h5>Deja tu comentario</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Calificación:</Form.Label>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value} htmlFor={`calificacion-${value}`}>
                          <input
                            type="radio"
                            id={`calificacion-${value}`}
                            name="calificacion"
                            value={value}
                            checked={calificacion === value}
                            onChange={() => handleCalificacionChange(value)}
                            style={{ display: 'none' }}
                          />
                          <FontAwesomeIcon
                            icon={calificacion >= value ? solidStar : regularStar}
                            className={`star ${calificacion >= value ? 'checked' : ''}`}
                            style={{ fontSize: '1.5rem' }}
                          />
                        </label>
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Comentario:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Enviar comentario
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      </Container>
    </div>
  );
}

export default Product;
