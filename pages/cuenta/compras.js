import { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { supabase } from '@/Lib/supabaseClient';


export default function Venta  ()  {
  const [ventas, setVentas] = useState([]);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [detalleVenta, setDetalleVenta] = useState([]);
// Realiza una solicitud a la base de datos para obtener las ventas asociadas al usuario actual. Almacena los datos de las ventas en el estado 'ventas'. Esta operación se ejecuta una vez al cargar el componente.
  useEffect(() => {
    const fetchVentas = async () => {
      const { data } = await supabase
        .from('venta')
        .select('id_venta, total')
        .eq('id_usuario', [JSON.parse(localStorage.getItem('session')).userId]);
      setVentas(data);
    };
    fetchVentas();
  }, []);

// Actualiza el estado 'selectedVenta' con el ID de la venta seleccionada. Obtiene los detalles de la venta y realiza operaciones para obtener el nombre del artículo asociado a cada detalle. Actualiza el estado 'detalleVenta' con los datos obtenidos.
  const handleDetalleVenta = async (idVenta) => {
    setSelectedVenta(idVenta);
    const { data } = await supabase
      .from('detalle_venta')
      .select('id_detalle_venta, id_venta, id_articulo, cantidad, precio, descuento')
      .eq('id_venta', idVenta);
    const detalleData = await Promise.all(data.map(async (detalle) => {
      const { data: articuloData } = await supabase
        .from('articulo')
        .select('nombre')
        .eq('id_articulo', detalle.id_articulo)
        .single();
      return { ...detalle, nombre_articulo: articuloData.nombre };
    }));
    setDetalleVenta(detalleData);
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Código (ID Venta)</th>
            <th>Monto Total (Venta)</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{venta.total}</td>
              <td>
                <Button onClick={() => handleDetalleVenta(venta.id_venta)}>
                  Ver detalle
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
  
      <Modal show={!!selectedVenta} onHide={() => setSelectedVenta(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre (Artículo)</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Descuento</th>
              </tr>
            </thead>
            <tbody>
              {detalleVenta.map((detalle) => (
                <tr key={detalle.id_detalle_venta}>
                  <td>{detalle.nombre_articulo}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{detalle.precio}</td>
                  <td>{detalle.descuento}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedVenta(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
              }  