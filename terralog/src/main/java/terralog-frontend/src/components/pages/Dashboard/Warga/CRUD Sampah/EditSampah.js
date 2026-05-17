import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, Trash2, ArrowLeft } from 'lucide-react';

const EditSampah = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil ID dari URL: /admin/edit-sampah/:id
  
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nama: '',
    idKategori: '',
    berat: '',
    deskripsi: ''
  });

  // --- 1. LOAD DATA AWAL ---
useEffect(() => {
  const loadInitialData = async () => {
    try {
      // 1. Ambil list kategori untuk dropdown
      const catRes = await axios.get('http://127.0.0.1:8080/api/kategori');
      setCategories(catRes.data);

      // 2. Ambil data sampah yang mau diedit berdasarkan ID
      const wasteRes = await axios.get(`http://127.0.0.1:8080/api/waste/${id}`);
      const data = wasteRes.data;
      
      if (data) {
        // Taktik mendeteksi kategori dan berat asli dari pecahan kolom DB
        let idKatTerdeteksi = '';
        let beratTerdeteksi = '';

        if (data.organik !== null && data.organik !== undefined) {
          idKatTerdeteksi = '1'; // ◄ SESUAIKAN dengan ID Kategori Organik di DB Kategori-mu
          beratTerdeteksi = data.organik;
        } else if (data.anorganik !== null && data.anorganik !== undefined) {
          idKatTerdeteksi = '2'; // ◄ SESUAIKAN dengan ID Kategori Anorganik di DB Kategori-mu
          beratTerdeteksi = data.anorganik;
        } else if (data.campuran !== null && data.campuran !== undefined) {
          idKatTerdeteksi = '3'; // ◄ SESUAIKAN dengan ID Kategori Campuran di DB Kategori-mu
          beratTerdeteksi = data.campuran;
        } else if (data.b3 !== null && data.b3 !== undefined) {
          idKatTerdeteksi = '4'; // ◄ SESUAIKAN dengan ID Kategori B3 di DB Kategori-mu
          beratTerdeteksi = data.b3;
        }

        // 3. Isi form dengan data yang sudah diselaraskan dengan Model Java
        setFormData({
          namaSampah: data.namaSampah || '', // Sesuaikan nama variabel input form-mu jika perlu
          idKategori: idKatTerdeteksi,       // Dropdown otomatis kepilih otomatis
          berat: beratTerdeteksi,            // Angka berat lama otomatis muncul
          deskripsi: data.deskripsi || ''
        });
      }

    } catch (err) {
      console.error("Gagal load data:", err);
      Swal.fire('Error', 'Data tidak ditemukan atau gagal dimuat', 'error');
    }
  };
  
  if (id) {
    loadInitialData();
  }
}, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. FUNGSI UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8080/api/waste/${id}`, {
        nama: formData.nama,
        kategori: { idKategori: parseInt(formData.idKategori) }, 
        deskripsi: formData.deskripsi,
        berat: formData.berat
      });

      if (response.status === 200) {
        Swal.fire({
          title: 'Berhasil Diupdate!',
          text: 'Data sampah telah diperbarui',
          icon: 'success',
          confirmButtonColor: '#004434'
        }).then(() => navigate('/admin/laporan'));
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Gagal!', 'Gagal memperbarui data', 'error');
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logoText}><span>T</span>erraLog</h2>
        <nav style={styles.navMenu}>
          <div style={styles.navItem} onClick={() => navigate('/admin/dashboard')}><LayoutDashboard size={18} /> Dashboard</div>
          <div style={{...styles.navItem, ...styles.activeNavItem}}><Trash2 size={18} /> Edit Sampah</div>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        <div style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
                <ArrowLeft size={18} /> Kembali
            </button>
            <h2 style={{margin:0}}>Edit Data Sampah</h2>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Sampah</label>
              <input 
                type="text" 
                name="nama"
                value={formData.namaSampah}
                onChange={handleChange}
                style={styles.input} 
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
                {categories.map((cat) => (
                  <option key={cat.idKategori} value={cat.idKategori}>
                    {cat.namaKategori}
                  </option>
                ))}
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
              ></textarea>
            </div>

            <button type="submit" style={styles.submitBtn}>Simpan Perubahan</button>
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

export default EditSampah;