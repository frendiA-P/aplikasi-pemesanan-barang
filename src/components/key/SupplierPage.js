import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';

function SupplierPage({ barangs, onUpdateStock }) {
  const [selectedBarangId, setSelectedBarangId] = useState(null);
  const [additionalStock, setAdditionalStock] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const handleUpdateStock = () => {
    if (selectedBarangId && additionalStock > 0) {
      onUpdateStock(selectedBarangId, additionalStock);
      setSelectedBarangId(null);
      setAdditionalStock(0);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <Container className="my-4">

  

<div className="mb-4" />
  
<Row className="justify-content-center">
  <Col md={8}>
    <h2 className="text-center mb-4">List of Barang</h2>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama Barang</th>
          <th>Stok Barang</th>
        </tr>
      </thead>
      <tbody>
        {barangs.map((barang) => (
          <tr key={barang.id}>
            <td>{barang.id}</td>
            <td>{barang.namaBarang}</td>
            <td>{barang.stokBarang}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Col>
</Row>

<div className="container text-center">
  <h2 className="text-center mb-4">Update Stock</h2>
  <div className="bg-light p-3 rounded shadow" style={{ maxWidth: '400px', margin: '0 auto', border: '1px solid black' }}>
    <Form>
      <Form.Group controlId="barangSelect">
        <Form.Label>Select Barang:</Form.Label>
        <Form.Control as="select" value={selectedBarangId || ''} onChange={(e) => setSelectedBarangId(parseInt(e.target.value))}>
          <option value="" disabled>Select Barang</option>
          {barangs.map((barang) => (
            <option key={barang.id} value={barang.id}>
              {barang.namaBarang}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="additionalStock">
        <Form.Label>Additional Stock:</Form.Label>
        <Form.Control type="number" value={additionalStock} onChange={(e) => setAdditionalStock(parseInt(e.target.value))} />
      </Form.Group>

      <Button variant="dark" block className="mt-3" onClick={handleUpdateStock}>
        Update Stock
      </Button>

      {showAlert && (
        <Alert variant="danger" className="mt-3">
          Please select a barang and enter a valid stock quantity.
        </Alert>
      )}
    </Form>
  </div>
</div>



    </Container>
  );

  
  
}

export default SupplierPage;
