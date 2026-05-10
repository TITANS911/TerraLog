import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Halaman Auth
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';

// Import Dashboard
import AdminDashboard from './components/pages/Dashboard/AdminDashboard';
import PetugasDashboard from './components/pages/Dashboard/PetugasDashboard';
import WargaDashboard from './components/pages/Dashboard/WargaDashboard';

// IMPORT CRUD MANAGEMENT (Gunakan UserManagement)
import UserManagement from './components/pages/Dashboard/Admin/UserManagement';
import AddPetugas from './components/pages/Dashboard/Admin/CRUDPetugas/AddPetugas';
import EditPetugas from './components/pages/Dashboard/Admin/CRUDPetugas/EditPetugas';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Navigasi Admin Pengguna diarahkan ke UserManagement */}
        <Route path="/admin/pengguna" element={<UserManagement />} />

        {/* --- PETUGAS ROUTES --- */}
        <Route path="/petugas/dashboard" element={<PetugasDashboard />} />
        <Route path="/admin/tambah-petugas" element={<AddPetugas />} />
        <Route path="/admin/edit-petugas/:id" element={<EditPetugas />} />

        {/* --- WARGA ROUTES --- */}
        <Route path="/dashboard" element={<WargaDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;