import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { LayoutDashboard, FileText, MapPin, Users, Clock, MessageSquare, ArrowLeft, Tag } from 'lucide-react';

const AddKategori = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    // State disesuaikan dengan Entity Kategori (namaKategori)
    const [formData, setFormData] = useState({
        namaKategori: ''
    });

    // --- LOGIKA FETCH DATA UNTUK EDIT ---
    useEffect(() => {
        if (isEdit) {
            axios.get(`http://localhost:8080/api/kategori/${id}`)
                .then(res => {
                    setFormData({
                        namaKategori: res.data.namaKategori || ''
                    });
                })
                .catch(err => {
                    console.error("Gagal mengambil data kategori:", err);
                    Swal.fire('Error', 'Data kategori tidak ditemukan', 'error');
                });
        }
    }, [id, isEdit]);

    const menuItems = [
        { id: 'dash', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'peng', icon: <Users size={20} />, label: 'Pengguna', path: '/admin/pengguna' },
        { id: 'kat', icon: <Tag size={20} />, label: 'Kategori Sampah', path: '/admin/pengguna' }, // Asumsi kategori di halaman yang sama
    ];

    // --- LOGIKA SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (isEdit) {
                await axios.put(`http://localhost:8080/api/kategori/${id}`, formData);
                Swal.fire('Berhasil!', 'Kategori diperbarui', 'success');
            } else {
                await axios.post('http://localhost:8080/api/kategori', formData);
                Swal.fire('Berhasil!', 'Kategori baru ditambahkan', 'success');
            }
            navigate('/admin/pengguna'); // Sesuaikan rute kembali kamu
        } catch (error) {
            console.error("Error:", error);
            Swal.fire('Gagal!', 'Terjadi kesalahan pada server', 'error');
        }
    };

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
                    <ArrowLeft size={18} /> Kembali
                </button>

                <div style={styles.formCard}>
                    <h2 style={{color: '#1b4332', marginBottom: '20px'}}>
                        {isEdit ? 'Edit Kategori Sampah' : 'Tambah Kategori Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.field}>
                            <label>Nama Kategori</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Plastik, Organik, B3"
                                value={formData.namaKategori} 
                                onChange={e => setFormData({namaKategori: e.target.value})} 
                                required 
                                style={styles.input} 
                            />
                        </div>

                        <button type="submit" style={styles.saveBtn}>
                            {isEdit ? 'Simpan Perubahan' : 'Tambahkan Kategori'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

// Styles tetap sama seperti yang kamu buat
const styles = {
    layout: { display: 'flex', height: '100vh', backgroundColor: '#f5f6f8' },
    sidebar: { width: '260px', backgroundColor: '#1b4332', color: '#fff', display: 'flex', flexDirection: 'column', padding: '25px 15px' },
    logo: { fontSize: '24px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' },
    nav: { flex: 1 },
    navItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', marginBottom: '8px', cursor: 'pointer', borderRadius: '10px' },
    activeItem: { backgroundColor: '#2d6a4f' },
    main: { flex: 1, padding: '40px', overflowY: 'auto' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#1b4332', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' },
    formCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '500px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    field: { display: 'flex', flexDirection: 'column', gap: '8px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' },
    saveBtn: { backgroundColor: '#1b4332', color: '#fff', padding: '15px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }
};

// INI YANG PALING PENTING AGAR TIDAK ERROR "ELEMENT TYPE INVALID"
export default AddKategori;