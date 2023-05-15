import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabaseClient";
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Button, Form, Card, Alert } from 'react-bootstrap';

const EditarCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(true);
  const router = useRouter()
  // Obtiene todas las categorías disponibles y las almacena en el estado 'categorias'.
  useEffect(() => {
    const fetchCategorias = async () => {
      const { data } = await supabase.from("categoria").select("*");
      setCategorias(data);
    };
    fetchCategorias();
  }, []);
// Actualiza la categoría seleccionada con los nuevos valores proporcionados. Actualiza el estado de nombre, descripción, estado y categoría seleccionada a valores predeterminados. Actualiza la lista de categorías con los datos actualizados de la base de datos.
  const handleActualizarCategoria = async () => {
    const { error } = await supabase.from("categoria").update({ nombre, descripcion, estado }).eq("id_categoria", categoriaSeleccionada);
    if (error) {
      console.log(error);
    } else {
      console.log("Categoria actualizada exitosamente.");
      setNombre("");
      setDescripcion("");
      setEstado(true);
      setCategoriaSeleccionada(null);
      const { data } = await supabase.from("categoria").select("*");
      setCategorias(data);
    }
  };
// Elimina la categoría seleccionada de la base de datos. Actualiza el estado de nombre, descripción, estado y categoría seleccionada a valores predeterminados. Actualiza la lista de categorías con los datos actualizados de la base de datos.
  const handleEliminarCategoria = async () => {
    const { error } = await supabase.from("categoria").delete().eq("id_categoria", categoriaSeleccionada);
    if (error) {
      console.log(error);
    } else {
      console.log("Categoria eliminada exitosamente.");
      setNombre("");
      setDescripcion("");
      setEstado(true);
      setCategoriaSeleccionada(null);
      const { data } = await supabase.from("categoria").select("*");
      setCategorias(data);
    }
  };
// Actualiza la categoría seleccionada y sus datos correspondientes.
  const handleCategoriaSeleccionada = async (id) => {
    setCategoriaSeleccionada(id);
    const { data } = await supabase.from("categoria").select("*").eq("id_categoria", id);
    setNombre(data[0].nombre);
    setDescripcion(data[0].descripcion);
    setEstado(data[0].estado);
  };
  // Crea una nueva categoría con los datos proporcionados.
  const handleCrearCategoria = async () => {
    try {
      const { data, error } = await supabase.from("categoria").insert({ nombre, descripcion, estado: true });
      if (error) throw error;
      alert("La categoría se creó exitosamente.");
      setNombre("");
      setDescripcion("");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al crear la categoría. Por favor, inténtalo de nuevo.");
    }
  };

  return (
       <Container>
      <Button className="btn" onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} /> Volver Atrás
      </Button>
      <h1>Crear o Editar Categoría</h1>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="nombre">
                  <Form.Label>Nombre:</Form.Label>
                  <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="descripcion">
                  <Form.Label>Descripción:</Form.Label>
                  <Form.Control as="textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="estado">
                  <Form.Check type="checkbox" checked={estado} onChange={(e) => setEstado(e.target.checked)} label={estado ? 'Activo' : 'Inactivo'} />
                </Form.Group>
                <Button variant="primary" onClick={handleCrearCategoria}>Crear</Button>
                <Button variant="primary" onClick={handleActualizarCategoria} className="me-2">Actualizar</Button>
                <Button variant="danger" onClick={handleEliminarCategoria}>Eliminar</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h2>Categorías</h2>
          {categorias && categorias.length > 0 ? (
            <div className="list-group">
              {categorias.map((cat) => (
                <Button key={cat.id_categoria} className={`${cat.id_categoria === categoriaSeleccionada?.id_categoria ? 'active' : ''}`} onClick={() => handleCategoriaSeleccionada(cat.id_categoria)}>
                  {cat.nombre}
                </Button>
              ))}
            </div>
          ) : (
            <Alert variant="info" className="mt-3">
              No hay categorías disponibles.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
          }
          export default EditarCategoria;;