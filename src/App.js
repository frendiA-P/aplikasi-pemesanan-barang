import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BarangList from './components/barang/BarangList';
import AddBarang from './components/barang/AddBarang';
import KasirPage from './components/key/KasirPage';
import User from './components/userfd/user';
import SupplierPage from './components/key/SupplierPage';
import AdminPage from './components/key/AdminPage';
import barangData from './data/barang.json';
import transactionData from './data/transactions.json';

function App() {
  const [barangs, setBarangs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('user');
  const [role, setRole] = useState('user');
  const [currentPage, setCurrentPage] = useState('user');
  const [currentUserRole, setCurrentUserRole] = useState('admin'); // Set role admin sebagai default

  useEffect(() => {
    setBarangs(barangData.barangs);
    localStorage.setItem('barangs', JSON.stringify(barangData.barangs));
    
    setTransactions(transactionData.transactions);
    localStorage.setItem('transactions', JSON.stringify(transactionData.transactions));
  }, []);

  useEffect(() => {
    localStorage.setItem('barangs', JSON.stringify(barangs));
  }, [barangs]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Data akun untuk login
  const userAccounts = [
    { username: "gudang", password: "gudang123", role: "gudang" },
    { username: "kasir", password: "kasir123", role: "kasir" },
    { username: "supplier", password: "supplier123", role: "supplier" },
    { username: "admin", password: "admin123", role: "admin" }, // Tambah akun admin
    { username: "user", password: "user123", role: "user" }
  ];

  const login = () => {
    const account = userAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      setUser(account.username);
      setIsLogin(true);
      setRole(account.role);

      // Redirect langsung ke halaman berdasarkan role
      if (account.role === 'kasir') {
        setCurrentPage('kasir');
      } else if (account.role === 'gudang') {
        setCurrentPage('gudang');
      } else if (account.role === 'supplier') {
        setCurrentPage('supplier');
      } else if (account.role === 'admin') { // Admin bisa akses semua
        setCurrentPage('admin'); 
      } else {
        setCurrentPage('user'); 
      }
    } else {
      alert("Username atau password salah");
    }
  };

  const logout = () => {
    setIsLogin(false);
    setUser('user');
    setRole('user');
    setCurrentPage('user');
  };

  const handleDelete = (id) => {
    const updatedBarangs = barangs.filter((barang) => barang.id !== id);
    setBarangs(updatedBarangs);
  };

  const handleEdit = (id) => {
    console.log(`Edit barang dengan id: ${id}`); 
  };

  const handleAdd = () => {
    setCurrentPage('addBarang');
  };

  const addBarang = (barang) => {
    const newId = barangs.length > 0 
                  ? Math.max(...barangs.map(b => b.id)) + 1 
                  : 1; 
    const newBarang = { ...barang, id: newId };
    setBarangs([...barangs, newBarang]);
    setCurrentPage('gudang');
  };

  const handleCancelAdd = () => {
    setCurrentPage('gudang'); 
  };

  const validateTransaction = (transactionId, payment, discount) => {
    const transaction = transactions.find((t) => t.id === transactionId);

    if (!transaction) {
      alert(`Transaksi dengan ID ${transactionId} tidak ditemukan.`);
      return;
    }

    const barang = barangs.find((b) => b.id === transaction.barangId);

    if (!barang) {
      alert('Barang tidak ditemukan dalam inventaris.');
      return;
    }

    if (barang.stokBarang < transaction.quantity) {
      alert('Stok barang tidak mencukupi.');
      return;
    }

    const totalPrice = (transaction.quantity * barang.hargaBarang) * (1 - (discount / 100));

    if (payment < totalPrice) {
      alert('Pembayaran tidak mencukupi.');
      return;
    }

    updateTransactionStatus(transactionId, 'processed', payment, discount);
    updateBarangStock(transaction.barangId, transaction.quantity);

    alert('Transaksi berhasil divalidasi dan stok barang telah dikurangi.');
  };

  const requestSupplier = (barangId, quantityNeeded) => {
    const barang = barangs.find(b => b.id === barangId);

    if (!barang) {
      alert('Barang tidak ditemukan dalam inventaris.');
      return;
    }

    console.log(`Meminta ${quantityNeeded} unit ${barang.namaBarang} dari supplier.`);
    alert(`Permintaan untuk ${quantityNeeded} unit ${barang.namaBarang} telah dikirim ke supplier.`);
  };

  const updateTransactionStatus = (transactionId, newStatus, payment, discount) => {
    setTransactions(transactions.map((t) => 
      t.id === transactionId ? { ...t, status: newStatus, payment, discount } : t 
    ));
  };

  const handleTransactionSubmit = (transaction) => {
    const newId = transactions.length > 0 
                  ? Math.max(...transactions.map(t => t.id)) + 1 
                  : 1; 
    const newTransaction = { ...transaction, id: newId, status: 'pending' };
    setTransactions([...transactions, newTransaction]);
  };

  const updateBarangStock = (barangId, quantity) => {
    setBarangs(barangs.map((barang) => 
      barang.id === barangId ? { ...barang, stokBarang: barang.stokBarang - quantity } : barang 
    ));
  };

  const deleteTransaction = (transactionId) => {
    setTransactions(transactions.filter(t => t.id !== transactionId));
  };

  const updateStock = (barangId, additionalStock) => {
    setBarangs(barangs.map((barang) => 
      barang.id === barangId ? { ...barang, stokBarang: barang.stokBarang + additionalStock } : barang 
    ));
  };

  return (
    <div className="container mt-4">
      {!isLogin ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg border-0 rounded-4" style={{ width: '400px', backgroundColor: '#fff' }}>
          <div className="card-header" style={{ backgroundColor: '#000000', color: '#fff', borderRadius: '0.5rem 0.5rem 0 0', textAlign: 'center', padding: '1.5rem 1rem' }}>
            <h3 className="mb-0">Welcome</h3>
            <p className="mb-0">Please login to your account</p>
          </div>
          <div className="card-body p-5">
            <form onSubmit={(e) => { e.preventDefault(); login(); }}>
              <div className="mb-4">
                <label htmlFor="username" className="form-label">Username:</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-lg w-100" style={{ backgroundColor: '#000000', color: '#fff' }}>Login</button>
            </form>
            <div className="text-center mt-3">
              <p className="mb-0">Please insert correctly</p>
            </div>
          </div>
          </div>
        </div>
      ) : (
      <div>
        <header className="mb-4">
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
      <a className="navbar-brand d-flex align-items-center" href="#">
        <span className="fw-bold">BI ROTAN</span>
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {role === 'kasir' && (
            <li className="nav-item">
              <button 
                className="btn btn-link nav-link" 
                onClick={() => setCurrentPage('kasir')}
              >
                <i className="bi bi-cash-stack me-1"></i>
                Kasir
              </button>
            </li>
          )}
          {role === 'admin' && (
            <React.Fragment>
              <li className="nav-item">
                <button 
                  className="btn btn-link nav-link" 
                  onClick={() => setCurrentPage('gudang')}
                >
                  <i className="bi bi-house-door me-1"></i>
                  Gudang
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="btn btn-link nav-link" 
                  onClick={() => setCurrentPage('supplier')}
                >
                  <i className="bi bi-truck me-1"></i>
                  Supplier
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="btn btn-link nav-link" 
                  onClick={() => setCurrentPage('kasir')}
                >
                  <i className="bi bi-cash-coin me-1"></i>
                  Kasir
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="btn btn-link nav-link" 
                  onClick={() => setCurrentPage('admin')}
                >
                  <i className="bi bi-person me-1"></i>
                  Admin
                </button>
              </li>
            </React.Fragment>
          )}
        </ul>
        <button 
          className="btn btn-danger" 
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</header>



          {currentPage === 'gudang' && ( 
            <div>
              <h1 className='text-center'>Gudang Page</h1> 
              <BarangList 
                barangs={barangs} 
                onDelete={handleDelete} 
                onEdit={handleEdit} 
              />
              <button className="btn btn-dark mt-3" onClick={handleAdd}>
                  Tambah Barang
              </button>
            </div>
          )}

          {currentPage === 'addBarang' && (
            <div>
              <AddBarang onAdd={addBarang} onCancel={handleCancelAdd} />
            </div>
          )}

          {currentPage === 'kasir' && (
            <div>
              <h1 className='text-center'>Kasir Page</h1>
              <KasirPage 
                transactions={transactions} 
                barangs={barangs} 
                onValidateTransaction={validateTransaction} 
                onRequestSupplier={requestSupplier} 
                onUpdateTransactionStatus={updateTransactionStatus}
                onDeleteTransaction={deleteTransaction}
              />
            </div>
          )}

          {currentPage === 'supplier' && (
            <div>
              <h1 className='text-center'>Supplier Page</h1>
              <SupplierPage 
                barangs={barangs} 
                onUpdateStock={updateStock} 
              />
            </div>
          )}

          {currentPage === 'admin' && ( // Menampilkan AdminPage jika currentPage === 'admin'
            <div>
              <h1 className='text-center'>Admin Page</h1>
              <AdminPage 
                barangs={barangs} 
                transactions={transactions}
                // ... (Anda mungkin perlu menambahkan props lainnya ke AdminPage)
              />
            </div>
          )}

          {currentPage === 'user' && (
            <div>
              <h1>User Page</h1>
              <User 
                barangs={barangs} 
                transactions={transactions} 
                handleTransactionSubmit={handleTransactionSubmit} 
                onLogout={logout} 
              /> 
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
