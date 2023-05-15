import { useState } from 'react';
import { Form, Button, Modal, Card } from 'react-bootstrap';
import { supabase } from '@/Lib/supabaseClient';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    id_rol: 2,
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
// Actualiza el estado del formulario.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
// Cierra el modal estableciendo el estado de showModal en falso.
  const handleCloseModal = () => setShowModal(false);

// Maneja el evento de envío del formulario y evita que se realice la acción por defecto del navegador.
  const handleSubmit = async (e) => {
    e.preventDefault();

// Validar que el email no esté registrado
    const { data: user, error } = await supabase
      .from('usuario')
      .select('id_usuario')
      .eq('email', formData.email)
      .single();
    if (user) {
      setErrorMessage('Este email ya está registrado.');
      setShowModal(true);
      return;
    }
// Inserta los datos del formulario en la tabla "usuario" de la base de datos y captura el posible error.
    const { error: insertError } = await supabase.from('usuario').insert([formData]);

    if (insertError) {
      console.log('Error registrando usuario:', insertError.message);
    } else {
      console.log('Usuario registrado exitosamente');
      setShowModal(true);
    }
  };

  return (
    <Card style={{ maxWidth: '400px', margin: '0 auto' }}>
    <Card.Body>
      <h2>Registro de usuario</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" name="nombre" placeholder="Ingresa tu nombre" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="formDireccion">
          <Form.Label>Dirección</Form.Label>
          <Form.Control type="text" name="direccion" placeholder="Ingresa tu dirección" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="formTelefono">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control type="text" name="telefono" placeholder="Ingresa tu teléfono" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Ingresa tu email" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" placeholder="Ingresa tu contraseña" onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Registrarse
        </Button>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Registro de usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMessage ? <p>{errorMessage}</p> : <p>Usuario registrado exitosamente</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => (window.location.href = '/')}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Card.Body>
  </Card>
  );
};

export default RegisterForm;
