import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, MapPin, CheckCircle, 
  Clock, Bell, Search, LogOut, User 
} from 'lucide-react';

const TransaksiPetugas = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('nama') || 'Petugas';
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // Alert sambutan saat berhasil login
  useEffect(() => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'success',
      title: `Halo Petugas, ${userName}!`,
      text: 'Semangat bertugas hari ini.'
    });
  }, [userName]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Selesai bertugas?',
      text: "Pastikan semua laporan sudah terinput!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1b4332',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/login');
      }
    });
  };

  const menuItems = [
    { id: 'dash', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path : '/petugas/dashboard' },
    { id: 'warga', icon: <Truck size={20} />, label: 'Data Warga', path : '/petugas/warga' },
    { id: 'transaksi', icon: <MapPin size={20} />, label: 'Transaksi', path : '/petugas/transaksi' },
    { id: 'penjemputanSampah', icon: <CheckCircle size={20} />, label: 'Penjemputan Sampah', path : '/petugas/penjemputan-sampah' },
    { id: 'laporan', icon: <Bell size={20} />, label: 'Laporan', path : '/petugas/laporan' },
    { id: 'pengaduan', icon: <Bell size={20} />, label: 'Pengaduan', path : '/petugas/pengaduan' },

  ];

  return (
    <div style={styles.container}>
      {/* --- SIDEBAR --- */}
      <aside style={styles.sidebar}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={styles.logo}>TerraLog</h2>
          <span style={styles.badge}>PETUGAS</span>
        </div>
        
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <div 
              onClick={() => navigate(item.path)}
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
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

        {/* Logout Button */}
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

        {/* Profile Section */}
        <div style={styles.profileSection}>
          <div style={styles.avatar}><User size={20} color="#1b4332" /></div>
          <div>
            <div style={{fontWeight: 'bold', fontSize: '14px'}}>{userName}</div>
            <div style={{fontSize: '10px', opacity: 0.8}}>ID Petugas: P-2024</div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerIcons}>
            <Bell size={20} color="#666" style={{cursor: 'pointer'}} />
            <div style={styles.searchBar}>
              <Search size={16} color="#fff" style={{marginRight: '8px'}} />
              <input type="text" placeholder="Cari lokasi jemput..." style={styles.searchInput} />
            </div>
          </div>
        </header>

        {/* Row Kartu Tugas */}
        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.cardLabel}>Tugas Hari Ini</p>
            <h3 style={styles.cardValue}>12</h3>
            <span style={{color: '#2d6a4f', fontSize: '12px'}}>Sisa: 5 Lokasi</span>
          </div>
          <div style={styles.statCard}>
            <p style={styles.cardLabel}>Total Jemput (Bulan Ini)</p>
            <h3 style={styles.cardValue}>145</h3>
            <span style={{color: '#2d6a4f', fontSize: '12px'}}>Target: 180</span>
          </div>
          <div style={styles.statCard}>
            <p style={styles.cardLabel}>Status Kendaraan</p>
            <h3 style={{...styles.cardValue, color: '#1b4332'}}>Siap</h3>
            <span style={{color: '#666', fontSize: '12px'}}>BBM: 80%</span>
          </div>
        </section>

        {/* Task List & Map Overview */}
        <section style={styles.largeGrid}>
          <div style={styles.largeCard}>
            <h3>Daftar Tugas Penjemputan</h3>
            <div style={styles.placeholderList}>
              <p>📍 Blok A - No. 12 (Organik)</p>
              <p>📍 Blok C - No. 05 (Anorganik)</p>
              <p>📍 Blok F - No. 22 (B3)</p>
            </div>
          </div>
          <div style={styles.largeCard}>
            <h3>Rute Tercepat</h3>
            <div style={{...styles.placeholderList, backgroundColor: '#eee', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
               <MapPin size={40} color="#1b4332" opacity={0.5} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#f5f6f8', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#1b4332', color: '#fff', display: 'flex', flexDirection: 'column', padding: '25px 15px' },
  logo: { fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' },
  badge: { fontSize: '10px', backgroundColor: '#2d6a4f', padding: '2px 8px', borderRadius: '10px' },
  nav: { flex: 1, marginTop: '20px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '8px', cursor: 'pointer', borderRadius: '10px', transition: 'all 0.3s ease' },
  activeItem: { backgroundColor: '#2d6a4f' },
  hoverItem: { backgroundColor: 'rgba(255,255,255,0.15)', transform: 'translateX(5px)' },
  logoutItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '20px', cursor: 'pointer', borderRadius: '10px', color: '#ff6b6b', transition: 'all 0.3s ease', fontWeight: '600' },
  logoutHover: { backgroundColor: 'rgba(255, 107, 107, 0.1)', transform: 'translateX(5px)' },
  profileSection: { display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
  avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  main: { flex: 1, padding: '30px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' },
  headerIcons: { display: 'flex', alignItems: 'center', gap: '20px' },
  searchBar: { backgroundColor: '#2d6a4f', padding: '8px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', width: '220px' },
  searchInput: { backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
  statCard: { backgroundColor: '#ffffff', border: '1px solid #eee', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  cardLabel: { fontSize: '14px', color: '#666', margin: 0 },
  cardValue: { fontSize: '28px', margin: '5px 0', fontWeight: 'bold', color: '#1b4332' },
  largeGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' },
  largeCard: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '25px', minHeight: '300px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  placeholderList: { marginTop: '15px', fontSize: '14px', color: '#444', lineHeight: '2.5' }
};

export default TransaksiPetugas;