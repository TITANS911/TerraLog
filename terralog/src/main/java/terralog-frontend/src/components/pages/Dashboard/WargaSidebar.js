import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Home,
  Trash2,
  CalendarClock,
  History,
  BarChart3,
  Megaphone,
  LogOut
} from 'lucide-react';

import logoTerraLog from '../../../assets/logo-terralog.png';

const WargaSidebar = ({ activeMenu = 'dashboard' }) => {
  const navigate = useNavigate();

  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      icon: <Home size={26} />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      id: 'buang-sampah',
      icon: <Trash2 size={26} />,
      label: 'Buang Sampah',
      path: '/buang-sampah'
    },
    {
      id: 'jadwal',
      icon: <CalendarClock size={26} />,
      label: 'Jadwal Penjemputan',
      path: '/jadwal-penjemputan'
    },
    {
      id: 'riwayat',
      icon: <History size={26} />,
      label: 'Riwayat Setoran',
      path: '/riwayat-setoran'
    },
    {
      id: 'laporan',
      icon: <BarChart3 size={26} />,
      label: 'Laporan',
      path: '/laporan'
    },
    {
      id: 'pengaduan',
      icon: <Megaphone size={26} />,
      label: 'Pengaduan',
      path: '/pengaduan'
    }
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Mau keluar aplikasi?',
      text: 'Anda harus login kembali untuk masuk.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#064D36',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/login');
      }
    });
  };

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.logoWrapper}>
          <img src={logoTerraLog} alt="TerraLog" style={styles.logo} />
        </div>

        <div style={styles.divider}></div>

        <p style={styles.navigationText}>NAVIGATION</p>

        <nav style={styles.nav}>
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <div
                key={item.id}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.activeItem : {}),
                  ...(isHovered && !isActive ? styles.hoverItem : {})
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>
      </div>

      <div
        onClick={handleLogout}
        onMouseEnter={() => setIsLogoutHovered(true)}
        onMouseLeave={() => setIsLogoutHovered(false)}
        style={{
          ...styles.logoutItem,
          ...(isLogoutHovered ? styles.logoutHover : {})
        }}
      >
        <LogOut size={24} />
        <span>Keluar</span>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '270px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#064D36',
    color: '#fff',
    padding: '28px 25px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 1000,
    fontFamily: "'Poppins', sans-serif"
  },

  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: '24px'
  },

  logo: {
    width: '190px',
    height: 'auto',
    objectFit: 'contain',
    display: 'block'
  },

  divider: {
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    marginBottom: '30px'
  },

  navigationText: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '0 0 18px 0'
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },

  navItem: {
    minHeight: '52px',
    padding: '0 18px',
    borderRadius: '28px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
    transition: '0.25s ease',
    fontSize: '16px',
    fontWeight: '600'
  },

  activeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)'
  },

  hoverItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(4px)'
  },

  logoutItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '0 18px',
    minHeight: '50px',
    borderRadius: '28px',
    cursor: 'pointer',
    transition: '0.25s ease',
    fontSize: '16px',
    fontWeight: '600'
  },

  logoutHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(4px)'
  }
};

export default WargaSidebar;