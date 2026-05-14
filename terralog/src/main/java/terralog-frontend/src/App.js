import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Landing Page
import LandingPage from './components/pages/LandingPage';

// Kategori Page
import KategoriPage from './components/pages/KategoriPage';

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
import AddWarga from './components/pages/Dashboard/Admin/CRUDWarga/AddWarga';
import EditWarga from './components/pages/Dashboard/Admin/CRUDWarga/EditWarga';
import AddKategori from './components/pages/Dashboard/Admin/CRUDKategori/AddKategori';
import EditKategori from './components/pages/Dashboard/Admin/CRUDKategori/EditKategori';
import PetugasManagement from './components/pages/Dashboard/Admin/PetugasManagement';
import SampahManagement from './components/pages/Dashboard/Admin/SampahManagement';
import TransaksiManagement from './components/pages/Dashboard/Admin/TransaksiManagement';
import LaporanStatistik from './components/pages/Dashboard/Admin/LaporanStatistik';
import PengaduanManagement from './components/pages/Dashboard/Admin/PengaduanManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/kategori" element={<KategoriPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Navigasi Admin Pengguna diarahkan ke UserManagement */}
        <Route path="/admin/pengguna" element={<UserManagement />} />
        <Route path="/admin/petugas" element={<PetugasManagement />} />
        <Route path="/admin/sampah" element={<SampahManagement />} />
        <Route path="/admin/transaksi" element={<TransaksiManagement />} />
        <Route path="/admin/laporan" element={<LaporanStatistik />} />
        <Route path="/admin/pengaduan" element={<PengaduanManagement />} />
        {/* --- PETUGAS ROUTES --- */}
        <Route path="/petugas/dashboard" element={<PetugasDashboard />} />
        <Route path="/admin/tambah-petugas" element={<AddPetugas />} />
        <Route path="/admin/edit-petugas/:id" element={<EditPetugas />} />
        {/* --- WARGA ROUTES --- */}
        <Route path="/dashboard" element={<WargaDashboard />} />
        <Route path="/admin/tambah-warga" element={<AddWarga />} />
        <Route path="/admin/edit-warga/:id" element={<EditWarga />} />
        <Route path="/admin/tambah-kategori" element={<AddKategori />} />
        <Route path="/admin/edit-kategori/:id" element={<EditKategori />} />
      </Routes>
    </Router>
  );
}

export default App;