import React, { useMemo, useState } from 'react';
import {
  Search,
  Bell,
  User,
  Users,
  ClipboardList,
  TrendingUp,
  ChevronDown
} from 'lucide-react';

import AdminSidebar from '../AdminSidebar';

const monthlyTrend = [
  { month: 'Jan', value: 450 },
  { month: 'Feb', value: 600 },
  { month: 'Mar', value: 520 },
  { month: 'Apr', value: 850 },
  { month: 'May', value: 780 },
  { month: 'Jun', value: 1100 },
  { month: 'Jul', value: 950 },
  { month: 'Aug', value: 1200 }
];

const wasteStats = [
  { color: '#5B9CF6', label: 'Organik', value: '3.125 kg (35.7 %)' },
  { color: '#FFD21A', label: 'Sampah Plastik', value: '200 kg (20 %)' },
  { color: '#9B59F6', label: 'Organik', value: '150 kg (18 %)' },
  { color: '#00543C', label: 'Sampah Plastik', value: '150 kg (18 %)' },
  { color: '#FF1313', label: 'Sampah Plastik', value: '25 kg (2 %)' }
];

const LaporanStatistik = () => {
  const [periode, setPeriode] = useState('Mei 2026');
  const [periodeBanding, setPeriodeBanding] = useState('April 2026');
  const [jenisSampah, setJenisSampah] = useState('Anorganik');

  const maxValue = useMemo(() => {
    return Math.max(...monthlyTrend.map((item) => item.value));
  }, []);

  const points = useMemo(() => {
    const width = 520;
    const height = 240;

    return monthlyTrend.map((item, index) => {
      const x = (index / (monthlyTrend.length - 1)) * width;
      const y = height - (item.value / maxValue) * height;

      return {
        ...item,
        x,
        y
      };
    });
  }, [maxValue]);

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} 240 L ${points[0].x} 240 Z`;

  return (
    <div style={styles.container}>
      <AdminSidebar activeMenu="laporan" />

      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <section style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>Laporan & Statistik</h1>
              <p style={styles.subtitle}>Pantau kinerja TerraLog dalam berbagai periode.</p>
            </div>

            <div style={styles.headerRight}>
              <div style={styles.searchBoxTop}>
                <input type="text" placeholder="Search..." style={styles.searchInputTop} />
                <Search size={26} color="#111" />
              </div>

              <button style={styles.circleButton}>
                <Bell size={22} color="#111" />
              </button>

              <button style={styles.circleButton}>
                <User size={22} color="#111" />
              </button>
            </div>
          </section>

          <section style={styles.filterSection}>
            <FilterSelect
              label="Pilih Periode"
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              options={['Mei 2026', 'April 2026', 'Maret 2026', 'Februari 2026']}
            />

            <FilterSelect
              label="Periode Perbandingan"
              value={periodeBanding}
              onChange={(e) => setPeriodeBanding(e.target.value)}
              options={['April 2026', 'Maret 2026', 'Februari 2026', 'Januari 2026']}
            />

            <FilterSelect
              label="Jenis Sampah"
              value={jenisSampah}
              onChange={(e) => setJenisSampah(e.target.value)}
              options={['Anorganik', 'Organik', 'Plastik', 'Kertas', 'Kaca', 'Metal']}
            />
          </section>

          <section style={styles.statsGrid}>
            <StatCard
              icon={<Users size={28} />}
              iconBg="#39A96B"
              title="Sampah Terkumpul"
              value="50"
              unit="kg"
              valueColor="#39A96B"
              trendText="dari bulan lalu"
            />

            <StatCard
              icon={<ClipboardList size={28} />}
              iconBg="#5B9CF6"
              title="Total Transaksi"
              value="2"
              unit="transaksi"
              valueColor="#5B9CF6"
              trendText="dari bulan lalu"
            />

            <StatCard
              icon={<ClipboardList size={28} />}
              iconBg="#FF9F43"
              title="Warga Aktif"
              value="5"
              unit="orang"
              valueColor="#FF9F43"
              trendText="dari bulan lalu"
            />
          </section>

          <section style={styles.chartCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                Tren Sampah Terkumpul <span style={styles.grayText}>(kg)</span>
              </h3>
            </div>

            <div style={styles.lineChartWrapper}>
              <div style={styles.yAxis}>
                {[1200, 1000, 800, 600, 400, 200, 0].map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>

              <div style={styles.chartArea}>
                <svg width="100%" height="280" viewBox="0 0 560 280" preserveAspectRatio="none">
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <line
                      key={line}
                      x1="0"
                      y1={line * 45}
                      x2="560"
                      y2={line * 45}
                      stroke="#EEF2F1"
                      strokeWidth="1"
                    />
                  ))}

                  {monthlyTrend.map((_, index) => (
                    <line
                      key={index}
                      x1={index * 80}
                      y1="0"
                      x2={index * 80}
                      y2="250"
                      stroke="#EEF2F1"
                      strokeWidth="1"
                    />
                  ))}

                  <path
                    d={areaPath}
                    fill="rgba(6, 77, 54, 0.12)"
                    transform="translate(20, 10)"
                  />

                  <path
                    d={linePath}
                    fill="none"
                    stroke="#064D36"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(20, 10)"
                  />

                  {points.map((point) => (
                    <circle
                      key={point.month}
                      cx={point.x + 20}
                      cy={point.y + 10}
                      r="5"
                      fill="#064D36"
                    />
                  ))}
                </svg>

                <div style={styles.xAxis}>
                  {monthlyTrend.map((item) => (
                    <span key={item.month}>{item.month}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section style={styles.statistikCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Statistik Sampah</h3>
            </div>

            <div style={styles.donutContent}>
              <div style={styles.donutChart}>
                <div style={styles.donutCenter}>
                  <strong>Total</strong>
                  <span>4.453 kg</span>
                </div>
              </div>

              <div style={styles.legendList}>
                {wasteStats.map((item, index) => (
                  <LegendItem key={index} item={item} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options }) => (
  <div style={styles.filterItem}>
    <label style={styles.filterLabel}>{label}</label>

    <div style={styles.selectWrapper}>
      <select value={value} onChange={onChange} style={styles.select}>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <ChevronDown size={18} color="#7D8490" style={styles.chevronIcon} />
    </div>
  </div>
);

const StatCard = ({ icon, iconBg, title, value, unit, valueColor, trendText }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, backgroundColor: iconBg }}>
      {React.cloneElement(icon, { color: '#fff' })}
    </div>

    <div>
      <h3 style={styles.statTitle}>{title}</h3>

      <div style={styles.statValueWrap}>
        <span style={{ ...styles.statValue, color: valueColor }}>{value}</span>
        <span style={styles.statUnit}>{unit}</span>
      </div>

      <div style={styles.statTrend}>
        <TrendingUp size={16} color="#2DA86B" />
        <span style={styles.trendText}>12,5%</span>
        <span style={styles.trendSubtext}>{trendText}</span>
      </div>
    </div>
  </div>
);

const LegendItem = ({ item }) => (
  <div style={styles.legendItem}>
    <span style={{ ...styles.legendDot, backgroundColor: item.color }}></span>
    <span style={styles.legendLabel}>{item.label}</span>
    <strong style={styles.legendValue}>{item.value}</strong>
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
    borderRadius: '38px',
    padding: '36px 40px 42px 40px',
    boxSizing: 'border-box'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: '28px'
  },

  pageTitle: {
    margin: '0 0 10px 0',
    fontSize: '38px',
    lineHeight: '1',
    fontWeight: '900',
    color: '#111'
  },

  subtitle: {
    margin: 0,
    fontSize: '17px',
    color: '#8A8A8A'
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },

  searchBoxTop: {
    width: '230px',
    height: '42px',
    backgroundColor: '#fff',
    borderRadius: '24px',
    border: '1px solid #E5E5E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px 0 18px',
    boxSizing: 'border-box'
  },

  searchInputTop: {
    border: 'none',
    outline: 'none',
    width: '160px',
    fontSize: '12px',
    color: '#777',
    fontFamily: "'Poppins', sans-serif"
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

  filterSection: {
    minHeight: '76px',
    borderRadius: '26px',
    backgroundColor: '#F3F8F6',
    border: '1px solid #DCE8E3',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    boxSizing: 'border-box',
    marginBottom: '32px'
  },

  filterItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  filterLabel: {
    color: '#7B8494',
    fontSize: '12px'
  },

  selectWrapper: {
    width: '170px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    border: '1px solid #DEE6E4',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },

  select: {
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    appearance: 'none',
    backgroundColor: 'transparent',
    padding: '0 34px 0 14px',
    fontSize: '13px',
    color: '#064D36',
    fontFamily: "'Poppins', sans-serif"
  },

  chevronIcon: {
    position: 'absolute',
    right: '10px',
    pointerEvents: 'none'
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '260px 290px 290px',
    gap: '28px',
    marginBottom: '34px'
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

  chartCard: {
    width: '610px',
    border: '1px solid #D5D5D5',
    borderRadius: '22px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
    marginBottom: '34px'
  },

  cardHeader: {
    height: '44px',
    borderBottom: '1px solid #D5D5D5',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    boxSizing: 'border-box'
  },

  cardTitle: {
    margin: 0,
    fontSize: '15px',
    color: '#111',
    fontWeight: '800'
  },

  grayText: {
    color: '#777',
    fontWeight: '500'
  },

  lineChartWrapper: {
    display: 'flex',
    padding: '38px 28px 28px 28px'
  },

  yAxis: {
    width: '48px',
    height: '280px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#6F7680'
  },

  chartArea: {
    flex: 1,
    position: 'relative'
  },

  xAxis: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 15px',
    marginTop: '-8px',
    color: '#6F7680',
    fontSize: '11px'
  },

  statistikCard: {
    width: '610px',
    border: '1px solid #D5D5D5',
    borderRadius: '22px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 2px 0 rgba(0,0,0,0.2)'
  },

  donutContent: {
    minHeight: '240px',
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    alignItems: 'center',
    gap: '12px',
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
  }
};

export default LaporanStatistik;