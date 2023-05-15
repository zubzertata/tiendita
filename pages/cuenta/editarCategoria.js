import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabaseClient";


const EditarCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(true);
// Obtiene las categorías de productos desde la base de datos y actualiza el estado de categorías.
  useEffect(() => {
    const fetchCategorias = async () => {
      const { data } = await supabase.from("categoria").select("*");
      setCategorias(data);
    };
    fetchCategorias();
  }, []);
// Actualiza la categoría seleccionada con los nuevos valores y actualiza la lista de categorías.
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
// Elimina la categoría seleccionada y actualiza la lista de categorías.
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
// Actualiza el estado de la categoría seleccionada y carga sus detalles.
  const handleCategoriaSeleccionada = async (id) => {
    setCategoriaSeleccionada(id);
    const { data } = await supabase.from("categoria").select("*").eq("id_categoria", id);
    setNombre(data[0].nombre);
    setDescripcion(data[0].descripcion);
    setEstado(data[0].estado);
  };

  return (
    <div className="container">
      <h1>Editar Categoría</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion">Descripción:</label>
                <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="form-control"></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="estado">Estado:</label>
                <div className="form-check">
                  <input type="checkbox" id="estado" checked={estado} onChange={(e) => setEstado(e.target.checked)} className="form-check-input" />
                  <label htmlFor="estado" className="form-check-label">{estado ? "Activo" : "Inactivo"}</label>
                </div>
              </div>
              <div>
                <button onClick={handleActualizarCategoria} className="btn btn-primary me-2">Actualizar</button>
                <button onClick={handleEliminarCategoria} className="btn btn-danger">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <h2>Categorías</h2>
          {categorias && categorias.length > 0 ? (
            <div className="list-group">
              {categorias.map((cat) => (
                <button key={cat.id_categoria} className={`list-group-item list-group-item-action ${cat.id_categoria === categoriaSeleccionada?.id_categoria ? "active" : ""}`} onClick={() => handleCategoriaSeleccionada(cat.id_categoria)}>
  {cat.nombre}
</button>

              ))}
            </div>
          ) : (
            <div className="alert alert-info mt-3" role="alert">
              No hay categorías disponibles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
          }
          export default EditarCategoria;;