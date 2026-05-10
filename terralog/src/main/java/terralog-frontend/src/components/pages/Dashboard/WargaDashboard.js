import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Send, Clock, History, 
  MapPin, Bell, Search, LogOut, User, PlusCircle 
} from 'lucide-react';

const WargaDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('nama') || 'Warga';
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // Alert sambutan ramah untuk warga
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
      title: `Halo, ${userName}!`,
      text: 'Selamat datang di layanan TerraLog.'
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

  const menuItems = [
    { id: 'dash', icon: <LayoutDashboard size={20} />, label: 'Beranda' },
    { id: 'lapor', icon: <Send size={20} />, label: 'Lapor Sampah' },
    { id: 'jadwal', icon: <Clock size={20} />, label: 'Jadwal Saya' },
    { id: 'riwayat', icon: <History size={20} />, label: 'Riwayat Laporan' },
    { id: 'lokasi', icon: <MapPin size={20} />, label: 'Lokasi TPS' },
  ];

  return (
    <div style={styles.container}>
      {/* --- SIDEBAR --- */}
      <aside style={styles.sidebar}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={styles.logo}>TerraLog</h2>
          <span style={styles.badge}>WARGA</span>
        </div>
        
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <div 
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
            <div style={{fontSize: '10px', opacity: 0.8}}>RT 001 / RW 023</div>
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
              <input type="text" placeholder="Cari info sampah..." style={styles.searchInput} />
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div style={styles.welcomeBox}>
          <div>
            <h1 style={{margin: 0, fontSize: '24px'}}>Halo, {userName}! 👋</h1>
            <p style={{margin: '10px 0 0 0', opacity: 0.9}}>Sampah di rumah sudah menumpuk? Yuk, buat laporan penjemputan sekarang.</p>
          </div>
          <button style={styles.mainButton}>
            <PlusCircle size={20} /> Buat Laporan
          </button>
        </div>

        {/* Summary Cards */}
        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.cardLabel}>Laporan Aktif</p>
            <h3 style={styles.cardValue}>1</h3>
            <span style={{color: '#2d6a4f', fontSize: '12px'}}>Status: Menunggu</span>
          </div>
          <div style={styles.statCard}>
            <p style={styles.cardLabel}>Penjemputan Terdekat</p>
            <h3 style={{...styles.cardValue, fontSize: '20px'}}>Besok, 08:00</h3>
            <span style={{color: '#666', fontSize: '12px'}}>Oleh: Petugas Budi</span>
          </div>
          <div style={styles.statCard}>
            <p style={styles.cardLabel}>Total Laporan Selesai</p>
            <h3 style={styles.cardValue}>24</h3>
            <span style={{color: '#2d6a4f', fontSize: '12px'}}>Bulan ini: 4 kali</span>
          </div>
        </section>

        {/* Info & Activity */}
        <section style={styles.largeGrid}>
          <div style={styles.largeCard}>
            <h3>Aktivitas Terakhir</h3>
            <div style={styles.placeholderList}>
              <div style={styles.activityRow}>
                <div style={styles.statusDot}></div>
                <span>Laporan sampah plastik selesai dijemput</span>
                <small style={{marginLeft: 'auto', color: '#999'}}>Kemarin</small>
              </div>
              <div style={styles.activityRow}>
                <div style={styles.statusDot}></div>
                <span>Laporan baru berhasil dikirim</span>
                <small style={{marginLeft: 'auto', color: '#999'}}>3 hari lalu</small>
              </div>
            </div>
          </div>
          <div style={styles.largeCard}>
            <h3>Tips Minggu Ini</h3>
            <div style={{...styles.placeholderList, fontStyle: 'italic', color: '#555'}}>
              "Jangan lupa pisahkan sampah organik dan anorganik untuk mempermudah petugas kami ya!"
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
  header: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
  headerIcons: { display: 'flex', alignItems: 'center', gap: '20px' },
  searchBar: { backgroundColor: '#2d6a4f', padding: '8px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', width: '220px' },
  searchInput: { backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14px' },
  
  welcomeBox: { 
    backgroundColor: '#1b4332', 
    color: '#fff', 
    padding: '30px', 
    borderRadius: '20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: '30px',
    boxShadow: '0 10px 20px rgba(27, 67, 50, 0.2)'
  },
  mainButton: { 
    backgroundColor: '#fff', 
    color: '#1b4332', 
    border: 'none', 
    padding: '12px 20px', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    cursor: 'pointer' 
  },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
  statCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '15px', border: '1px solid #eee' },
  cardLabel: { fontSize: '14px', color: '#666', margin: 0 },
  cardValue: { fontSize: '28px', margin: '5px 0', fontWeight: 'bold', color: '#1b4332' },
  
  largeGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' },
  largeCard: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '25px', minHeight: '200px', border: '1px solid #eee' },
  placeholderList: { marginTop: '15px' },
  activityRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '14px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2d6a4f' }
};

export default WargaDashboard;