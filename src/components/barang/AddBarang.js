import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddBarang = ({ onAdd, onCancel }) => {
  const [namaBarang, setNamaBarang] = useState('');
  const [jenisBarang, setJenisBarang] = useState('');
  const [hargaBarang, setHargaBarang] = useState('');
  const [stokBarang, setStokBarang] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi input (optional)
    if (!namaBarang || !jenisBarang || !hargaBarang || stokBarang < 0) {
      alert('Please fill in all fields correctly.');
      return;
    }

    // Buat objek barang baru
    const newBarang = {
      namaBarang,
      jenisBarang,
      hargaBarang: parseInt(hargaBarang, 10), // Pastikan harga adalah integer
      stokBarang: parseInt(stokBarang, 10) // Pastikan stok adalah integer
    };

    // Kirim data barang baru ke fungsi onAdd
    onAdd(newBarang);

    // Reset input form
    setNamaBarang('');
    setJenisBarang('');
    setHargaBarang('');
    setStokBarang(0);
  };

  return (
<div className="modal-dialog" role="document">
  <div className="modal-content">
    <div className="modal-header">
      <h5 className="modal-title mx-auto mb-4 h4">Tambah Barang</h5>
      <button type="button" className="close ml-auto mr-2" aria-label="Close" onClick={onCancel}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="modal-body text-left">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="namaBarang" className="h6">Nama Barang:</label>
          <input
            type="text"
            className="form-control"
            id="namaBarang"
            value={namaBarang}
            onChange={(e) => setNamaBarang(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="jenisBarang" className="h6">Jenis Barang:</label>
          <input
            type="text"
            className="form-control"
            id="jenisBarang"
            value={jenisBarang}
            onChange={(e) => setJenisBarang(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="hargaBarang" className="h6">Harga Barang:</label>
          <input
            type="number"
            className="form-control"
            id="hargaBarang"
            value={hargaBarang}
            onChange={(e) => setHargaBarang(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stokBarang" className="h6">Stok Barang:</label>
          <input
            type="number"
            className="form-control"
            id="stokBarang"
            value={stokBarang}
            onChange={(e) => setStokBarang(parseInt(e.target.value, 10))}
            required
          />
        </div>
        <button type="submit" className="btn btn-dark btn-block mt-3">Add Barang</button>
      </form>
    </div>
  </div>
</div>







  );
};

AddBarang.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddBarang;
