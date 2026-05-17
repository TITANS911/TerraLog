import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoginIMG from '../../../assets/LoginIMG.png';

const Login = () => {
    // --- LOGIC TETAP SAMA (TIDAK BERUBAH) ---
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Menggunakan localhost agar lebih stabil dibanding IP loopback mentah
        const response = await axios.post('http://localhost:8080/api/auth/login', {
            username: username, 
            password: password
        });

        if (response.data.success === true) {
            const role = response.data.role ? response.data.role.toString().trim().toUpperCase() : "";
            
            // --- BERIKUT PERBAIKANNYA (SINKRONISASI SESI) ---
            localStorage.setItem('nama', response.data.nama);
            localStorage.setItem('user_role', role);
            
            // Simpan userId ke localStorage agar dikenali oleh komponen BuangSampah.js
            // CATATAN: sesuaikan .userId atau .id dengan output JSON login dari backend kamu
            const idUser = response.data.userId || response.data.id;
            if (idUser) {
                localStorage.setItem('userId', idUser.toString());
            } else {
                console.warn("Peringatan: Backend tidak mengirimkan userId / id!");
            }
            // ------------------------------------------------

            if (role === 'ADMIN') navigate('/admin/dashboard');
            else if (role === 'PETUGAS') navigate('/petugas/dashboard');
            else navigate('/dashboard');
        } else {
            Swal.fire({ 
                icon: 'error', 
                title: 'Login Gagal', 
                text: response.data.message || "Username atau password salah!", 
                confirmButtonColor: '#1b4332' 
            });
        }
    } catch (error) {
        console.error("Detail error login:", error);
        Swal.fire({ 
            icon: 'error', 
            title: 'Koneksi Error', 
            text: 'Gagal terhubung ke server backend!', 
            confirmButtonColor: '#1b4332' 
        });
    } finally { 
        setLoading(false); 
    }
};
    return (
        <div style={styles.pageWrapper}>
            {/* KIRI (HIJAU) - Dibuat agak lebih kecil (40%) */}
            <div style={styles.leftSection}>
                <div style={styles.welcomeText}>
                    <h1 style={styles.mainTitle}>Welcome to <br /><span style={styles.highlight}>TerraLog</span></h1>
                    <p style={styles.subTitle}>Masuk untuk mengelola sampah Anda.</p>
                </div>
                <div style={styles.icon}>
                   <div style={styles.iconLogin}>
                        <div style={styles.logoLogin}>
                            <img src={LoginIMG} alt="Login Illustration" style={{ width: '370px', height: '300px', objectFit: 'cover', borderRadius: '20px' }} />
                        </div>
                   </div>
                </div> 
            </div>

            {/* KANAN (KUNING) - Dibuat lebih lebar (60%) */}
            <div style={styles.rightSection}>
                <form onSubmit={handleLogin} style={styles.loginCard}>
                    <h2 style={styles.formTitle}>Login</h2>
                    <p style={styles.formSubTitle}>Enter your account details</p>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}><span style={{color: 'red'}}>*</span>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}><span style={{color: 'red'}}>*</span>Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.extraActions}>
                        <label style={styles.rememberMe}>
                            <input type="checkbox" style={{ marginRight: '8px', cursor: 'pointer' }} /> 
                            Remember Me
                        </label>
                        <a href="/forgot" style={styles.forgotPass}>Forgot password?</a>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ ...styles.button, ...(isHovered ? styles.buttonHover : {}) }}
                    >
                        {loading ? 'Processing...' : 'Login'}
                    </button>

                    <div style={styles.divider}>
                        <div style={styles.line}></div>
                        <span style={styles.dividerText}>Or</span>
                        <div style={styles.line}></div>
                    </div>

                    <div style={styles.socialGroup}>
                        {/* Google Button */}
                        <button type="button" style={styles.socialBtn}>
                            <svg style={styles.socialIcon} viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg">
                                <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path>
                                <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path>
                                <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path>
                                <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path>
                            </svg>
                        </button>

                        {/* Facebook Button */}
                        <button type="button" style={styles.socialBtn}>
                            <svg style={styles.socialIcon} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7208)"></circle>
                                <path d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z" fill="white"></path>
                                <defs>
                                    <linearGradient id="paint0_linear_87_7208" x1="16" y1="2" x2="16" y2="29.917" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#18ACFE"></stop>
                                        <stop offset="1" stop-color="#0163E0"></stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </button>

                        {/* Apple Button */}
                        <button type="button" style={styles.socialBtn}>
                            <svg style={styles.socialIcon} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.438 31.401c-0.63-0.422-1.193-0.938-1.656-1.536-0.516-0.615-0.984-1.266-1.422-1.938-1.021-1.495-1.818-3.125-2.375-4.849-0.667-2-0.99-3.917-0.99-5.792 0-2.094 0.453-3.922 1.339-5.458 0.651-1.198 1.625-2.203 2.797-2.906 1.135-0.708 2.453-1.094 3.786-1.12 0.469 0 0.974 0.068 1.51 0.198 0.385 0.109 0.854 0.281 1.427 0.495 0.729 0.281 1.13 0.453 1.266 0.495 0.427 0.156 0.786 0.224 1.068 0.224 0.214 0 0.516-0.068 0.859-0.172 0.193-0.068 0.557-0.188 1.078-0.411 0.516-0.188 0.922-0.349 1.245-0.469 0.495-0.146 0.974-0.281 1.401-0.349 0.521-0.078 1.036-0.104 1.531-0.063 0.948 0.063 1.813 0.266 2.589 0.557 1.359 0.547 2.458 1.401 3.276 2.615-0.349 0.214-0.667 0.458-0.969 0.734-0.651 0.573-1.198 1.25-1.641 2.005-0.573 1.026-0.865 2.188-0.859 3.359 0.021 1.443 0.391 2.714 1.12 3.813 0.521 0.802 1.208 1.484 2.047 2.047 0.417 0.281 0.776 0.474 1.12 0.604-0.161 0.5-0.333 0.984-0.536 1.464-0.464 1.078-1.016 2.109-1.667 3.083-0.578 0.839-1.031 1.464-1.375 1.88-0.536 0.635-1.052 1.12-1.573 1.458-0.573 0.38-1.25 0.583-1.938 0.583-0.469 0.021-0.932-0.042-1.38-0.167-0.385-0.13-0.766-0.271-1.141-0.432-0.391-0.177-0.792-0.333-1.203-0.453-0.51-0.135-1.031-0.198-1.552-0.198-0.536 0-1.057 0.068-1.547 0.193-0.417 0.12-0.818 0.26-1.214 0.432-0.557 0.234-0.927 0.391-1.141 0.458-0.427 0.125-0.87 0.203-1.318 0.229-0.693 0-1.339-0.198-1.979-0.599zM18.578 6.786c-0.906 0.453-1.771 0.646-2.63 0.583-0.135-0.865 0-1.75 0.359-2.719 0.318-0.828 0.745-1.573 1.333-2.24 0.609-0.693 1.344-1.266 2.172-1.677 0.88-0.453 1.719-0.698 2.521-0.734 0.104 0.906 0 1.797-0.333 2.76-0.307 0.854-0.76 1.641-1.333 2.344-0.583 0.693-1.302 1.266-2.115 1.682z"></path>
                            </svg>
                        </button>
                    </div>

                    <p style={styles.registerText}>
                        Don't have an account? <a href="/register" style={styles.registerLink}>Register</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: { display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' },
    leftSection: {
        flex: '0 0 45%', // Kiri 40%
        backgroundColor: '#064e3b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 50px',
        color: '#fff',// Pastikan kiri rapat dengan tepi layar
    },
    mainTitle: { fontSize: '5vw', fontWeight: '500', margin: 0, lineHeight: '1.1', marginLeft: '20px' },
    highlight: { color: '#f2d325', fontWeight: '790' },
    subTitle: { fontSize: '1.1rem', marginTop: '15px', opacity: '0.9', marginLeft: '20px' },
    
    rightSection: {
        flex: '0 0 40%',
        backgroundColor: '#fbbf24',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '55px'
    },

    container: {
        height: '100vh',
        width: '100%',
        backgroundColor: '#fcc419', // Kuning
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end', // Memaksa isi ke paling bawah layar
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden', // Mematikan scroll agar tidak ada celah saat ditarik
        margin: 0,
        padding: 0
    },
    loginCard: {
        backgroundColor: '#fff',
        width: '340px',
        padding: '30px 40px 20px 40px',
        borderRadius: '50px 50px 0 0', // Bawah dibuat siku agar rapat
        boxShadow: '0 -5px 20px rgba(0,0,0,0.1)',
        textAlign: 'left',
        margin: 0,
        marginTop: '90px', // Pastikan margin 0 agar tidak ada jarak ke bawah
        borderBottom: 'none'    
    },
    formTitle: { fontSize: '2rem', fontWeight: 'bold', color: '#064e3b', margin: '0' },
    formSubTitle: { color: '#999', marginBottom: '25px', fontSize: '13px' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#064e3b' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' },
  extraActions: { 
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '20px', 
      fontSize: '11px' 
   },
   rememberMe: {
      display: 'flex',         // Tambahkan ini
      alignItems: 'center',    // Tambahkan ini agar checkbox & teks sejajar vertikal
      cursor: 'pointer'
   },
   forgotPass: {
      textDecoration: 'none',
      color: '#064e3b'         // Menggunakan warna kuning agar senada dengan branding TerraLog
   },
    button: { width: '100%', padding: '14px', backgroundColor: '#064e3b', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    buttonHover: { backgroundColor: '#065f46' },
    divider: { display: 'flex', alignItems: 'center', margin: '20px 0', marginTop: '30px' },
    line: { flex: 1, height: '2px', backgroundColor: '#fcc419' },
    dividerText: { margin: '0 20px', color: '#065f46', fontSize: '13px', fontWeight: 'bold' },
    socialGroup: { 
      display: 'flex', 
      gap: '20px', // Dikurangi agar muat saat tombol melebar
      justifyContent: 'center', 
      marginBottom: '20px' 
   },
   socialBtn: { 
      flex: 1, // Membuat tombol membagi ruang secara rata (melebar)
      maxWidth: '90px', // Batas lebar maksimal tombol
      height: '60px', 
      borderRadius: '12px', 
      border: '1px solid #eee', 
      backgroundColor: '#fff', 
      cursor: 'pointer', 
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '0'
   },
   socialIcon: { 
      width: '35px', // Ukuran ikon dikunci di sini
      height: '35px' 
   },
    registerText: { textAlign: 'center', fontSize: '13px' },
    registerLink: { color: '#064e3b', fontWeight: 'bold', textDecoration: 'none' },
    icon: { 
      marginTop: '30px', 
      display: 'flex', 
      justifyContent: 'flex-start' // Mengubah posisi dari center ke kiri
   },
   iconLogin: { 
      width: '150px', 
      height: '280px', 
      borderRadius: '20px', 
      display: 'flex', 
      alignItems: 'center', // Menambahkan ini agar icon berada di tengah secara vertikal di dalam box
      justifyContent: 'center' ,
      marginTop: '20px', // Memberi jarak dari teks ke gambar
      marginLeft: '150px', // Menggeser sedikit ke kiri agar lebih rapat dengan teks
   },
   logoLogin: { 
      fontSize: '300px' 
   }
};

export default Login;