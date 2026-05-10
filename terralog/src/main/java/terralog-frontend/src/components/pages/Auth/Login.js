import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Biar alert-nya gak kaku
import { LogIn, User } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // State untuk animasi tombol
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Pakai 127.0.0.1 biar lebih stabil nembak ke Spring Boot
            const response = await axios.post('http://127.0.0.1:8080/api/auth/login', {
                username: username,
                password: password
            });

            if (response.data.success === true) {
                const rawRole = response.data.role;
                const role = rawRole ? rawRole.toString().trim().toUpperCase() : "";
                
                // Simpan data ke localStorage
                localStorage.setItem('nama', response.data.nama); // Sesuai dengan Dashboard.js
                localStorage.setItem('user_role', role);

                // LOGIKA NAVIGASI
                if (role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (role === 'PETUGAS') {
                    navigate('/petugas/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal',
                    text: response.data.message || "Username atau Password salah!",
                    confirmButtonColor: '#1b4332'
                });
            }
        } catch (error) {
            console.error("Error koneksi:", error);
            Swal.fire({
                icon: 'error',
                title: 'Koneksi Error',
                text: 'Gagal terhubung ke server! Pastikan Backend sudah nyala.',
                confirmButtonColor: '#1b4332'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.card}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={styles.iconCircle}>
                        <User size={40} color="#1b4332" />
                    </div>
                    <h2 style={{ margin: '15px 0 5px 0', color: '#1b4332' }}>Terralog Login</h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>Silakan masuk untuk mengelola sampah</p>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Username</label>
                    <input 
                        type="text" 
                        placeholder="Masukkan username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    <input 
                        type="password" 
                        placeholder="Masukkan password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
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
                    {loading ? 'Proses...' : (
                        <>
                            <LogIn size={18} style={{ marginRight: '8px' }} />
                            Masuk Sekarang
                        </>
                    )}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        Belum punya akun?{' '}
                        <a href="/register" style={{ color: '#2d6a4f', fontWeight: 'bold', textDecoration: 'none' }}>
                            Daftar di sini
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#f5f6f8' 
    },
    card: { 
        padding: '40px', 
        borderRadius: '20px', 
        backgroundColor: '#fff', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
        width: '100%', 
        maxWidth: '400px',
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
    inputGroup: { marginBottom: '20px' },
    label: { 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600', 
        fontSize: '14px', 
        color: '#1b4332' 
    },
    input: { 
        width: '100%', 
        padding: '12px', 
        borderRadius: '10px', 
        border: '1px solid #ddd', 
        boxSizing: 'border-box', 
        fontSize: '15px',
        outline: 'none',
        transition: '0.3s'
    },
    button: { 
        width: '100%', 
        padding: '14px', 
        backgroundColor: '#1b4332', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '10px', 
        cursor: 'pointer', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        fontSize: '16px', 
        fontWeight: 'bold', 
        transition: 'all 0.3s ease' 
    },
    buttonHover: {
        backgroundColor: '#2d6a4f',
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(27, 67, 50, 0.3)'
    }
};

export default Login;