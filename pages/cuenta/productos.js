import { useState, useEffect } from "react";
import { Card, Button, Table } from "react-bootstrap";
import { supabase } from "@/Lib/supabaseClient";
import Link from "next/link";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
// Obtiene la lista de productos de la base de datos y los almacena en el estado "productos".
  const getListaProductos = async () => {
    const { data, error } = await supabase.from("articulo").select("*").order("nombre");
    if (error) console.log("Error al obtener los productos: ", error);
    else setProductos(data);
    setIsLoading(false);
  };
// Realiza la llamada a la función "getListaProductos" al cargar el componente, obteniendo la lista de productos.
  useEffect(() => {
    getListaProductos();
  }, []);
// Elimina un producto específico mediante su ID y actualiza la lista de productos.
  const handleEliminarProducto = async (id_articulo) => {
    const { error } = await supabase.from("articulo").delete().eq("id_articulo", id_articulo);
    if (error) console.log("Error al eliminar el producto: ", error);
    else setProductos(productos.filter(producto => producto.id_articulo !== id_articulo));
  };
  
  return (
    <div className="container">
    <div className="row">
      <div className="col-12 col-md-3">
        <h1>Productos</h1>
      </div>
      <div className="col-12 col-md-9 text-end">
        <Link href="/cuenta/crearProducto">
          <Button variant="primary">Crear producto</Button>
        </Link>
        <Link href="./cuenta/categoria">
          <Button variant="primary">Categoria</Button>
        </Link>
      </div>
    </div>
    <hr />
    {isLoading ? (
      <p>Cargando productos...</p>
    ) : (
      <Card>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => setProductos([...productos].sort((a, b) => a.nombre.localeCompare(b.nombre)))}>
                Nombre
              </th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th onClick={() => setProductos([...productos].sort((a, b) => a.precio_venta - b.precio_venta))}>
                Precio
              </th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id_articulo}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.stock}</td>
                <td>{producto.precio_venta}</td>
                <td>
                  <Button variant="danger" onClick={() => handleEliminarProducto(producto.id_articulo)}>
                    Eliminar
                  </Button>{" "}
                  <Link href={`/producto/${producto.nombre.replace(/ /g, "-")}`}>
                    <Button variant="secondary">Ver</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    )}
  </div>
  
  );
};

export default Productos;
