import { useState, useEffect } from 'react';
import { supabase } from '@/Lib/supabaseClient';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';

export default function SubirProducto() {
  const [idCategoria, setIdCategoria] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [urlImagen, setUrlImagen] = useState('');
  const router = useRouter();
  const [mostrarAviso, setMostrarAviso] = useState(false); // Estado para mostrar/ocultar el aviso

  // Obtiene la lista de categorías desde la base de datos
  useEffect(() => {
    async function fetchCategorias() {
      let { data, error } = await supabase.from('categoria').select('id_categoria, nombre');
      if (error) {
        console.log('Error al obtener categorías:', error.message);
      } else if (data) {
        setCategorias(data);
      }
    }
    fetchCategorias();
  }, []);

  // Maneja la subida de un producto a la base de datos.
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!e.target.imagen.files[0]) {
        throw new Error('Debe seleccionar una imagen');
      }
      const file = e.target.imagen.files[0];
      const path = `${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('imagen')
        .upload(path, file, { cacheControl: '3600' });
      if (uploadError) {
        throw new Error(`Error al subir imagen: ${uploadError.message}`);
      }
      const url = `https://jvawjhgzotsabzvwyvro.supabase.co/storage/v1/object/public/imagen/${path}`;
      const response = await supabase.from('articulo').insert({
        id_categoria: idCategoria,
        codigo: codigo,
        nombre: nombre,
        precio_venta: parseFloat(precioVenta),
        stock: parseInt(stock),
        descripcion: descripcion,
        url_imagen: url,
      });
      if (response.error) {
        console.log('Error al subir producto:', response.error.message);
      } else {
        setMostrarAviso(true);
        setIdCategoria('');
        setCodigo('');
        setNombre('');
        setPrecioVenta('');
        setStock('');
        setDescripcion('');
        setUrlImagen('');
      }
    } catch (error) {
      console.log('Error al subir producto:', error.message);
    }
  }

  const handleCloseAviso = () => {
    setMostrarAviso(false);
    router.push('/cuenta');
  };

  return (
    <Container>
      <Row>
        <Col md={8} className="mx-auto">
          <Button variant="secondary" onClick={() => router.back()} className="mb-3">
            <FontAwesomeIcon icon={faArrowLeft} /> Volver Atrás
          </Button>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre:</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="id_categoria">
              <Form.Label>Categoría:</Form.Label>
              <Form.Select
                value={idCategoria}
                onChange={(e) => setIdCategoria(parseInt(e.target.value))}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="codigo">
              <Form.Label>Código:</Form.Label>
              <Form.Control
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="precio_venta">
              <Form.Label>Precio de venta:</Form.Label>
              <Form.Control
                type="number"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="stock">
              <Form.Label>Stock:</Form.Label>
              <Form.Control
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="descripcion">
              <Form.Label>Descripción:</Form.Label>
              <Form.Control
                as="textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
              />
            </Form.Group>

            <Form.Group controlId="imagen">
              <Form.Label>Imagen:</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setUrlImagen(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mb-3">
              Guardar
            </Button>
          </Form>

          <Modal show={mostrarAviso} onHide={handleCloseAviso}>
            <Modal.Header closeButton>
              <Modal.Title>¡El producto se ha creado exitosamente!</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseAviso}>
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}
