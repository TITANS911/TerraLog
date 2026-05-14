import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Search,
  Bell,
  User,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  ClipboardList,
  TrendingUp
} from 'lucide-react';

import AdminSidebar from '../AdminSidebar';

const API_URL = 'http://127.0.0.1:8080/api/transaksi';

const TransaksiManagement = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const fetchTransaksi = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.get(API_URL);
      setTransaksi(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Gagal mengambil data transaksi:', error);
      console.error('Response:', error.response);
      console.error('Message:', error.message);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Gagal mengambil data transaksi dari server.';

      setErrorMessage(message);
      Swal.fire('Error', message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const getNamaWarga = (item) => {
    return (
      item.namaWarga ||
      item.warga?.nama ||
      item.user?.nama ||
      item.nama ||
      '-'
    );
  };

  const getTanggal = (item) => {
    return (
      item.tanggal ||
      item.tanggalTransaksi ||
      item.createdAt ||
      item.waktu ||
      '-'
    );
  };

  const getAlamat = (item) => {
    return (
      item.alamat ||
      item.warga?.alamat ||
      item.user?.alamat ||
      '-'
    );
  };

  const getKategori = (item) => {
    return (
      item.kategoriSampah ||
      item.namaKategori ||
      item.kategori?.namaKategori ||
      item.kategori ||
      '-'
    );
  };

  const getBerat = (item) => {
    return (
      item.totalBerat ||
      item.berat ||
      item.jumlahKg ||
      item.totalKg ||
      0
    );
  };

  const filteredTransaksi = useMemo(() => {
    return transaksi.filter((item) => {
      const keyword = searchTerm.toLowerCase();

      return (
        getNamaWarga(item).toString().toLowerCase().includes(keyword) ||
        getTanggal(item).toString().toLowerCase().includes(keyword) ||
        getAlamat(item).toString().toLowerCase().includes(keyword) ||
        getKategori(item).toString().toLowerCase().includes(keyword) ||
        getBerat(item).toString().toLowerCase().includes(keyword)
      );
    });
  }, [transaksi, searchTerm]);

  const transaksiHariIni = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return transaksi.filter((item) => {
      const tanggal = getTanggal(item).toString();
      return tanggal.includes(today);
    }).length;
  }, [transaksi]);

  const totalPages = Math.ceil(filteredTransaksi.length / itemsPerPage) || 1;

  const paginatedTransaksi = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransaksi.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransaksi, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleExport = () => {
    if (filteredTransaksi.length === 0) {
      Swal.fire('Info', 'Tidak ada data transaksi untuk diexport.', 'info');
      return;
    }

    const header = ['No', 'Warga', 'Tanggal', 'Alamat', 'Kategori Sampah', 'Total Berat (kg)'];

    const rows = filteredTransaksi.map((item, index) => [
      index + 1,
      getNamaWarga(item),
      getTanggal(item),
      getAlamat(item),
      getKategori(item),
      getBerat(item)
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'data-transaksi-terralog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const startNumber = filteredTransaksi.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endNumber = Math.min(currentPage * itemsPerPage, filteredTransaksi.length);

  return (
    <div style={styles.container}>
      <AdminSidebar activeMenu="transaksi" />

      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <section style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>Data Transaksi</h1>
              <p style={styles.subtitle}>Kelola data transaksi TeraaLog.</p>
            </div>

            <div style={styles.headerRight}>
              <div style={styles.datePill}>12 Mei 2026</div>

              <button style={styles.circleButton}>
                <Bell size={22} color="#111" />
              </button>

              <button style={styles.circleButton}>
                <User size={22} color="#111" />
              </button>
            </div>
          </section>

          <section style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#39A96B' }}>
                <FileText size={26} color="#fff" />
              </div>

              <div>
                <h3 style={styles.statTitle}>Total Transaksi</h3>

                <div style={styles.statValueWrap}>
                  <span style={{ ...styles.statValue, color: '#39A96B' }}>
                    {transaksi.length}
                  </span>
                  <span style={styles.statUnit}>transaksi</span>
                </div>

                <div style={styles.statTrend}>
                  <TrendingUp size={16} color="#2DA86B" />
                  <span style={styles.trendText}>12,5%</span>
                  <span style={styles.trendSubtext}>dari bulan lalu</span>
                </div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: '#5B9CF6' }}>
                <ClipboardList size={26} color="#fff" />
              </div>

              <div>
                <h3 style={styles.statTitle}>Transaksi Hari Ini</h3>

                <div style={styles.statValueWrap}>
                  <span style={{ ...styles.statValue, color: '#5B9CF6' }}>
                    {transaksiHariIni}
                  </span>
                  <span style={styles.statUnit}>transaksi</span>
                </div>

                <div style={styles.statTrend}>
                  <TrendingUp size={16} color="#2DA86B" />
                  <span style={styles.trendText}>12,5%</span>
                  <span style={styles.trendSubtext}>dari kemarin</span>
                </div>
              </div>
            </div>
          </section>

          <section style={styles.searchSection}>
            <div style={styles.searchBox}>
              <Search size={18} color="#7D8490" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.totalText}>
              <span>Total:</span>
              <strong>{filteredTransaksi.length}</strong>
              <span>Transaksi</span>
            </div>
          </section>

          <div style={styles.actionRow}>
            <button style={styles.exportButton} onClick={handleExport}>
              <Download size={21} />
              Export
            </button>
          </div>

          <section style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '80px' }}>No</th>
                  <th style={styles.th}>Warga</th>
                  <th style={styles.th}>Tanggal</th>
                  <th style={styles.th}>Alamat</th>
                  <th style={styles.th}>Kategori Sampah</th>
                  <th style={styles.th}>Total Berat (kg)</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyCell}>
                      Memuat data transaksi...
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyCell}>
                      {errorMessage}
                    </td>
                  </tr>
                ) : paginatedTransaksi.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyCell}>
                      Data transaksi belum tersedia.
                    </td>
                  </tr>
                ) : (
                  paginatedTransaksi.map((item, index) => (
                    <tr key={item.idTransaksi || item.transaksiId || item.id || index} style={styles.tr}>
                      <td style={styles.td}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td style={styles.td}>{getNamaWarga(item)}</td>
                      <td style={styles.td}>{getTanggal(item)}</td>
                      <td style={styles.td}>{getAlamat(item)}</td>
                      <td style={styles.td}>{getKategori(item)}</td>
                      <td style={styles.td}>{getBerat(item)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          <section style={styles.footerRow}>
            <p style={styles.showingText}>
              Menampilkan <strong>{startNumber} - {endNumber}</strong> dari {filteredTransaksi.length} transaksi
            </p>

            <div style={styles.pagination}>
              <button
                style={styles.pageArrow}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={pageNumber}
                    style={{
                      ...styles.pageButton,
                      ...(currentPage === pageNumber ? styles.activePageButton : {})
                    }}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {totalPages > 4 && <span style={styles.pageDots}>...</span>}

              {totalPages > 3 && (
                <button
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === totalPages ? styles.activePageButton : {})
                  }}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              )}

              <button
                style={styles.pageArrow}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

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
    padding: '38px 48px 42px 48px',
    boxSizing: 'border-box'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: '42px'
  },

  pageTitle: {
    margin: '0 0 8px 0',
    fontSize: '40px',
    lineHeight: '1',
    fontWeight: '900',
    color: '#111'
  },

  subtitle: {
    margin: 0,
    fontSize: '18px',
    color: '#8A8A8A'
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },

  datePill: {
    width: '520px',
    height: '52px',
    backgroundColor: '#064D36',
    color: '#fff',
    borderRadius: '28px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '28px',
    boxSizing: 'border-box',
    fontSize: '16px',
    fontWeight: '600'
  },

  circleButton: {
    width: '44px',
    height: '44px',
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
    gridTemplateColumns: '260px 300px',
    gap: '28px',
    marginBottom: '28px'
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

  searchSection: {
    minHeight: '76px',
    borderRadius: '28px',
    backgroundColor: '#F3F8F6',
    border: '1px solid #DCE8E3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 42px 0 22px',
    boxSizing: 'border-box',
    marginBottom: '16px'
  },

  searchBox: {
    width: '360px',
    height: '42px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #D8DFDE',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 14px',
    boxSizing: 'border-box'
  },

  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '14px',
    color: '#6E7480',
    fontFamily: "'Poppins', sans-serif"
  },

  totalText: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    color: '#7B8494',
    fontSize: '14px'
  },

  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px'
  },

  exportButton: {
    width: '125px',
    height: '42px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#FFD21A',
    color: '#064D36',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    fontFamily: "'Poppins', sans-serif"
  },

  tableCard: {
    borderRadius: '25px',
    overflow: 'hidden',
    border: '1px solid #CDD8D5',
    backgroundColor: '#F7FBFA'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed'
  },

  th: {
    height: '62px',
    backgroundColor: '#064D36',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '800',
    textAlign: 'center',
    borderRight: '1px solid rgba(255,255,255,0.15)'
  },

  tr: {
    height: '66px',
    borderBottom: '1px solid #C7D1CF'
  },

  td: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#333',
    padding: '0 12px',
    borderRight: '1px solid #C7D1CF',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  emptyCell: {
    height: '330px',
    textAlign: 'center',
    color: '#8A8A8A',
    fontSize: '15px',
    backgroundColor: '#F7FBFA'
  },

  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px'
  },

  showingText: {
    margin: 0,
    color: '#7B8494',
    fontSize: '14px'
  },

  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px'
  },

  pageButton: {
    minWidth: '34px',
    height: '34px',
    borderRadius: '9px',
    border: '1px solid #DCE5E3',
    backgroundColor: '#fff',
    color: '#064D36',
    cursor: 'pointer',
    fontWeight: '700'
  },

  activePageButton: {
    backgroundColor: '#064D36',
    color: '#fff'
  },

  pageArrow: {
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    border: '1px solid #DCE5E3',
    backgroundColor: '#fff',
    color: '#7B8494',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  pageDots: {
    color: '#7B8494',
    fontWeight: '700'
  }
};

export default TransaksiManagement;