import { useState } from 'react'
import { supabase } from '@/Lib/supabaseClient'
import { Card, Form, Button } from 'react-bootstrap';
import Link from 'next/link';


function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleLogin(event) {
    event.preventDefault()

    // Comprobar los datos de inicio de sesión
    const { success, message } = await login(email, password)

    // Mostrar el mensaje de éxito o error
    setMessage(message)
  }

  async function login(email, password) {
    // Hacer una consulta a la tabla de usuarios de Supabase para comprobar si existe un usuario con el correo electrónico proporcionado
    const { data: user, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .single()

    // Si el usuario no está registrado, mostrar un mensaje de error
    if (error || !user) {
      return {
        success: false,
        message: 'Usuario no registrado'
      }
    }

    // Si la contraseña proporcionada no coincide con la almacenada en la base de datos, mostrar un mensaje de error
    if (password !== user.password) {
      return {
        success: false,
        message: 'Contraseña incorrecta'
      }
    }

    // Si los datos de inicio de sesión son correctos, guardar el ID del usuario y el rol en el local storage
    localStorage.setItem('session', JSON.stringify({ userId: user.id_usuario, role: user.id_rol }))

    // Redirigir al usuario a la página de inicio
    window.location.href = '/'

    // Devolver un objeto indicando que el inicio de sesión fue exitoso
    return {
      success: true,
      message: 'Inicio de sesión exitoso'
    }
  }

  return (
<div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-sm-8 col-md-6 col-lg-4">
          <Card>
            <Card.Header className="text-center">
              <h4>Iniciar sesión</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingrese su correo electrónico"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </Form.Group>

                {message && (
                  <div className="alert alert-success" role="alert">
                    {message}
                  </div>
                )}

                <Button variant="primary" type="submit" className="w-100">
                  Iniciar sesión
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center">
              ¿No tiene cuenta? 
              <Link href="/cuenta/registro">Regístrese aquí</Link>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
