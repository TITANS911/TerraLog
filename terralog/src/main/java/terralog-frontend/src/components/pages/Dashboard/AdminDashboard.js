import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  Search,
  Bell,
  User,
  Users,
  UserCog,
  FileText,
  Trash2,
  TrendingUp,
  MapPin,
  Truck,
  Package,
  ChevronRight
} from 'lucide-react';

import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  const userName = localStorage.getItem('nama') || 'Admin';

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('admin-dashboard-toast');

    if (!alreadyShown) {
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

      sessionStorage.setItem('admin-dashboard-toast', 'true');
    }
  }, [userName]);

  const statsData = [
    {
      title: 'Total Warga',
      value: '5',
      unit: 'orang',
      icon: <Users size={26} />,
      iconBg: '#38B46A',
      valueColor: '#38B46A'
    },
    {
      title: 'Total Petugas',
      value: '2',
      unit: 'orang',
      icon: <UserCog size={26} />,
      iconBg: '#5B9CF6',
      valueColor: '#5B9CF6'
    },
    {
      title: 'Total Transaksi',
      value: '5',
      unit: 'transaksi',
      icon: <FileText size={26} />,
      iconBg: '#FF9F43',
      valueColor: '#FF9F43'
    },
    {
      title: 'Total Sampah',
      value: '10',
      unit: 'kg',
      icon: <Trash2 size={26} />,
      iconBg: '#9B7FE8',
      valueColor: '#9B7FE8'
    }
  ];

  const pickupData = [
    { status: 'Berlangsung', color: '#BDEFD0', textColor: '#2B8C4C', iconColor: '#5B9CF6' },
    { status: 'Berlangsung', color: '#BDEFD0', textColor: '#2B8C4C', iconColor: '#5B9CF6' },
    { status: 'Menunggu', color: '#FFF0B8', textColor: '#A6851A', iconColor: '#36A36F' },
    { status: 'Menunggu', color: '#FFF0B8', textColor: '#A6851A', iconColor: '#36A36F' },
    { status: 'Selesai', color: '#E5E5E5', textColor: '#6F7680', iconColor: '#7B7E8C' }
  ];

  const complaintData = [
    { status: 'Baru', color: '#FFC5C5', textColor: '#C92525', iconColor: '#FF1313' },
    { status: 'Diproses', color: '#FFF0B8', textColor: '#A6851A', iconColor: '#FFD21A' },
    { status: 'Selesai', color: '#BDEFD0', textColor: '#2B8C4C', iconColor: '#2DA06D' }
  ];

  return (
    <div style={styles.container}>
      <AdminSidebar activeMenu="dashboard" />

      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <section style={styles.topSection}>
            <div>
              <h1 style={styles.pageTitle}>
                Halo, <span style={styles.greenText}>{userName}!</span>
              </h1>
              <p style={styles.subtitle}>
                Kelola seluruh sistem TerraLog secara terorganisir.
              </p>
            </div>

            <div style={styles.topActions}>
              <div style={styles.datePill}>12 Mei 2026</div>

              <div style={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search..."
                  style={styles.searchInput}
                />
                <Search size={24} color="#111" />
              </div>

              <button style={styles.circleButton}>
                <Bell size={22} color="#111" />
              </button>

              <button style={styles.circleButton}>
                <User size={22} color="#111" />
              </button>
            </div>
          </section>

          <section style={styles.statsGrid}>
            {statsData.map((item) => (
              <StatCard key={item.title} item={item} />
            ))}
          </section>

          <section style={styles.middleGrid}>
            <div style={styles.cardLarge}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Peta Lokasi TPS</h3>
              </div>

              <div style={styles.mapBox}>
                <div style={styles.mapFake}>
                  <div style={styles.mapLineHorizontal}></div>
                  <div style={styles.mapLineVertical}></div>
                  <MapPin size={46} color="#C8340E" style={styles.mapPin} />
                  <div style={styles.zoomControl}>
                    <button style={styles.zoomButton}>+</button>
                    <button style={styles.zoomButton}>−</button>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.cardLarge}>
              <div style={styles.cardHeaderPickup}>
                <h3 style={styles.cardTitle}>Lokasi Pengambilan Hari Ini</h3>
                <span style={styles.locationBadge}>5 lokasi</span>
              </div>

              <div style={styles.pickupList}>
                {pickupData.map((item, index) => (
                  <PickupItem key={index} item={item} />
                ))}
              </div>
            </div>
          </section>

          <section style={styles.bottomGrid}>
            <div style={styles.cardLarge}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Statistik Sampah</h3>
              </div>

              <div style={styles.chartContent}>
                <div style={styles.donutChart}>
                  <div style={styles.donutCenter}>
                    <strong>Total</strong>
                    <span>4.453 kg</span>
                  </div>
                </div>

                <div style={styles.legendList}>
                  <LegendItem color="#5B9CF6" label="Organik" value="3.125 kg (35.7 %)" />
                  <LegendItem color="#FFD21A" label="Sampah Plastik" value="200 kg (20 %)" />
                  <LegendItem color="#9B59F6" label="Organik" value="150 kg (18 %)" />
                  <LegendItem color="#00543C" label="Sampah Plastik" value="150 kg (18 %)" />
                  <LegendItem color="#FF1313" label="Sampah Plastik" value="25 kg (2 %)" />
                </div>
              </div>
            </div>

            <div style={styles.cardLarge}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Pengaduan Terbaru</h3>
              </div>

              <div style={styles.complaintList}>
                {complaintData.map((item, index) => (
                  <ComplaintItem key={index} item={item} />
                ))}
              </div>

              <div style={styles.seeAllComplaint}>
                <span>Lihat Semua Pengaduan</span>
                <ChevronRight size={18} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ item }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, backgroundColor: item.iconBg }}>
      {React.cloneElement(item.icon, { color: '#fff' })}
    </div>

    <div>
      <h3 style={styles.statTitle}>{item.title}</h3>

      <div style={styles.statValueWrap}>
        <span style={{ ...styles.statValue, color: item.valueColor }}>
          {item.value}
        </span>
        <span style={styles.statUnit}>{item.unit}</span>
      </div>

      <div style={styles.statTrend}>
        <TrendingUp size={16} color="#2DA86B" />
        <span style={styles.trendText}>12,5%</span>
        <span style={styles.trendSubtext}>dari bulan lalu</span>
      </div>
    </div>
  </div>
);

const PickupItem = ({ item }) => (
  <div style={styles.pickupItem}>
    <div style={{ ...styles.pickupIcon, backgroundColor: `${item.iconColor}22` }}>
      <Truck size={28} color={item.iconColor} />
    </div>

    <div style={styles.pickupText}>
      <strong>Perumahan Cisitu Indah</strong>
      <span>Kec. Coblong</span>
    </div>

    <span
      style={{
        ...styles.statusBadge,
        backgroundColor: item.color,
        color: item.textColor
      }}
    >
      {item.status}
    </span>
  </div>
);

const ComplaintItem = ({ item }) => (
  <div style={styles.complaintItem}>
    <div style={{ ...styles.complaintIcon, backgroundColor: item.iconColor }}>
      <Package size={28} color="#fff" />
    </div>

    <div style={styles.complaintText}>
      <strong>Sampah menumpuk di sekitar TPS</strong>
      <span>Perumahan Cisitu Indah</span>
    </div>

    <span
      style={{
        ...styles.complaintBadge,
        backgroundColor: item.color,
        color: item.textColor
      }}
    >
      {item.status}
    </span>
  </div>
);

const LegendItem = ({ color, label, value }) => (
  <div style={styles.legendItem}>
    <span style={{ ...styles.legendDot, backgroundColor: color }}></span>
    <span style={styles.legendLabel}>{label}</span>
    <strong style={styles.legendValue}>{value}</strong>
  </div>
);

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#064D36',
    fontFamily: "'Poppins', sans-serif"
  },

  main: {
    marginLeft: '270px',
    minHeight: '100vh',
    padding: '24px 24px 24px 0',
    boxSizing: 'border-box'
  },

  contentWrapper: {
    minHeight: 'calc(100vh - 48px)',
    backgroundColor: '#fff',
    borderRadius: '38px 38px 38px 38px',
    padding: '34px 40px 40px 40px',
    boxSizing: 'border-box'
  },

  topSection: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '25px',
    marginBottom: '28px'
  },

  pageTitle: {
    fontSize: '38px',
    lineHeight: '1',
    margin: '0 0 12px 0',
    color: '#111',
    fontWeight: '900'
  },

  greenText: {
    color: '#064D36'
  },

  subtitle: {
    margin: 0,
    fontSize: '17px',
    color: '#8A8A8A',
    fontWeight: '400'
  },

  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'nowrap'
  },

  datePill: {
    width: '360px',
    height: '44px',
    backgroundColor: '#064D36',
    color: '#fff',
    borderRadius: '25px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '28px',
    boxSizing: 'border-box',
    fontSize: '15px',
    fontWeight: '600'
  },

  searchBox: {
    width: '220px',
    height: '44px',
    borderRadius: '25px',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 14px 0 20px',
    boxSizing: 'border-box'
  },

  searchInput: {
    border: 'none',
    outline: 'none',
    width: '150px',
    fontSize: '12px',
    color: '#777'
  },

  circleButton: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '26px',
    marginBottom: '26px'
  },

  statCard: {
    minHeight: '126px',
    backgroundColor: '#fff',
    borderRadius: '24px',
    border: '1px solid #E5E5E5',
    boxShadow: '0 2px 0 rgba(0,0,0,0.25)',
    padding: '22px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },

  statIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  statTitle: {
    margin: '3px 0 8px 0',
    fontSize: '18px',
    color: '#111',
    fontWeight: '800'
  },

  statValueWrap: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '6px',
    marginBottom: '12px'
  },

  statValue: {
    fontSize: '40px',
    lineHeight: '0.85',
    fontWeight: '900'
  },

  statUnit: {
    fontSize: '15px',
    color: '#777',
    fontWeight: '600'
  },

  statTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '12px'
  },

  trendText: {
    color: '#2DA86B',
    fontWeight: '700'
  },

  trendSubtext: {
    color: '#7D7D7D'
  },

  middleGrid: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 1fr',
    gap: '24px',
    marginBottom: '26px'
  },

  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 1fr',
    gap: '24px'
  },

  cardLarge: {
    backgroundColor: '#fff',
    border: '1px solid #DDDDDD',
    borderRadius: '24px',
    boxShadow: '0 2px 0 rgba(0,0,0,0.25)',
    overflow: 'hidden'
  },

  cardHeader: {
    height: '43px',
    borderBottom: '1px solid #DDDDDD',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px'
  },

  cardHeaderPickup: {
    height: '43px',
    borderBottom: '1px solid #DDDDDD',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 22px 0 24px'
  },

  cardTitle: {
    margin: 0,
    fontSize: '15px',
    color: '#111',
    fontWeight: '800'
  },

  locationBadge: {
    minWidth: '110px',
    height: '26px',
    backgroundColor: '#EEEAFE',
    color: '#7B2CFF',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '800'
  },

  mapBox: {
    padding: '8px 14px 14px 14px'
  },

  mapFake: {
    height: '305px',
    borderRadius: '4px',
    backgroundColor: '#EEF5F7',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #DCE4E7'
  },

  mapLineHorizontal: {
    position: 'absolute',
    top: '42%',
    left: '-20px',
    width: '120%',
    height: '12px',
    backgroundColor: '#D6E8EF',
    transform: 'rotate(-15deg)'
  },

  mapLineVertical: {
    position: 'absolute',
    top: '-20px',
    left: '50%',
    width: '13px',
    height: '120%',
    backgroundColor: '#D6E8EF',
    transform: 'rotate(18deg)'
  },

  mapPin: {
    position: 'absolute',
    top: '43%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },

  zoomControl: {
    position: 'absolute',
    right: '15px',
    bottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },

  zoomButton: {
    width: '30px',
    height: '28px',
    border: '1px solid #D2D2D2',
    backgroundColor: '#fff',
    fontSize: '18px',
    cursor: 'pointer'
  },

  pickupList: {
    padding: '8px 12px 14px 12px'
  },

  pickupItem: {
    height: '58px',
    borderBottom: '1px solid #D9D9D9',
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },

  pickupIcon: {
    width: '62px',
    height: '42px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  pickupText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },

  pickupTextStrong: {},

  statusBadge: {
    minWidth: '110px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600'
  },

  chartContent: {
    minHeight: '240px',
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    alignItems: 'center',
    gap: '10px',
    padding: '24px 32px'
  },

  donutChart: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background:
      'conic-gradient(#5B9CF6 0deg 105deg, #FFD21A 105deg 165deg, #00543C 165deg 225deg, #FF1313 225deg 275deg, #9B59F6 275deg 360deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },

  donutCenter: {
    width: '98px',
    height: '98px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    color: '#111',
    fontWeight: '800'
  },

  legendList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },

  legendItem: {
    display: 'grid',
    gridTemplateColumns: '16px 1fr auto',
    gap: '16px',
    alignItems: 'center',
    fontSize: '13px'
  },

  legendDot: {
    width: '11px',
    height: '11px',
    borderRadius: '50%'
  },

  legendLabel: {
    fontWeight: '700'
  },

  legendValue: {
    fontWeight: '900'
  },

  complaintList: {
    padding: '8px 12px 0 12px'
  },

  complaintItem: {
    height: '58px',
    borderBottom: '1px solid #D9D9D9',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  complaintIcon: {
    width: '64px',
    height: '42px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  complaintText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },

  complaintBadge: {
    minWidth: '110px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600'
  },

  seeAllComplaint: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    color: '#064D36',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer'
  }
};

export default AdminDashboard;