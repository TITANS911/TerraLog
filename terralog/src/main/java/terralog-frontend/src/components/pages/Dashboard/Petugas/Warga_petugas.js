import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. PASTIKAN IMPORT AXIOS
import { 
  LayoutDashboard, Truck, MapPin, CheckCircle, 
  Bell, Search, LogOut, User, Shield, UserCheck, 
  Tag, PlusCircle, Edit, Trash2 
} from 'lucide-react';

const WargaPetugas = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userName = localStorage.getItem('nama') || 'Petugas';
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // --- FETCH DATA USERS ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetch users:", error);
      Swal.fire('Error', 'Gagal menyambung ke server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- FETCH DATA KATEGORI ---
  const fetchKategori = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8080/api/kategori');
      setKategoriList(response.data); // 2. SESUAIKAN DENGAN STATE kategoriList
    } catch (error) {
      console.error("Error fetch kategori:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchKategori();
  }, []);

  // --- LOGIKA FILTER (HANYA BOLEH DEKLARASI SEKALI) ---
  const filteredWarga = users.filter(u => 
    u.role?.toUpperCase().trim() === 'WARGA' && 
    (u.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const filteredPetugas = users.filter(u => 
    u.role?.toUpperCase().trim() === 'PETUGAS' && 
    (u.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const filteredKategoriData = kategoriList.filter(k => 
    (k.namaKategori?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // --- HANDLER AKSI ---
  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
    }).then((res) => { if(res.isConfirmed) { localStorage.clear(); navigate('/login'); }});
  };

  const handleGeneralDelete = (id, nama, type) => {
    // Tentukan endpoint berdasarkan type (WARGA atau KATEGORI)
    const endpoint = type === 'KATEGORI' 
        ? `http://127.0.0.1:8080/api/kategori/${id}`
        : `http://127.0.0.1:8080/api/users/${id}`;

    Swal.fire({
        title: `Hapus ${type === 'KATEGORI' ? 'Kategori' : 'Warga'}?`,
        text: `Apakah kamu yakin ingin menghapus "${nama}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1b4332',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(endpoint);
                Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
                
                // Refresh data setelah hapus
                if (type === 'KATEGORI') fetchKategori();
                else fetchUsers();
            } catch (error) {
                console.error("Error delete:", error);
                Swal.fire('Gagal!', 'Data tidak bisa dihapus atau masih terelasi dengan data lain.', 'error');
            }
        }
    });
};

  const menuItems = [
    { id: 'dash', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/petugas/dashboard' },
    { id: 'warga', icon: <Truck size={20} />, label: 'Data Warga', path: '/petugas/warga' },
    { id: 'transaksi', icon: <MapPin size={20} />, label: 'Transaksi', path: '/petugas/transaksi' },
    { id: 'penjemputanSampah', icon: <CheckCircle size={20} />, label: 'Penjemputan Sampah', path: '/petugas/penjemputan-sampah' },
    { id: 'laporan', icon: <Bell size={20} />, label: 'Laporan', path: '/petugas/laporan' },
    { id: 'pengaduan', icon: <Bell size={20} />, label: 'Pengaduan', path: '/petugas/pengaduan' },
  ];

  // --- SUB-KOMPONEN TABEL ---
  const UserTable = ({ title, data, icon, type }) => (
    <div style={styles.tableCard}>
      <div style={styles.tableHeader}>
        <div style={styles.titleGroup}>{icon} <h3 style={{margin:0}}>{title}</h3></div>
         {type === 'KATEGORI' && (
                        <button 
                            style={styles.addButton}
                            onClick={() => navigate('/admin/tambah-kategori')}
                        >
                            <PlusCircle size={16} /> Tambah Kategori
                        </button>
                    )}
      </div>
      <div style={{overflowX: 'auto'}}>
        <table style={styles.table}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={styles.th}>Nama</th>
              {type !== 'KATEGORI' && <th style={styles.th}>Username</th>}
              <th style={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((item) => (
              <tr key={type === 'KATEGORI' ? item.idKategori : item.userId} style={styles.tr}>
                <td style={styles.td}>{type === 'KATEGORI' ? item.namaKategori : item.nama}</td>
                {type !== 'KATEGORI' && <td style={styles.td}>{item.username}</td>}
                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    <button style={styles.editBtn} onClick={() => navigate(`/admin/edit-${type.toLowerCase()}/${type === 'KATEGORI' ? item.idKategori : item.userId}`)}>
                        <Edit size={16} />
                    </button>
                    <button 
                        style={styles.deleteBtn} 
                        onClick={() => handleGeneralDelete(
                            type === 'KATEGORI' ? item.idKategori : item.userId, 
                            type === 'KATEGORI' ? item.namaKategori : item.nama, 
                            type
                        )}
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Data tidak ditemukan</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={styles.logo}>TerraLog</h2>
          <span style={styles.badge}>PETUGAS</span>
        </div>
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <div key={item.id} onClick={() => navigate(item.path)} style={{...styles.navItem, ...(item.id === 'warga' ? styles.activeItem : {})}}>
              {item.icon} <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div onClick={handleLogout} style={styles.logoutItem}>
          <LogOut size={20} /> <span>Keluar</span>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.topHeader}>
          <h2 style={{color: '#1b4332', margin: 0}}>Data Warga</h2>
          <div style={styles.searchBar}>
            <Search size={18} color="#fff" />
            <input 
              type="text" 
              placeholder="Cari nama..." 
              style={styles.searchInput} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p style={{textAlign: 'center', marginTop: '50px'}}>Memuat data...</p>
        ) : (
          <div style={styles.contentArea}>
            <div style={{height: '20px'}}></div>
            <UserTable title="List Warga" data={filteredWarga} icon={<UserCheck color="#1b4332" />} type="WARGA" />
            <div style={{height: '20px'}}></div>
            <UserTable title="List Kategori" data={filteredKategoriData} icon={<Tag color="#1b4332" />} type="KATEGORI" />
          </div>
        )}
      </main>
    </div>
  );
};

// Tambahkan style yang kurang
const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#f5f6f8' },
  sidebar: { width: '260px', backgroundColor: '#1b4332', color: '#fff', padding: '25px 15px', display: 'flex', flexDirection: 'column' },
  logo: { fontSize: '24px', fontWeight: 'bold' },
  badge: { fontSize: '10px', backgroundColor: '#2d6a4f', padding: '2px 8px', borderRadius: '10px' },
  nav: { flex: 1, marginTop: '20px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '8px', cursor: 'pointer', borderRadius: '10px' },
  activeItem: { backgroundColor: '#2d6a4f' },
  logoutItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', cursor: 'pointer', color: '#ff6b6b' },
  main: { flex: 1, padding: '30px', overflowY: 'auto' },
  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  searchBar: { backgroundColor: '#2d6a4f', padding: '8px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', width: '250px' },
  searchInput: { backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', marginLeft: '10px' },
  tableCard: { backgroundColor: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  tableHeader: { 
    display: 'flex',              // Tambahkan ini
    justifyContent: 'space-between', // Tambahkan ini agar judul di kiri, tombol di kanan
    alignItems: 'center',         // Tambahkan ini agar sejajar vertikal
    marginBottom: '15px' 
},
// Tambahkan style untuk addButton yang mungkin tadi terlewat
addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#1b4332',
    color: '#fff',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px'
},
  titleGroup: { display: 'flex', alignItems: 'center', gap: '10px', color: '#1b4332' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', color: '#666' },
  td: { padding: '12px', borderBottom: '1px solid #eee' },
  actionGroup: { display: 'flex', gap: '10px' },
  editBtn: { border: 'none', backgroundColor: '#e3f2fd', color: '#1976d2', padding: '5px', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { border: 'none', backgroundColor: '#ffebee', color: '#d32f2f', padding: '5px', borderRadius: '5px', cursor: 'pointer' },
};

export default WargaPetugas;