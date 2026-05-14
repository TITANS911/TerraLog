import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
    UserPlus, Edit, Trash2, Search, UserCheck, Shield,
    LayoutDashboard, FileText, MapPin, Users, Clock, MessageSquare, LogOut, Tag, PlusCircle
} from 'lucide-react';

const UserManagement = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('nama') || 'Admin';
    const [users, setUsers] = useState([]);
    const [kategori, setKategori] = useState([]);// State untuk kategori
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false); // Hover state untuk tombol logout

    // --- FETCH DATA USER ---
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
          // Pastikan endpoint API-nya sesuai dengan yang ada di backend (Java/Spring)
          const response = await axios.get('http://127.0.0.1:8080/api/kategori');
          
          // Simpan data ke state categories
          setKategori(response.data); 
      } catch (error) {
          console.error("Error fetch kategori:", error);
          Swal.fire('Error', 'Gagal mengambil data kategori', 'error');
      } finally {
          setLoading(false);
      }
  };

    useEffect(() => {
        fetchUsers();
        fetchKategori();
    }, []);

    // --- LOGIKA LOGOUT ---
    const handleLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: "Anda akan keluar dari sistem admin.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#1b4332',
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate('/login');
            }
        });
    };

    const menuItems = [
        { id: 'dash', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'lap', icon: <FileText size={20} />, label: 'Laporan Sampah', path: '/admin/laporan' },
        { id: 'peta', icon: <MapPin size={20} />, label: 'Peta Wilayah', path: '/admin/peta' },
        { id: 'peng', icon: <Users size={20} />, label: 'Pengguna', path: '/admin/pengguna' },
        { id: 'jad', icon: <Clock size={20} />, label: 'Jadwal Pengangkutan', path: '/admin/jadwal' },
        { id: 'adu', icon: <MessageSquare size={20} />, label: 'Pengaduan', path: '/admin/pengaduan' },
    ];

    // --- LOGIKA DELETE ---
    const handleDelete = (userId, nama) => {
        Swal.fire({
            title: 'Hapus?',
            text: `Yakin ingin menghapus ${nama}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1b4332',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://127.0.0.1:8080/api/users/${userId}`);
                    Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
                    fetchUsers();
                } catch (error) {
                    Swal.fire('Gagal!', 'Gagal menghapus data.', 'error');
                }
            }
        });
    };

    // --- LOGIKA DELETE KATEGORI ---
const handleDeleteKategori = (id, namaKategori) => {
    Swal.fire({
        title: 'Hapus Kategori?',
        text: `Apakah kamu yakin ingin menghapus kategori "${namaKategori}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1b4332', // Hijau tua sesuai tema TERRA
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Pastikan endpoint sesuai dengan @DeleteMapping di Backend Java kamu
                await axios.delete(`http://127.0.0.1:8080/api/kategori/${id}`);
                
                Swal.fire('Terhapus!', 'Kategori berhasil dihapus.', 'success');
                
                // Panggil kembali fetchKategori agar tabel otomatis terupdate
                fetchKategori(); 
            } catch (error) {
                console.error("Error deleting kategori:", error);
                Swal.fire('Gagal!', 'Gagal menghapus kategori.', 'error');
            }
        }
    });
};

    const petugasList = users.filter(u => 
        u.role?.toUpperCase().trim() === 'PETUGAS' && 
        (u.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const wargaList = users.filter(u => 
        u.role?.toUpperCase().trim() === 'WARGA' && 
        (u.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

  const filteredKategori = kategori.filter(k => 
    (k.namaKategori?.toLowerCase() || "").includes(searchTerm.toLowerCase())
);

    // --- KOMPONEN TABEL REUSABLE ---
    const UserTable = ({ title, data, icon, type }) => (
    <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
            <div style={styles.titleGroup}>{icon} <h3 style={{margin:0}}>{title}</h3></div>
            
            {/* Tombol Tambah khusus Kategori */}
            {type === 'KATEGORI' && (
                <button 
                    style={styles.addButton}
                    onClick={() => navigate('/admin/tambah-kategori')}
                >
                    <PlusCircle size={16} /> Tambah Kategori
                </button>
            )}

            {/* Tombol Tambah Petugas/Warga tetap seperti kode lama kamu */}
            {type === 'PETUGAS' && (
                <button style={styles.addButton} onClick={() => navigate('/admin/tambah-petugas')}>
                    <UserPlus size={16} /> Tambah Petugas
                </button>
            )}
            {type === 'WARGA' && (
                <button style={styles.addButton} onClick={() => navigate('/admin/tambah-warga')}>
                    <UserPlus size={16} /> Tambah Warga
                </button>
            )}
        </div>

        <div style={{overflowX: 'auto'}}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        {type === 'KATEGORI' ? (
                            <>
                                <th style={styles.th}>Nama Kategori</th>
                                <th style={styles.th}>Aksi</th>
                            </>
                        ) : (
                            <>
                                <th style={styles.th}>Nama</th>
                                <th style={styles.th}>Username</th>
                                <th style={styles.th}>No. HP</th>
                                <th style={styles.th}>Alamat</th>
                                <th style={styles.th}>Aksi</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item) => (
                        <tr key={type === 'KATEGORI' ? item.idKategori : item.userId} style={styles.tr}>
                            {type === 'KATEGORI' ? (
                                <>
                                    <td style={styles.td}>{item.namaKategori}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionGroup}>
                                            <button style={styles.editBtn} onClick={() => navigate(`/admin/edit-kategori/${item.idKategori}`)}> <Edit size={16} /> </button>
                                            <button style={styles.deleteBtn} onClick={() => handleDeleteKategori(item.idKategori, item.namaKategori)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td style={styles.td}>{item.nama}</td>
                                    <td style={styles.td}>{item.username}</td>
                                    <td style={styles.td}>{item.noHp || '-'}</td>
                                    <td style={styles.td}>{item.alamat}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionGroup}>
                                            <button style={styles.editBtn} onClick={() => navigate(`/admin/edit-${type.toLowerCase()}/${item.userId}`)}>
                                                <Edit size={16} />
                                            </button>
                                            <button style={styles.deleteBtn} onClick={() => handleDelete(item.userId, item.nama)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={type === 'KATEGORI' ? "2" : "5"} style={{textAlign: 'center', padding: '20px', color: '#999'}}>
                                Belum ada data {title}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

    return (
        <div style={styles.layout}>
            {/* --- SIDEBAR --- */}
            <aside style={styles.sidebar}>
                <h2 style={styles.logo}>TerraLog</h2>
                <nav style={styles.nav}>
                    {menuItems.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            style={{
                                ...styles.navItem,
                                ...(item.id === 'peng' ? styles.activeItem : {}),
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
                        <LogOut size={20} /> <span style={{ fontWeight:'bold' }}>Keluar</span>
                      </div>
                
                <div style={styles.profileSection}>
                    <div style={styles.avatar}></div>
                    <div style={{flex: 1}}>
                        <div style={{fontWeight: 'bold', fontSize: '14px'}}>{userName}</div>
                        <div style={{fontSize: '10px', opacity: 0.8}}>NRP: 152024023</div>
                    </div>
                </div>

                
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main style={styles.main}>
                <div style={styles.header}>
                    <h2 style={{color: '#1b4332'}}>Manajemen Pengguna</h2>
                    <div style={styles.searchBox}>
                        <Search size={18} color="#1b4332" />
                        <input 
                            type="text" 
                            placeholder="Cari nama..." 
                            style={styles.searchInput}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{textAlign: 'center', marginTop: '50px'}}>
                         <p>Memuat data...</p>
                    </div>
                ) : (
                    <div style={styles.contentArea}>
                        <UserTable 
                            title="List Petugas" 
                            data={petugasList} 
                            icon={<Shield color="#1b4332" />} 
                            type="PETUGAS" 
                        />
                        <div style={{height: '30px'}}></div>
                        <UserTable 
                            title="List Warga" 
                            data={wargaList} 
                            icon={<UserCheck color="#1b4332" />} 
                            type="WARGA" 
                        />
                        <div style={{height: '30px'}}></div>
                        <UserTable 
                            title="List Kategori" 
                            data={filteredKategori} // Gunakan data hasil filter search
                            icon={<Tag color="#1b4332" />} // Pakai icon Tag supaya beda
                            type="KATEGORI" 
                        />      
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    layout: { display: 'flex', height: '100vh', backgroundColor: '#f5f6f8' },
    sidebar: { width: '260px', backgroundColor: '#1b4332', color: '#fff', display: 'flex', flexDirection: 'column', padding: '25px 15px' },
    logo: { fontSize: '24px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' },
    nav: { flex: 1 },
    navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '8px', cursor: 'pointer', borderRadius: '10px', transition: '0.3s' },
    activeItem: { backgroundColor: '#2d6a4f' },
    hoverItem: { backgroundColor: 'rgba(255,255,255,0.1)', transform: 'translateX(5px)' },
    profileSection: { display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 5px', borderTop: '1px solid rgba(255,255,255,0.1)' },
    avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' },
    
    // Style Logout
    logoutBtn: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        padding: '12px 15px', 
        marginTop: '10px', 
        cursor: 'pointer', 
        borderRadius: '10px', 
        transition: '0.3s',
        color: '#ff4d4d', // Warna merah untuk indikasi keluar
    },
    logoutHover: { backgroundColor: 'rgba(255, 77, 77, 0.1)' },

    main: { flex: 1, padding: '30px', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '8px 15px', borderRadius: '10px', border: '1px solid #1b4332' },
    searchInput: { border: 'none', outline: 'none', marginLeft: '10px', width: '200px' },
    tableCard: { backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' },
    tableHeader: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' },
    titleGroup: { display: 'flex', alignItems: 'center', gap: '10px', color: '#1b4332' },
    addButton: { backgroundColor: '#1b4332', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '15px', backgroundColor: '#e8f5e9', color: '#1b4332', fontSize: '13px' },
    tr: { borderBottom: '1px solid #eee' },
    td: { padding: '15px', fontSize: '14px' },
    actionGroup: { display: 'flex', gap: '8px' },
    editBtn: { backgroundColor: '#e8f5e9', color: '#2d6a4f', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' },
    deleteBtn: { backgroundColor: '#ffebee', color: '#d32f2f', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' },
    logoutItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '20px', cursor: 'pointer', borderRadius: '10px', color: '#ff6b6b', transition: 'all 0.3s ease', fontWeight: '600' },
  logoutHover: { backgroundColor: 'rgba(255, 107, 107, 0.1)', transform: 'translateX(5px)' },
  profileSection: { display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
  avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fff', opacity: 0.5 },
};

export default UserManagement; // Pastikan ada kata 'default'