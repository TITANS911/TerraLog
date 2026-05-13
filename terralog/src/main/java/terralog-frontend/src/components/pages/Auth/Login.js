import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

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
            const response = await axios.post('http://127.0.0.1:8080/api/auth/login', {
                username: username, password: password
            });
            if (response.data.success === true) {
                const role = response.data.role ? response.data.role.toString().trim().toUpperCase() : "";
                localStorage.setItem('nama', response.data.nama);
                localStorage.setItem('user_role', role);
                if (role === 'ADMIN') navigate('/admin/dashboard');
                else if (role === 'PETUGAS') navigate('/petugas/dashboard');
                else navigate('/dashboard');
            } else {
                Swal.fire({ icon: 'error', title: 'Login Gagal', text: response.data.message || "Salah!", confirmButtonColor: '#1b4332' });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Koneksi Error', text: 'Gagal ke server!', confirmButtonColor: '#1b4332' });
        } finally { setLoading(false); }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* KIRI (HIJAU) - Dibuat agak lebih kecil (40%) */}
            <div style={styles.leftSection}>
                <div style={styles.welcomeText}>
                    <h1 style={styles.mainTitle}>Welcome to <br /><span style={styles.highlight}>TerraLog</span></h1>
                    <p style={styles.subTitle}>Masuk untuk mengelola sampah Anda.</p>
                </div>
                <div style={styles.illustrationPlaceholder}>
                   <div style={styles.fakePhone}>
                        <div style={styles.fakeIcon}>👤</div>
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
                            <input type="checkbox" style={{marginRight: '8px'}} /> Remember Me
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
                        <button type="button" style={styles.socialBtn}>G</button>
                        <button type="button" style={styles.socialBtn}>f</button>
                        <button type="button" style={styles.socialBtn}>🍎</button>
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
        color: '#fff',
    },
    mainTitle: { fontSize: '5vw', fontWeight: '1000', margin: 0, lineHeight: '1.1' },
    highlight: { color: '#fbbf24' },
    subTitle: { fontSize: '1.1rem', marginTop: '15px', opacity: '0.9' },
    
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
    extraActions: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '11px' },
    button: { width: '100%', padding: '14px', backgroundColor: '#064e3b', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    buttonHover: { backgroundColor: '#065f46' },
    divider: { display: 'flex', alignItems: 'center', margin: '20px 0' },
    line: { flex: 1, height: '1px', backgroundColor: '#eee' },
    dividerText: { margin: '0 10px', color: '#999', fontSize: '12px' },
    socialGroup: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' },
    socialBtn: { width: '50px', height: '50px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fff', cursor: 'pointer' },
    registerText: { textAlign: 'center', fontSize: '13px' },
    registerLink: { color: '#064e3b', fontWeight: 'bold', textDecoration: 'none' },
    illustrationPlaceholder: { marginTop: '30px', display: 'flex', justifyContent: 'center' },
    fakePhone: { width: '150px', height: '280px', backgroundColor: '#1e293b', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    fakeIcon: { fontSize: '40px' }
};

export default Login;