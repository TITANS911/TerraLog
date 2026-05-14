import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { LayoutDashboard, Users, ArrowLeft, Tag } from 'lucide-react';

// ... (bagian atas kode tetap sama)

const EditKategori = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Pastikan variabelnya adalah 'id' sesuai Route

    const [formData, setFormData] = useState({
        namaKategori: ''
    });

    // --- FETCH DATA LAMA (AUTO-FILL) ---
   // --- FETCH DATA LAMA ---
useEffect(() => {
    const loadKategori = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8080/api/kategori/${id}`);
            if (res.data) {
                setFormData({
                    // Tambahkan idKategori ke dalam state agar sinkron dengan model Java
                    idKategori: res.data.idKategori, 
                    namaKategori: res.data.namaKategori || ''
                });
            }
        } catch (err) {
            console.error("Gagal load data kategori:", err);
            Swal.fire('Error', 'Data kategori tidak ditemukan!', 'error');
        }
    };

    if (id && id !== "undefined") {
        loadKategori();
    }
}, [id]);

// --- LOGIKA UPDATE ---
const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        // Kirim formData yang sekarang sudah berisi {idKategori, namaKategori}
        await axios.put(`http://127.0.0.1:8080/api/kategori/${id}`, formData);
        
        Swal.fire({
            title: 'Berhasil!',
            text: 'Nama kategori telah diperbarui',
            icon: 'success',
            confirmButtonColor: '#1b4332'
        });
        navigate('/admin/pengguna'); 
    } catch (error) {
        console.error("Gagal Update:", error.response?.data);
        Swal.fire('Gagal!', 'Terjadi kesalahan saat memperbarui data', 'error');
    }
};

    // ... (sisa kode return dan styles tetap sama)

    // ... (menuItems dan Return tetap sama seperti kode kamu)
    const menuItems = [
        { id: 'dash', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'peng', icon: <Users size={20} />, label: 'Pengguna', path: '/admin/pengguna' },
        { id: 'kat', icon: <Tag size={20} />, label: 'Kategori Sampah', path: '/admin/kategori' },
    ];

    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <h2 style={styles.logo}>TerraLog</h2>
                <nav style={styles.nav}>
                    {menuItems.map((item) => (
                        <div key={item.id} onClick={() => navigate(item.path)}
                             style={{...styles.navItem, ...(item.id === 'kat' ? styles.activeItem : {})}}>
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
                    <h2 style={{color: '#1b4332', marginBottom: '10px'}}>Edit Kategori Sampah</h2>
                    <p style={{color: 'gray', marginBottom: '25px', fontSize: '14px'}}>ID Kategori: {id}</p>
                    
                    <form onSubmit={handleUpdate} style={styles.form}>
                        <div style={styles.field}>
                            <label style={styles.label}>Nama Kategori</label>
                            <input 
                                type="text" 
                                placeholder="Masukkan nama kategori"
                                value={formData.namaKategori} 
                                onChange={e => setFormData({namaKategori: e.target.value})} 
                                required 
                                style={styles.input} 
                            />
                        </div>
                        <button type="submit" style={styles.saveBtn}>Simpan Perubahan</button>
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
    formCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '600px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    field: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontWeight: '600', fontSize: '14px', color: '#333' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' },
    saveBtn: { backgroundColor: '#1b4332', color: '#fff', padding: '15px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }
};

export default EditKategori;