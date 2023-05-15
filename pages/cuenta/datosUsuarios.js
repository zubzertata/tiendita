import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { supabase } from '@/Lib/supabaseClient';
function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
  // Se establece el estado "usuarios" con los datos de los usuarios obtenidos.
    useEffect(() => {
      async function fetchUsuarios() {
        let { data: usuarios, error } = await supabase
          .from('usuario')
          .select('id_usuario, nombre, telefono, email, estado, direccion')
          .eq('id_rol', 2);
  
        if (error) console.log('Error al obtener los usuarios:', error.message);
        else setUsuarios(usuarios);
      }
      fetchUsuarios();
    }, []);
  // Maneja la eliminación de un usuario en base a su ID. Actualiza el estado "usuarios" filtrando el usuario eliminado.
    async function handleDeleteUsuario(id) {
      let { error } = await supabase.from('usuario').delete().eq('id_usuario', id);
  
      if (error) console.log('Error al eliminar el usuario:', error.message);
      else setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== id));
    }
  
    return (
      <div className="table-responsive">
        {usuarios.length > 0 ? (
          <table className="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Direccion</th>
                <th>Teléfono</th>
                <th>Email</th>
                {/*<th>Dirección</th>*/}
                
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td></td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.direccion}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.email}</td>
                  
                  {/*<td>
                    {`${usuario.id_direccion.calle} ${usuario.id_direccion.numero} ${
                      usuario.id_direccion.depto ? `, Depto. ${usuario.id_direccion.depto}` : ''
                    } (${usuario.id_direccion.referencia}) - ${usuario.id_direccion.id_comuna.nombre_comuna}`}
                </td>*/}
                  
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteUsuario(usuario.id_usuario)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No existen datos.</p>
        )}
      </div>
    );
  }
  
  export default Usuarios;
  