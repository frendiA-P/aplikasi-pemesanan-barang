import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const formatHarga = (harga) => {
  return `Rp. ${Number(harga).toLocaleString('id-ID')}`;
};

const BarangList = ({ barangs, onDelete, onEdit, onAdd, onSelect }) => {
  const [isLoading, setIsLoading] = useState(true); // State untuk loading

  useEffect(() => {
    setIsLoading(false); // Set isLoading ke false setelah barangs di-load
  }, [barangs]);

  return (
<div class="container mt-4">
  <h2 class="mb-4">List of Barang</h2>
  <div class="card">
    <div class="card-body">
      <div class="table-responsive"> 
        <table class="table table-bordered">
          <thead class="bg-primary text-white">
            <tr>
              <th>ID</th>
              <th>Nama Barang</th>
              <th>Jenis Barang</th>
              <th>Harga Barang</th>
              <th>Stok Barang</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {barangs.map((barang) => (
              <tr key={barang.id} onClick={() => onSelect(barang)}>
                <td>{barang.id}</td>
                <td>{barang.namaBarang}</td>
                <td>{barang.jenisBarang}</td>
                <td>{formatHarga(barang.hargaBarang)}</td>
                <td>{barang.stokBarang}</td>
                <td class="text-center">
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-outline-info"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(barang.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(barang.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>





  );
};

BarangList.propTypes = {
  barangs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      namaBarang: PropTypes.string.isRequired,
      jenisBarang: PropTypes.string.isRequired,
      hargaBarang: PropTypes.string.isRequired,
      stokBarang: PropTypes.number.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default BarangList;