import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { LayoutDashboard, FileText, MapPin, Users, Clock, MessageSquare, ArrowLeft } from 'lucide-react';

const EditWarga = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Ambil ID dari URL
    const userName = localStorage.getItem('nama') || 'Admin';

    const [formData, setFormData] = useState({
        nama: '',
        username: '',
        password: '', 
        noHp: '',
        alamat: '',
        komplek: '',
        role: 'PETUGAS'
    });

    // --- FETCH DATA LAMA (AUTO-FILL) ---
    useEffect(() => {
    const loadPetugas = async () => {
        try {
            console.log("Mengambil data untuk ID:", id); // Cek apakah ID-nya muncul
            const res = await axios.get(`http://127.0.0.1:8080/api/users/${id}`);
            console.log("Data mentah dari Java:", res.data); // Cek nama field di sini
            
            const data = res.data;
            setFormData({
                nama: data.nama || '',
                username: data.username || '',
                // Gunakan pencocokan fleksibel jika Java mengirim snake_case
                noHp: data.noHp || data.no_hp || '', 
                alamat: data.alamat || '',
                komplek: data.komplek || '',
                role: data.role || 'PETUGAS',
                password: '' 
            });
        } catch (err) {
            console.error("Gagal load data:", err);
            Swal.fire('Error', 'Data petugas tidak ditemukan!', 'error');
            navigate('/admin/pengguna');
        }
    };
    if (id && id !== "undefined") {
        loadPetugas();
    }
}, [id, navigate]);

    // --- LOGIKA UPDATE ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Payload disesuaikan dengan userModel.java kamu
            const payload = { ...formData };
            // Jangan kirim password kalau user tidak mengetik apa-apa
            if (!payload.password) delete payload.password;

            await axios.put(`http://127.0.0.1:8080/api/users/${id}`, payload);
            Swal.fire('Berhasil!', 'Data petugas telah diperbarui', 'success');
            navigate('/admin/pengguna');
        } catch (error) {
            console.error("Gagal Update:", error.response?.data);
            Swal.fire('Gagal!', 'Cek kembali koneksi atau format data', 'error');
        }
    };

    // Sidebar Items (Sama dengan UserManagement)
    const menuItems = [
        { id: 'dash', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'lap', icon: <FileText size={20} />, label: 'Laporan Sampah', path: '/admin/laporan' },
        { id: 'peta', icon: <MapPin size={20} />, label: 'Peta Wilayah', path: '/admin/peta' },
        { id: 'peng', icon: <Users size={20} />, label: 'Pengguna', path: '/admin/pengguna' },
        { id: 'jad', icon: <Clock size={20} />, label: 'Jadwal Pengangkutan', path: '/admin/jadwal' },
        { id: 'adu', icon: <MessageSquare size={20} />, label: 'Pengaduan', path: '/admin/pengaduan' },
    ];

    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <h2 style={styles.logo}>TerraLog</h2>
                <nav style={styles.nav}>
                    {menuItems.map((item) => (
                        <div key={item.id} onClick={() => navigate(item.path)}
                             style={{...styles.navItem, ...(item.id === 'peng' ? styles.activeItem : {})}}>
                            {item.icon} <span>{item.label}</span>
                        </div>
                    ))}
                </nav>
            </aside>

            <main style={styles.main}>
                <button onClick={() => navigate('/admin/pengguna')} style={styles.backBtn}>
                    <ArrowLeft size={18} /> Kembali ke List
                </button>

                <div style={styles.formCard}>
                    <h2 style={{color: '#1b4332', marginBottom: '20px'}}>Edit Data Petugas</h2>
                    <form onSubmit={handleUpdate} style={styles.form}>
                        <div style={styles.row}>
                            <div style={styles.field}>
                                <label>Nama Lengkap</label>
                                <input type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required style={styles.input} />
                            </div>
                            <div style={styles.field}>
                                <label>Username</label>
                                <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required style={styles.input} />
                            </div>
                        </div>

                        <div style={styles.field}>
                            <label>Password <span style={{fontSize: '11px', color: 'gray'}}>(Kosongkan jika tidak ganti)</span></label>
                            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={styles.input} />
                        </div>

                        <div style={styles.row}>
                            <div style={styles.field}>
                                <label>No. HP</label>
                                <input type="text" value={formData.noHp} onChange={e => setFormData({...formData, noHp: e.target.value})} style={styles.input} />
                            </div>
                            <div style={styles.field}>
                                <label>Komplek / Blok</label>
                                <input type="text" value={formData.komplek} onChange={e => setFormData({...formData, komplek: e.target.value})} style={styles.input} />
                            </div>
                        </div>

                        <div style={styles.field}>
                            <label>Alamat Detail</label>
                            <textarea value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} style={{...styles.input, height: '80px'}} />
                        </div>

                        <button type="submit" style={styles.saveBtn}>Update Data Petugas</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

// Copy styles dari UserManagement kamu agar tampilannya identik
const styles = {
    layout: { display: 'flex', height: '100vh', backgroundColor: '#f5f6f8' },
    sidebar: { width: '260px', backgroundColor: '#1b4332', color: '#fff', display: 'flex', flexDirection: 'column', padding: '25px 15px' },
    logo: { fontSize: '24px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' },
    nav: { flex: 1 },
    navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '8px', cursor: 'pointer', borderRadius: '10px' },
    activeItem: { backgroundColor: '#2d6a4f' },
    main: { flex: 1, padding: '40px', overflowY: 'auto' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#1b4332', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' },
    formCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    row: { display: 'flex', gap: '20px' },
    field: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' },
    saveBtn: { backgroundColor: '#1b4332', color: '#fff', padding: '15px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }
};

export default EditWarga;