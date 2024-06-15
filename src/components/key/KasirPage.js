import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const formatHarga = (harga) => {
  return `Rp. ${Number(harga).toLocaleString('id-ID')}`;
};

const KasirPage = ({ transactions, barangs, onValidateTransaction, onRequestSupplier, onUpdateTransactionStatus }) => {
  const [payment, setPayment] = useState('');
  const [discount, setDiscount] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setPayment('');
    setDiscount('');
    setErrorMessage('');
  };

  const handleValidationSubmit = (e) => {
    e.preventDefault();
  
    const selectedTransactionBarangId = selectedTransaction?.barangId; 
    const barang = barangs.find(b => b.id === selectedTransactionBarangId);
  
    if (!barang) {
      setErrorMessage('Barang not found in inventory for validation.');
      return;
    }
  
    if (barang.stokBarang < selectedTransaction.quantity) {
      setErrorMessage('Stock insufficient for validation. Please request more stock from the supplier.');
      return;
    }
  
    onValidateTransaction(selectedTransaction.id, payment, discount);
    setSelectedTransaction(null);
    setPayment('');
    setDiscount('');
  };
  
  const handleRequestStock = () => {
    const barang = barangs.find(b => b.id === selectedTransaction.barangId);
    if (!barang) {
      setErrorMessage('Barang not found in inventory for stock request.');
      return;
    }

    const quantityNeeded = selectedTransaction.quantity - barang.stokBarang;
    onRequestSupplier(selectedTransaction.barangId, quantityNeeded);
    setErrorMessage('Stock request sent to supplier.');
  };

  const handleAcceptTransaction = (transaction) => {
    handleSelectTransaction(transaction);
    onUpdateTransactionStatus(transaction.id, 'accepted');
  };

  const handleDeclineTransaction = (transactionId) => {
    onUpdateTransactionStatus(transactionId, 'declined');
    alert('Transaction declined.');
  };

  const handleRequestMoreStock = (transaction) => {
    handleSelectTransaction(transaction);
    handleRequestStock();
  };

  return (
    <div className="container mt-4">
      <div className="card mb-4 shadow-lg border-0">
        <h3 className="mb-4 text-center">List of Barang</h3>
        <table className="table table-bordered table-hover table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nama Barang</th>
              <th scope="col">Jenis Barang</th>
              <th scope="col">Harga Barang</th>
              <th scope="col">Stok Barang</th>
            </tr>
          </thead>
          <tbody>
            {barangs.map((barang) => (
              <tr key={barang.id}>
                <td className="align-middle">{barang.id}</td>
                <td className="align-middle">{barang.namaBarang}</td>
                <td className="align-middle">{barang.jenisBarang}</td>
                <td className="align-middle">{formatHarga(barang.hargaBarang)}</td>
                <td className="align-middle">{barang.stokBarang}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="card mb-4 shadow-lg border-0 mt-4">
        <div className="card-header bg-dark text-white text-center py-3">
          <h4 className="mb-0">Transactions</h4>
        </div>
        <div className="card-body">
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
<div className="row">
  {transactions.map((transaction) => (
    <div key={transaction.id} className="col-md-6 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column justify-content-between">
          <div className="text-center">
            <h5 className="card-title">{transaction.itemName}</h5>
            <p className="card-text">Quantity: {transaction.quantity}</p>
            <p className="card-text">Price: {formatHarga(transaction.price)}</p>
          </div>
          <div className="d-flex flex-column align-items-stretch mt-2">
            <button
              className="btn btn-success btn-sm py-1 mb-2"
              onClick={() => handleAcceptTransaction(transaction)}
            >
              Accept
            </button>
            <button
              className="btn btn-danger btn-sm py-1 mb-2"
              onClick={() => handleDeclineTransaction(transaction.id)}
            >
              Decline
            </button>
            <button
              className="btn btn-warning btn-sm py-1"
              onClick={() => handleRequestMoreStock(transaction)}
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>




        </div>
      </div>
  
      {selectedTransaction && (
        <div className="card mb-4 shadow-lg border-0">
          <div className="card-header bg-secondary text-white text-center py-3">
            <h4 className="mb-0">Validate Transaction</h4>
          </div>
          <div className="card-body">
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            <form onSubmit={handleValidationSubmit}>
              <div className="mb-3">
                <label htmlFor="payment" className="form-label">Payment</label>
                <input
                  type="number"
                  className="form-control"
                  id="payment"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="discount" className="form-label">Discount</label>
                <input
                  type="number"
                  className="form-control"
                  id="discount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  min="0"
                />
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">Validate</button>
                {errorMessage && errorMessage.includes('insufficient') && (
                  <button type="button" className="btn btn-warning" onClick={handleRequestStock}>Request Stock</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
  
};

KasirPage.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      itemName: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      barangId: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  barangs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      namaBarang: PropTypes.string.isRequired,
      jenisBarang: PropTypes.string.isRequired,
      hargaBarang: PropTypes.number.isRequired,
      stokBarang: PropTypes.number.isRequired,
    })
  ).isRequired,
  onValidateTransaction: PropTypes.func.isRequired,
  onRequestSupplier: PropTypes.func.isRequired,
  onUpdateTransactionStatus: PropTypes.func.isRequired,
};

export default KasirPage;
