import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Send, Clock, History, 
  MapPin, Search, LogOut, User, PlusCircle, Trash2, Edit3, Mail
} from 'lucide-react';

const BuangSampah = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('nama') || 'Warga';
  
  // Ambil userId dengan aman
  const currentUserId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId'), 10) : null; 

  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. FETCH DATA DARI BACKEND ---
  const fetchLaporan = async () => {
    // Jika userId terdeteksi tidak ada di localStorage, stop fetch agar data tidak bocor!
    if (!currentUserId || isNaN(currentUserId)) {
      setLaporanList([]);
      return;
    }

    setLoading(true);
    try {
      // Menggunakan 'localhost' agar sinkron dengan konfigurasi server Tomcat Spring Boot
      const response = await axios.get(`http://localhost:8080/api/waste/user/${currentUserId}`);
      
      // Pastikan data yang masuk berbentuk Array
      if (Array.isArray(response.data)) {
        setLaporanList(response.data);
      } else {
        setLaporanList([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data berdasarkan user:", error);
      Swal.fire('Error', 'Gagal memuat data setoran sampah Anda. Pastikan server backend menyala.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [currentUserId]);

  // --- 2. FUNGSI DELETE ---
  const handleDelete = (id) => {
    if (!id) return;
    Swal.fire({
      title: 'Hapus Laporan?',
      text: "Data sampah ini akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#004434',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/waste/${id}`);
          Swal.fire('Terhapus!', 'Laporan berhasil dihapus.', 'success');
          fetchLaporan(); 
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          Swal.fire('Gagal!', 'Terjadi kesalahan sistem saat menghapus data.', 'error');
        }
      }
    });
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#004434',
      confirmButtonText: 'Ya, Keluar'
    }).then((res) => { 
      if(res.isConfirmed) { 
        localStorage.clear(); 
        navigate('/login'); 
      } 
    });
  };

  // --- HELPER LOGIC UNTUK MENGURAI DATA REKAP JAVA ---
  const dapatkanInfoSampah = (l) => {
    if (!l) return { kategori: 'Umum', berat: 0 };
    if (l.organik > 0) return { kategori: 'Organik', berat: l.organik };
    if (l.anorganik > 0) return { kategori: 'Anorganik', berat: l.anorganik };
    if (l.campuran > 0) return { kategori: 'Campuran', berat: l.campuran };
    if (l.b3 > 0) return { kategori: 'B3', berat: l.b3 };
    return { kategori: 'Umum', berat: 0 };
  };

  // --- FILTER SEARCH BERDASARKAN KATEGORI ---
  const filteredLaporan = laporanList.filter(l => {
    const info = dapatkanInfoSampah(l);
    return info.kategori.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const menuItems = [
    { id: 'dash', icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
    { id: 'lapor', icon: <Send size={18} />, label: 'Buang Sampah', path: '/warga/buang-sampah' },
    { id: 'jadwal', icon: <Clock size={18} />, label: 'Jadwal Saya', path: '/warga/jadwal' },
    { id: 'riwayat', icon: <History size={18} />, label: 'Riwayat Laporan', path: '/warga/riwayat' },
    { id: 'lokasi', icon: <MapPin size={18} />, label: 'Lokasi TPS', path: '/warga/lokasi' },
  ];

  return (
    <div style={styles.container}>
      {/* --- SIDEBAR --- */}
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}><h2 style={styles.logoText}><span>T</span>erraLog</h2></div>
        <div style={styles.navLabel}>MENU WARGA</div>
        <nav style={styles.navMenu}>
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                ...styles.navItem,
                ...(item.id === 'lapor' ? styles.activeNavItem : {}),
                ...(hoveredItem === item.id ? styles.hoverNavItem : {})
              }}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </nav>
        <div style={styles.logoutBtn} onClick={handleLogout}><LogOut size={18} /> Keluar</div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div style={styles.welcomeText}>
            <h1 style={{margin:0, fontSize:'24px'}}>Setoran Sampah Saya ({userName})</h1>
            <p style={{margin:0, color:'#666', fontSize:'14px'}}>Monitor dan kelola laporan buang sampah kamu.</p>
          </div>
          <div style={styles.headerTools}>
            <div style={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Cari berdasarkan kategori..." 
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} color="#666" />
            </div>
            <div style={styles.headerIcons}>
              <Mail size={20} style={{cursor:'pointer'}} />
              <div style={styles.profileCircle}><User size={18} /></div>
            </div>
          </div>
        </header>

        <div style={styles.welcomeBox}>
          <div>
            <h2 style={{margin: 0, fontSize: '20px'}}>Punya sampah yang ingin diangkut?</h2>
            <p style={{margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px'}}>Pastikan sampah sudah dibungkus rapi di depan rumah.</p>
          </div>
          <button style={styles.mainButton} onClick={() => navigate('/warga/tambah-sampah')}>
            <PlusCircle size={20} /> Buat Laporan Baru
          </button>
        </div>

        {/* --- TABEL DATA --- */}
        <div style={styles.tableCard}>
          {loading ? (
            <p style={{textAlign:'center', padding: '20px'}}>Memuat data...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{...styles.th, ...styles.thLeft, width: '60px'}}>No</th>
                  <th style={styles.th}>Nama Sampah</th>
                  <th style={styles.th}>Kategori</th>
                  <th style={styles.th}>Berat</th>
                  <th style={styles.th}>Status</th>
                  <th style={{...styles.th, ...styles.thRight}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredLaporan.map((l, index) => {
                  const info = dapatkanInfoSampah(l);
                  // Ambil ID penanda baris secara fleksibel (antisipasi id / wasteId dari backend)
                  const currentWasteId = l.wasteId || l.id; 
                  return (
                    <tr key={currentWasteId || index} style={styles.tr}>
                      <td style={{...styles.td, fontWeight: 'bold', color: '#666'}}>{index + 1}</td>
                      <td style={styles.td}><b>Setoran Sampah #{currentWasteId}</b></td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.categoryBadge,
                          backgroundColor: info.kategori === 'B3' ? '#ffebee' : '#e8f5e9',
                          color: info.kategori === 'B3' ? '#c62828' : '#2e7d32'
                        }}>
                          {info.kategori}
                        </span>
                      </td>
                      <td style={styles.td}>{info.berat} kg</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: l.status === 'PENDING' ? '#fff3e0' : '#d8f3dc', 
                          color: l.status === 'PENDING' ? '#ef6c00' : '#2d6a4f'
                        }}>
                          {l.status || 'PENDING'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button 
                            onClick={() => navigate(`/warga/edit-sampah/${currentWasteId}`)} 
                            style={styles.editBtn}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(currentWasteId)}
                            style={styles.deleteBtn}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          
          {/* JIKA USER ID KOSONG ATAU MEMANG TIDAK ADA DATA */}
          {!loading && filteredLaporan.length === 0 && (
            <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
              {!currentUserId 
                ? "Sesi Bermasalah: Sila Logout lalu Login kembali agar ID Akun tersinkronisasi." 
                : "Tidak ada data laporan milik kamu."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- STYLES (DIPERTAHANKAN SESUAI CODE AWAL KAMU) ---
const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#004434' },
  sidebar: { width: '240px', padding: '30px 20px', color: '#fff', display: 'flex', flexDirection: 'column' },
  logoSection: { marginBottom: '40px' },
  logoText: { fontSize: '24px', margin: 0, fontWeight: 'bold' },
  navLabel: { fontSize: '10px', opacity: 0.6, letterSpacing: '1px', marginBottom: '15px' },
  navMenu: { flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '10px', marginBottom: '5px', cursor: 'pointer', fontSize: '14px', transition: '0.3s' },
  activeNavItem: { backgroundColor: 'rgba(255,255,255,0.2)', fontWeight: 'bold' },
  hoverNavItem: { backgroundColor: 'rgba(255,255,255,0.1)', transform: 'translateX(5px)' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', marginTop: 'auto', color: '#ff6b6b' },

  mainContent: { flex: 1, backgroundColor: '#f4f7f6', margin: '15px', borderRadius: '30px', padding: '35px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  headerTools: { display: 'flex', alignItems: 'center', gap: '15px' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '8px 15px', borderRadius: '20px', border: '1px solid #ddd' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '180px' },
  headerIcons: { display: 'flex', alignItems: 'center', gap: '10px' },
  profileCircle: { width: '35px', height: '35px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ddd' },

  welcomeBox: { backgroundColor: '#004434', color: '#fff', padding: '25px 30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  mainButton: { backgroundColor: '#fff', color: '#004434', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },

  tableCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '0px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', flex: 1, overflowY: 'auto', overflowX: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '16px 20px', backgroundColor: '#004434', color: '#fff', fontSize: '14px', fontWeight: 'bold' },
  thLeft: { borderTopLeftRadius: '20px' },
  thRight: { borderTopRightRadius: '20px' },
  td: { padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontSize: '14px', color: '#333' },
  tr: { transition: '0.2s', '&:hover': { backgroundColor: '#f9fbfb' } },
  categoryBadge: { padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  editBtn: { backgroundColor: '#eef5f3', color: '#004434', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
  deleteBtn: { backgroundColor: '#fff1f1', color: '#d33', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
};

export default BuangSampah;