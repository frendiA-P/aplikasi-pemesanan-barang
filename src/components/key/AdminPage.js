import React, { useState, useEffect } from 'react';
import roles from '../../data/role.json';

const AdminPage = () => {
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user'); // Default role
  const [currentPage, setCurrentPage] = useState('gudang'); // Default page
  const [availableRoles, setAvailableRoles] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setAvailableRoles(roles.roles.map(role => role.role)); // Adjust to access the roles array inside roles JSON
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const addUser = (username, password, role) => {
    const newUser = { username, password, role };
    const updatedUsers = [...users, newUser]; // Update the users array
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Update localStorage
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(newUserUsername, newUserPassword, newUserRole);
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserRole('user'); // Reset role to default
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4 d-flex justify-content-center align-items-center"> {/* Memusatkan konten ke tengah */}
      <div className="card mt-4 shadow" style={{ width: '450px' }}> {/* Menyesuaikan lebar dan memusatkan kotak ke tengah */}
        <div className="card-header bg-dark text-white text-center">
          <h5 className="mb-0">Add New User</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newUserUsername" className="form-label">Username:</label>
              <input 
                type="text" 
                className="form-control" 
                id="newUserUsername" 
                value={newUserUsername} 
                onChange={(e) => setNewUserUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newUserPassword" className="form-label">Password:</label>
              <input 
                type="password" 
                className="form-control" 
                id="newUserPassword" 
                value={newUserPassword} 
                onChange={(e) => setNewUserPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newUserRole" className="form-label">Role:</label>
              <select 
                className="form-control" 
                id="newUserRole" 
                value={newUserRole} 
                onChange={(e) => setNewUserRole(e.target.value)}
              >
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-dark">Add User</button>
          </form>
        </div>
      </div>
    </div>
  );
  
  
  
  
  
  
  
};

export default AdminPage;
