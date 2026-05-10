import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 
import { 
  LayoutDashboard, FileText, MapPin, Users, 
  Clock, MessageSquare, Bell, Search, LogOut 
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('nama') || 'Admin'; 
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  useEffect(() => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: 'success',
      title: `Selamat datang, ${userName}!`,
      text: 'Anda berhasil login.'
    });
  }, [userName]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Mau keluar aplikasi?',
      text: "Anda harus login kembali untuk masuk.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1b4332',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/login');
      }
    });
  };

  // --- TAMBAHKAN PATH DI SINI ---
  const menuItems = [
    { id: 'dash', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'lap', icon: <FileText size={20} />, label: 'Laporan Sampah', path: '/admin/laporan' },
    { id: 'peta', icon: <MapPin size={20} />, label: 'Peta Wilayah', path: '/admin/peta' },
    { id: 'peng', icon: <Users size={20} />, label: 'Pengguna', path: '/admin/pengguna' }, // <-- Ini nuju ke userManagement
    { id: 'jad', icon: <Clock size={20} />, label: 'Jadwal Pengangkutan', path: '/admin/jadwal' },
    { id: 'adu', icon: <MessageSquare size={20} />, label: 'Pengaduan', path: '/admin/pengaduan' },
  ];

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>TerraLog</h2>
        
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => navigate(item.path)} // <--- INI KUNCINYA BIAR BISA DIKLIK
              style={{
                ...styles.navItem,
                ...(item.id === 'dash' ? styles.activeItem : {}),
                ...(hoveredItem === item.id ? styles.hoverItem : {})
              }}
            >
              {item.icon} <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div 
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          onClick={handleLogout}
          style={{
            ...styles.logoutItem,
            ...(isLogoutHovered ? styles.logoutHover : {})
          }}
        >
          <LogOut size={20} /> <span>Keluar</span>
        </div>

        <div style={styles.profileSection}>
          <div style={styles.avatar}></div>
          <div>
            <div style={{fontWeight: 'bold', fontSize: '14px'}}>{userName}</div>
            <div style={{fontSize: '10px', opacity: 0.8}}>NRP: 152024023</div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerIcons}>
            <Bell size={20} color="#666" style={{cursor: 'pointer'}} />
            <div style={styles.searchBar}>
              <Search size={16} color="#fff" style={{marginRight: '8px'}} />
              <input type="text" placeholder="Search......" style={styles.searchInput} />
            </div>
          </div>
        </header>

        <section style={styles.statsGrid}>
          {['Total Laporan', 'RT/RW', 'Diproses', 'Selesai'].map((title, index) => (
            <div key={index} style={styles.statCard}>
              <p style={{fontSize: '14px', color: '#555'}}>{title}</p>
              <h3 style={{fontSize: '32px', margin: '10px 0', color: '#1b4332'}}>20</h3>
            </div>
          ))}
        </section>

        <section style={styles.largeGrid}>
          <div style={styles.largeCard}><h3>Statistik Pengangkutan</h3></div>
          <div style={styles.largeCard}><h3>Peta Distribusi Sampah</h3></div>
        </section>
      </main>
    </div>
  );
};

// ... (Styles tetep sama kayak punya kamu)
const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#f5f6f8', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#1b4332', color: '#fff', display: 'flex', flexDirection: 'column', padding: '25px 15px' },
  logo: { fontSize: '24px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' },
  nav: { flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '8px', cursor: 'pointer', borderRadius: '10px', transition: 'all 0.3s ease' },
  activeItem: { backgroundColor: '#2d6a4f' },
  hoverItem: { backgroundColor: 'rgba(255,255,255,0.15)', transform: 'translateX(5px)' },
  logoutItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '20px', cursor: 'pointer', borderRadius: '10px', color: '#ff6b6b', transition: 'all 0.3s ease', fontWeight: '600' },
  logoutHover: { backgroundColor: 'rgba(255, 107, 107, 0.1)', transform: 'translateX(5px)' },
  profileSection: { display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
  avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fff', opacity: 0.5 },
  main: { flex: 1, padding: '30px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' },
  headerIcons: { display: 'flex', alignItems: 'center', gap: '20px' },
  searchBar: { backgroundColor: '#2d6a4f', padding: '8px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', width: '220px' },
  searchInput: { backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
  statCard: { backgroundColor: '#ffffff', border: '1px solid #eee', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  largeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  largeCard: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '25px', minHeight: '350px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
};

export default AdminDashboard;