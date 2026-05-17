import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { LayoutDashboard, FileText, MapPin, Users, Clock, MessageSquare, ArrowLeft } from 'lucide-react';

const AddWarga = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const userName = localStorage.getItem('nama') || 'Admin';

    const [formData, setFormData] = useState({
        nama: '',
        username: '',
        password: '',
        noHp: '',
        alamat: '',
        role: 'WARGA'
    });

    // --- LOGIKA FETCH DATA UNTUK AUTO-FILL ---
    useEffect(() => {
    if (isEdit) {
        console.log("Sedang mengambil data untuk ID:", id); // Cek ID-nya muncul gak
        axios.get(`http://127.0.0.1:8080/api/users/${id}`)
            .then(res => {
                console.log("Data dari Java:", res.data); // Cek isi datanya
                setFormData({
                    nama: res.data.nama || '',
                    username: res.data.username || '',
                    noHp: res.data.no_hp || res.data.noHp || '', 
                    alamat: res.data.alamat || '',
                    role: res.data.role || 'WARGA',
                    password: ''
                });
            })
            .catch(err => {
                // Ini bakal kasih tau di console kenapa dia gagal (404, 500, atau 400)
                console.error("Detail Error Axios:", err.response); 
                Swal.fire('Error', `Gagal memuat data: ${err.response?.status || 'Server Mati'}`, 'error');
            });
    }
}, [id, isEdit]);

    const menuItems = [
        { id: 'dash', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'lap', icon: <FileText size={20} />, label: 'Laporan Sampah', path: '/admin/laporan' },
        { id: 'peta', icon: <MapPin size={20} />, label: 'Peta Wilayah', path: '/admin/peta' },
        { id: 'peng', icon: <Users size={20} />, label: 'Pengguna', path: '/admin/pengguna' },
        { id: 'jad', icon: <Clock size={20} />, label: 'Jadwal Pengangkutan', path: '/admin/jadwal' },
        { id: 'adu', icon: <MessageSquare size={20} />, label: 'Pengaduan', path: '/admin/pengaduan' },
    ];

    // --- LOGIKA SUBMIT (POST & PUT) ---
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Pastikan key yang dikirim ke Backend konsisten
    const payload = {
        nama: formData.nama,
        username: formData.username,
        noHp: formData.noHp, // UBAH dari no_hp menjadi noHp
        alamat: formData.alamat,
        role: formData.role
    };

    if (formData.password) {
        payload.password = formData.password;
    }

        try {
            if (isEdit) {
                // Gunakan PUT untuk update
                await axios.put(`http://127.0.0.1:8080/api/users/${id}`, payload);
                Swal.fire('Berhasil!', 'Data warga diperbarui', 'success');
            } else {
                // Gunakan POST untuk tambah baru
                await axios.post('http://127.0.0.1:8080/api/users', payload);
                Swal.fire('Berhasil!', 'Warga baru ditambahkan', 'success');
            }
            navigate('/admin/pengguna');
        } catch (error) {
            console.error("Error detail:", error.response?.data);
            Swal.fire('Gagal!', 'Terjadi kesalahan sistem atau format data salah', 'error');
        }
    };

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
                    <h2 style={{color: '#1b4332', marginBottom: '20px'}}>
                        {isEdit ? 'Edit Data Warga' : 'Tambah Warga Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
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

                        {/* Password hanya required kalau sedang TAMBAH baru */}
                        <div style={styles.field}>
                            <label>Password {isEdit && <span style={{fontSize: '11px', color: 'gray'}}>(Kosongkan jika tidak ingin ganti)</span>}</label>
                            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEdit} style={styles.input} />
                        </div>

                        <div style={styles.row}>
                            <div style={styles.field}>
                                <label>No. HP</label>
                                <input type="text" value={formData.noHp} onChange={e => setFormData({...formData, noHp: e.target.value})} style={styles.input} />
                            </div>
                        </div>

                        <div style={styles.field}>
                            <label>Alamat Detail</label>
                            <textarea value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} style={{...styles.input, height: '80px'}} />
                        </div>

                        <button type="submit" style={styles.saveBtn}>
                            {isEdit ? 'Simpan Perubahan' : 'Tambahkan Warga'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

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

export default AddWarga;