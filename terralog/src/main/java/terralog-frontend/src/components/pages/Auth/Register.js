import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Pakai Swal biar konsisten sama Dashboard
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nama: '',
        alamat: '',
        komplek: '',
        noHp: '', // Disesuaikan dengan Java Model (noHp)
        role: 'WARGA' 
    });
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // Untuk animasi tombol
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Pakai 127.0.0.1 biar lebih stabil nembak ke Spring Boot
            const response = await axios.post('http://127.0.0.1:8080/api/auth/register', formData);

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Akun kamu sudah terdaftar, silakan login.',
                    confirmButtonColor: '#1b4332'
                });
                navigate('/login');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: response.data.message || "Registrasi Gagal!",
                    confirmButtonColor: '#1b4332'
                });
            }
        } catch (error) {
            console.error("Error Register:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Gagal terhubung ke server! Pastikan Spring Boot jalan.',
                confirmButtonColor: '#1b4332'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.card}>
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <div style={styles.iconCircle}>
                        <UserPlus size={40} color="#1b4332" />
                    </div>
                    <h2 style={{ margin: '15px 0 5px 0', color: '#1b4332' }}>Daftar Terralog</h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>Gabung untuk lingkungan yang lebih bersih</p>
                </div>

                <div style={styles.grid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input name="username" type="text" onChange={handleChange} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input name="password" type="password" onChange={handleChange} style={styles.input} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nama Lengkap</label>
                        <input name="nama" type="text" onChange={handleChange} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>No. HP</label>
                        {/* Name disesuaikan jadi noHp agar sesuai state & Java */}
                        <input name="noHp" type="text" onChange={handleChange} style={styles.input} placeholder="0812..." required />
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Alamat</label>
                    <input name="alamat" type="text" onChange={handleChange} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Komplek (Blok)</label>
                    <input name="komplek" type="text" placeholder="Contoh: Blok A / No. 12" onChange={handleChange} style={styles.input} required />
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ 
                        ...styles.button, 
                        ...(isHovered ? styles.buttonHover : {}) 
                    }}
                >
                    {loading ? 'Memproses...' : 'Daftar Sekarang'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                    Sudah punya akun? <Link to="/login" style={{ color: '#2d6a4f', fontWeight: 'bold', textDecoration: 'none' }}>Login di sini</Link>
                </p>
            </form>
        </div>
    );
};

const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f5f6f8', // Samain sama background dashboard
        padding: '20px' 
    },
    card: { 
        padding: '40px', 
        borderRadius: '20px', 
        backgroundColor: '#fff', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
        width: '100%', 
        maxWidth: '550px',
        border: '1px solid #eee'
    },
    iconCircle: { 
        width: '80px', 
        height: '80px', 
        backgroundColor: '#e8f5e9', 
        borderRadius: '50%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: '0 auto' 
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    inputGroup: { marginBottom: '18px' },
    label: { 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600', 
        fontSize: '13px', 
        color: '#1b4332' 
    },
    input: { 
        width: '100%', 
        padding: '12px', 
        borderRadius: '10px', 
        border: '1px solid #ddd', 
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border 0.3s ease',
        fontSize: '14px'
    },
    button: { 
        width: '100%', 
        padding: '14px', 
        backgroundColor: '#1b4332', // Hijau Tua Dashboard
        color: '#fff', 
        border: 'none', 
        borderRadius: '10px', 
        cursor: 'pointer', 
        fontSize: '16px', 
        fontWeight: 'bold', 
        marginTop: '15px',
        transition: 'all 0.3s ease'
    },
    buttonHover: {
        backgroundColor: '#2d6a4f', // Hijau Terang pas di hover
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(27, 67, 50, 0.3)'
    }
};

export default Register;