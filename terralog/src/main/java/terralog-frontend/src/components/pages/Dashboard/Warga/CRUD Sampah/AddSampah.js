import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Trash2, Clock, History, BarChart3, Megaphone, LogOut, ArrowLeft } from 'lucide-react';

const AddSampah = () => {
  const navigate = useNavigate();
  
  // 1. State untuk Form
  const [formData, setFormData] = useState({
    namaSampah: '',
    idKategori: '', // Ini akan menampung ID dari dropdown
    berat: '',
    deskripsi: ''
  });

  // 2. State untuk menampung list kategori dari DB
  // Hapus salah satu kalau ada dua baris yang sama seperti ini:
const [categories, setCategories] = useState([]);

  // Fetch kategori saat halaman dibuka
useEffect(() => {
  const fetchKategori = async () => {
    try {
      // 1. Pastikan URL-nya benar (coba buka di browser dulu)
      const res = await axios.get('http://127.0.0.1:8080/api/kategori');
      
      // 2. Debug: Cek di console (F12) apakah datanya muncul
      console.log("Data Kategori dari Backend:", res.data);
      
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
      // Opsional: Kasih alert biar ketahuan kalau error
    }
  };
  fetchKategori();
}, []);

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Ambil ID user dari localStorage
  const currentUserId = localStorage.getItem('userId'); 

  // Bongkar isi formData
  const { namaSampah, berat, idKategori, deskripsi } = formData;
  const nilaiBerat = parseFloat(berat) || 0.0; // Gunakan float karena di Java bertipe Double

  const kategoriTerpilih = categories.find(cat => cat.idKategori === parseInt(idKategori));
  const namaKategori = kategoriTerpilih ? kategoriTerpilih.namaKategori : '';

  // 2. RACIK PAYLOAD SESUAI STRUKTUR sampahModel.java KAMU
  const payload = {
    userId: currentUserId ? parseInt(currentUserId) : null, 
    namaSampah: namaSampah,
    deskripsi: deskripsi,
    // Petakan berat tunggal dari form ke kolom spesifik Java secara otomatis
    organik: namaKategori.toLowerCase() === 'organik' ? nilaiBerat : null,
    anorganik: namaKategori.toLowerCase() === 'anorganik' ? nilaiBerat : null,
    campuran: namaKategori.toLowerCase() === 'campuran' ? nilaiBerat : null,
    b3: namaKategori.toLowerCase() === 'b3' ? nilaiBerat : null,
    // Catatan: 'tanggalInput' dan 'status' tidak perlu dikirim karena di Java sudah diset default!
  };

  // Log ke console buat mastiin bentuk objeknya sebelum ditembak ke API
  console.log("Payload yang dikirim ke Spring Boot:", payload);

  try {
    const response = await axios.post('http://127.0.0.1:8080/api/waste', payload);
    Swal.fire({
      title: 'Sukses!',
      text: 'Laporan berhasil dibuat',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
    navigate('/warga/buang-sampah');
  } catch (error) {
    console.error("Detail Error Lengkap:", error.response?.data);
    Swal.fire('Gagal!', 'Terjadi kesalahan pada server saat menyimpan.', 'error');
  }
};


  return (
    <div style={styles.container}>
      {/* Sidebar - Tetap Konsisten */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logoText}><span>T</span>erraLog</h2>
        <nav style={styles.navMenu}>
          <div style={styles.navItem} onClick={() => navigate('/admin/dashboard')}><LayoutDashboard size={18} /> Dashboard</div>
          <div style={{...styles.navItem, ...styles.activeNavItem}}><Trash2 size={18} /> Buang Sampah</div>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        <div style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
                <ArrowLeft size={18} /> Kembali
            </button>
            <h2 style={{margin:0}}>Tambah Catatan Sampah</h2>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Sampah</label>
              <input 
                type="text" 
                name="namaSampah"
                value={formData.namaSampah}
                onChange={handleChange}
                style={styles.input} 
                placeholder="Misal: Botol Plastik Bekas" 
                required 
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Kategori</label>
                <select 
                  name="idKategori" 
                  value={formData.idKategori}
                  onChange={handleChange}
                  style={styles.input} 
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.idKategori} value={cat.idKategori}>
                        {cat.namaKategori} {/* <-- Cek apakah di Java namanya 'namaKategori' atau cuma 'nama' */}
                      </option>
                    ))
                  ) : (
                    <option disabled>Memuat kategori...</option>
                  )}
                </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Berat (kg)</label>
              <input 
                type="number" 
                name="berat"
                value={formData.berat}
                onChange={handleChange}
                style={styles.input} 
                placeholder="Contoh: 5" 
                required 
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Deskripsi</label>
              <textarea 
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                style={styles.textarea} 
                placeholder="Tambahkan catatan tambahan..."
              ></textarea>
            </div>

            <button type="submit" style={styles.submitBtn}>Simpan ke Database</button>
          </form>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#004434' },
  sidebar: { width: '240px', padding: '30px 20px', color: '#fff' },
  logoText: { fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '10px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', borderRadius: '10px' },
  activeNavItem: { backgroundColor: 'rgba(255,255,255,0.2)' },
  
  mainContent: { flex: 1, backgroundColor: '#f4f7f6', margin: '15px', borderRadius: '30px', padding: '40px' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  backBtn: { border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#004434', fontWeight: 'bold' },
  
  formCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  formGroup: { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: 'bold', fontSize: '14px', color: '#333' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' },
  textarea: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', minHeight: '100px' },
  submitBtn: { width: '100%', backgroundColor: '#004434', color: '#fff', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }
};

export default AddSampah;