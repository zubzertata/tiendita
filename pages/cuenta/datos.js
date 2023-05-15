import { supabase } from '@/Lib/supabaseClient';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const DatosPersonales = () => {
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [clave, setClave] = useState('');
  const userId = process.browser && JSON.parse(localStorage.getItem('session')).userId; // Verificar si se encuentra en el navegador

  // Obtiene y actualiza los datos de un usuario específico mediante su ID.
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const { data, error } = await supabase
          .from('usuario')
          .select('id_usuario, nombre, telefono, email, direccion')
          .eq('id_usuario', userId)
          .single();
        if (error) {
          throw error;
        }
        setUsuario(data);
        setNombre(data.nombre);
        setTelefono(data.telefono);
        setEmail(data.email);
        setDireccion(data.direccion);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsuario();
  }, [userId]);

  // Actualiza los datos del usuario con los valores proporcionados para nombre, teléfono, email y dirección.
  const handleActualizar = async () => {
    try {
      const { error } = await supabase
        .from('usuario')
        .update({ nombre, telefono, email, direccion })
        .eq('id_usuario', userId);
      if (error) {
        throw error;
      }
      alert('Datos actualizados exitosamente.');
    } catch (error) {
      console.error(error);
      alert('Hubo un error al actualizar los datos.');
    }
  };

  // Elimina la cuenta del usuario actual si se confirma
  const handleEliminar = async () => {
    if (window.confirm('¿Está seguro que desea eliminar su cuenta?')) {
      try {
        const { error } = await supabase
          .from('usuario')
          .delete()
          .eq('id_usuario', userId);
        if (error) {
          throw error;
        }
        alert('Cuenta eliminada exitosamente.');
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('Hubo un error al eliminar la cuenta.');
      }
    }
  };

  if (!usuario) {
    return <p>Cargando...</p>;
  }

  return ( <Container>
    <Row>
      <Col>
        <h1>Datos personales</h1>
        <Form>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formClave">
            <Form.Label>Clave</Form.Label>
            <Form.Control type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleActualizar}>
            Guardar cambios
          </Button>
          <Button variant="danger" onClick={handleEliminar}>
            Eliminar cuenta
          </Button>
        </Form>
      </Col>
    </Row>
  </Container>
);
};

export default DatosPersonales;
