import { useState, useEffect } from 'react';
import { supabase } from '@/Lib/supabaseClient';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
  // Maneja la subida de un producto a la base de datos. Verifica si se seleccionó una imagen, luego sube la imagen al almacenamiento de Supabase y obtiene su URL. A continuación, inserta los datos del producto, incluyendo la URL de la imagen, en la tabla 'articulo'. Si ocurre algún error, se muestra un mensaje de error. Si se completa exitosamente, se reinician los campos del formulario y se muestra una alerta de éxito.
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
        alert('Producto subido exitosamente');
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
  return (
    <form onSubmit={handleSubmit}>
      <button className='btn' onClick={() => router.back()}>
  <FontAwesomeIcon icon={faArrowLeft} /> Volver Atrás
</button>
      <div className="form-group">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="id_categoria">Categoría:</label>
        <select
          id="id_categoria"
          name="id_categoria"
          value={idCategoria}
          onChange={(e) => setIdCategoria(parseInt(e.target.value))}
          className="form-control"
          required
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id_categoria} value={categoria.id_categoria}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="codigo">Código:</label>
        <input
          type="text"
          id="codigo"
          name="codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="precio_venta">Precio de venta:</label>
        <input
          type="number"
          id="precio_venta"
          name="precio_venta"
          value={precioVenta}
          onChange={(e) => setPrecioVenta(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="stock">Stock:</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="form-control"
          rows="3"
        />
      </div>
      <div className="form-group">
        <label htmlFor="imagen">Imagen:</label>
        <input
          type="file"
          id="imagen"
          name="imagen"
          onChange={(e) => setUrlImagen(e.target.value)}
          accept="image/*"
          className="form-control-file"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
    
  );
}