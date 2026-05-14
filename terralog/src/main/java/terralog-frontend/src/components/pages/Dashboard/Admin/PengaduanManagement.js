import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Search,
  Bell,
  User,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import AdminSidebar from '../AdminSidebar';

const API_URL = 'http://127.0.0.1:8080/api/pengaduan';

const PengaduanManagement = () => {
  const [pengaduan, setPengaduan] = useState([]);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const fetchPengaduan = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.get(API_URL);
      const data = Array.isArray(response.data) ? response.data : [];

      setPengaduan(data);
      setSelectedPengaduan(data[0] || null);
    } catch (error) {
      console.error('Gagal mengambil data pengaduan:', error);
      console.error('Response:', error.response);
      console.error('Message:', error.message);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Gagal mengambil data pengaduan dari server.';

      setErrorMessage(message);
      Swal.fire('Error', message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const getId = (item) => {
    return item.idPengaduan || item.pengaduanId || item.id || item.idLaporan;
  };

  const getPelapor = (item) => {
    return (
      item.pelapor ||
      item.namaPelapor ||
      item.namaWarga ||
      item.warga?.nama ||
      item.user?.nama ||
      item.nama ||
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

  const getKeterangan = (item) => {
    return (
      item.keterangan ||
      item.judulPengaduan ||
      item.judul ||
      item.kategori ||
      'Pengaduan Sampah'
    );
  };

  const getStatus = (item) => {
    return (
      item.status ||
      item.statusPengaduan ||
      'PROSES'
    );
  };

  const getTanggal = (item) => {
    return (
      item.tanggal ||
      item.tanggalPengaduan ||
      item.createdAt ||
      '-'
    );
  };

  const getIsiPengaduan = (item) => {
    return (
      item.isiPengaduan ||
      item.deskripsi ||
      item.pesan ||
      item.keluhan ||
      item.keterangan ||
      '-'
    );
  };

  const filteredPengaduan = useMemo(() => {
    return pengaduan.filter((item) => {
      const keyword = searchTerm.toLowerCase();

      return (
        getPelapor(item).toString().toLowerCase().includes(keyword) ||
        getAlamat(item).toString().toLowerCase().includes(keyword) ||
        getKeterangan(item).toString().toLowerCase().includes(keyword) ||
        getStatus(item).toString().toLowerCase().includes(keyword)
      );
    });
  }, [pengaduan, searchTerm]);

  const totalPages = Math.ceil(filteredPengaduan.length / itemsPerPage) || 1;

  const paginatedPengaduan = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPengaduan.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPengaduan, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDetail = (item) => {
    setSelectedPengaduan(item);
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!selectedPengaduan) {
      Swal.fire('Info', 'Pilih pengaduan terlebih dahulu.', 'info');
      return;
    }

    if (!replyText.trim()) {
      Swal.fire('Info', 'Isi balasan terlebih dahulu.', 'info');
      return;
    }

    const id = getId(selectedPengaduan);

    try {
      await axios.put(`${API_URL}/${id}`, {
        ...selectedPengaduan,
        balasan: replyText,
        status: 'DIPROSES'
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Balasan pengaduan berhasil dikirim.',
        confirmButtonColor: '#064D36'
      });

      setReplyText('');
      fetchPengaduan();
    } catch (error) {
      console.error('Gagal mengirim balasan:', error);
      Swal.fire('Gagal', 'Balasan gagal dikirim. Cek endpoint backend.', 'error');
    }
  };

  const getStatusStyle = (status) => {
    const value = status?.toString().toUpperCase();

    if (value === 'SELESAI') {
      return {
        backgroundColor: '#BDEFD0',
        color: '#1F8D4D'
      };
    }

    if (value === 'MENUNGGU' || value === 'BARU') {
      return {
        backgroundColor: '#FFD2D2',
        color: '#D92626'
      };
    }

    return {
      backgroundColor: '#FFF0B8',
      color: '#A6851A'
    };
  };

  const startNumber = filteredPengaduan.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endNumber = Math.min(currentPage * itemsPerPage, filteredPengaduan.length);

  return (
    <div style={styles.container}>
      <AdminSidebar activeMenu="pengaduan" />

      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <section style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>Pengaduan</h1>
              <p style={styles.subtitle}>Kelola pengaduan TerraLog.</p>
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

          <section style={styles.searchSection}>
            <div style={styles.searchBox}>
              <Search size={18} color="#7D8490" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama warga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </section>

          <section style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '80px' }}>No</th>
                  <th style={styles.th}>Pelapor</th>
                  <th style={styles.th}>Alamat</th>
                  <th style={styles.th}>Keterangan</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, width: '160px' }}>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyCell}>
                      Memuat data pengaduan...
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyCell}>
                      {errorMessage}
                    </td>
                  </tr>
                ) : paginatedPengaduan.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyCell}>
                      Data pengaduan belum tersedia.
                    </td>
                  </tr>
                ) : (
                  paginatedPengaduan.map((item, index) => {
                    const status = getStatus(item);

                    return (
                      <tr key={getId(item) || index} style={styles.tr}>
                        <td style={styles.td}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                        <td style={styles.td}>{getPelapor(item)}</td>
                        <td style={styles.td}>{getAlamat(item)}</td>
                        <td style={styles.td}>{getKeterangan(item)}</td>

                        <td style={styles.td}>
                          <span style={{ ...styles.statusBadge, ...getStatusStyle(status) }}>
                            {status}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <button
                            style={styles.detailButton}
                            onClick={() => handleDetail(item)}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>

          <section style={styles.footerRow}>
            <p style={styles.showingText}>
              Menampilkan <strong>{startNumber} - {endNumber}</strong> dari {filteredPengaduan.length} pengaduan
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

          <section style={styles.detailCard}>
            <div style={styles.detailHeader}>Detail Pengaduan</div>

            <div style={styles.detailBody}>
              <p style={styles.detailText}>
                <strong>Nama Warga:</strong> {selectedPengaduan ? getPelapor(selectedPengaduan) : '-'}
              </p>

              <p style={styles.detailText}>
                <strong>Tanggal:</strong> {selectedPengaduan ? getTanggal(selectedPengaduan) : '-'}
              </p>

              <p style={styles.detailText}>
                <strong>Judul Pengaduan:</strong> {selectedPengaduan ? getKeterangan(selectedPengaduan) : '-'}
              </p>

              <div style={styles.messageBox}>
                {selectedPengaduan ? getIsiPengaduan(selectedPengaduan) : 'Pilih pengaduan untuk melihat detail.'}
              </div>

              <div style={styles.replyBox}>
                <input
                  type="text"
                  placeholder="Kirim balasan..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={styles.replyInput}
                />

                <button style={styles.sendButton} onClick={handleSendReply}>
                  <Send size={24} color="#064D36" />
                </button>
              </div>
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
    padding: '32px 40px 42px 40px',
    boxSizing: 'border-box'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: '34px'
  },

  pageTitle: {
    margin: '0 0 8px 0',
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

  datePill: {
    width: '520px',
    height: '44px',
    backgroundColor: '#064D36',
    color: '#fff',
    borderRadius: '28px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '28px',
    boxSizing: 'border-box',
    fontSize: '14px',
    fontWeight: '600'
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

  searchSection: {
    minHeight: '64px',
    borderRadius: '24px',
    backgroundColor: '#F3F8F6',
    border: '1px solid #DCE8E3',
    display: 'flex',
    alignItems: 'center',
    padding: '0 22px',
    boxSizing: 'border-box',
    marginBottom: '24px'
  },

  searchBox: {
    width: '330px',
    height: '36px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    border: '1px solid #D8DFDE',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 13px',
    boxSizing: 'border-box'
  },

  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '12px',
    color: '#6E7480',
    fontFamily: "'Poppins', sans-serif"
  },

  tableCard: {
    borderRadius: '22px',
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
    height: '52px',
    backgroundColor: '#064D36',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '800',
    textAlign: 'center',
    borderRight: '1px solid rgba(255,255,255,0.15)'
  },

  tr: {
    height: '56px',
    borderBottom: '1px solid #C7D1CF'
  },

  td: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#064D36',
    padding: '0 10px',
    borderRight: '1px solid #C7D1CF',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  emptyCell: {
    height: '245px',
    textAlign: 'center',
    color: '#8A8A8A',
    fontSize: '14px',
    backgroundColor: '#F7FBFA'
  },

  statusBadge: {
    minWidth: '70px',
    height: '20px',
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: '800'
  },

  detailButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#064D36',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer'
  },

  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '18px',
    marginBottom: '24px'
  },

  showingText: {
    margin: 0,
    color: '#7B8494',
    fontSize: '13px'
  },

  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  pageButton: {
    minWidth: '30px',
    height: '30px',
    borderRadius: '8px',
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
    width: '30px',
    height: '30px',
    borderRadius: '8px',
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
  },

  detailCard: {
    width: '520px',
    minHeight: '520px',
    borderRadius: '20px',
    backgroundColor: '#F3F8F6',
    border: '1px solid #DCE8E3',
    overflow: 'hidden'
  },

  detailHeader: {
    height: '46px',
    backgroundColor: '#064D36',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    fontSize: '14px',
    fontWeight: '800'
  },

  detailBody: {
    padding: '20px 24px 24px 24px'
  },

  detailText: {
    margin: '0 0 14px 0',
    color: '#111',
    fontSize: '14px'
  },

  messageBox: {
    minHeight: '130px',
    backgroundColor: '#fff',
    border: '1px solid #E1E4E3',
    borderRadius: '8px',
    padding: '18px',
    boxSizing: 'border-box',
    marginTop: '48px',
    marginBottom: '130px',
    color: '#111',
    fontSize: '14px',
    lineHeight: '1.35',
    whiteSpace: 'pre-line'
  },

  replyBox: {
    height: '46px',
    backgroundColor: '#fff',
    border: '1px solid #E1E4E3',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 6px 0 18px',
    boxSizing: 'border-box'
  },

  replyInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#6E7480',
    fontFamily: "'Poppins', sans-serif"
  },

  sendButton: {
    width: '42px',
    height: '36px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#FFD21A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }
};

export default PengaduanManagement;