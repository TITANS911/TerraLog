import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
    UserPlus, Edit, Trash2, Search, UserCheck, Shield,
    LayoutDashboard, FileText, MapPin, Users, Clock, MessageSquare, LogOut 
} from 'lucide-react';

const UserManagement = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('nama') || 'Admin';
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);

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

    useEffect(() => {
        fetchUsers();
    }, []);

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
            title: 'Hapus Pengguna?',
            text: `Yakin ingin menghapus ${nama}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1b4332',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Menggunakan user_id sesuai database
                    await axios.delete(`http://127.0.0.1:8080/api/users/${userId}`);
                    Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
                    fetchUsers();
                } catch (error) {
                    Swal.fire('Gagal!', 'Gagal menghapus data.', 'error');
                }
            }
        });
    };

    // --- FILTER DATA (Case Insensitive & Trim) ---
    const petugasList = users.filter(u => 
        u.role?.toUpperCase().trim() === 'PETUGAS' && 
        (u.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const wargaList = users.filter(u => 
        u.role?.toUpperCase().trim() === 'WARGA' && 
        (u.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // --- KOMPONEN TABEL REUSABLE ---
    const UserTable = ({ title, data, icon, type }) => (
        <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
                <div style={styles.titleGroup}>{icon} <h3 style={{margin:0}}>{title}</h3></div>
                
                {type === 'PETUGAS' && (
                    <button 
                        style={styles.addButton}
                        onClick={() => navigate('/admin/tambah-petugas')}
                    >
                        <UserPlus size={16} /> Tambah Petugas
                    </button>
                )}
            </div>
            <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Nama</th>
                            <th style={styles.th}>Username</th>
                            <th style={styles.th}>No. HP</th>
                            <th style={styles.th}>Alamat / Blok</th>
                            <th style={styles.th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((user) => (
                            // PAKAI userId (Sesuai model Java)
                            <tr key={user.userId} style={styles.tr}>
                                <td style={styles.td}>{user.nama}</td>
                                <td style={styles.td}>{user.username}</td>
                                <td style={styles.td}>{user.noHp || '-'}</td>
                                <td style={styles.td}>{user.alamat}, {user.komplek}</td>
                                <td style={styles.td}>
                                    <div style={styles.actionGroup}>
                                        <button style={styles.editBtn}
                                           onClick={() => {
                                              console.log("Data user yang diklik:", user); 
                                                // Liat di console, apakah adanya 'userId', 'user_id', atau cuma 'id'?
                                                navigate(`/admin/edit-petugas/${user.userId}`);
                                            }}
                                            >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            style={styles.deleteBtn} 
                                            onClick={() => handleDelete(user.userId, user.nama)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#999'}}>Belum ada data {title}</td>
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
                <div style={styles.profileSection}>
                    <div style={styles.avatar}></div>
                    <div>
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
    profileSection: { display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
    avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' },
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
};

export default UserManagement;