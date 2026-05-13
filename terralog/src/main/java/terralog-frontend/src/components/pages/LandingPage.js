import React, { useState } from 'react';
import { 
  Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube,
  Trash2, Users, Calendar, BarChart3, Map, MessageSquare, 
  MapPin, Send, TrendingUp, ChevronRight, FileText, Layers
} from 'lucide-react';
import bgKuning from '../../assets/Rectangle 35.png'; 
import backgroundImage from '../../assets/bg.jpeg';

const LandingPage = () => {
  const [activeNav, setActiveNav] = useState('#home'); // Default ke home
  const [hoverNav, setHoverNav] = useState(null);    // Untuk melacak hover

  // Fungsi helper untuk menentukan warna
  const getLinkStyle = (hash) => ({
    ...styles.link,
    color: (activeNav === hash || hoverNav === hash) ? '#FFD700' : '#fff',
  });
  return (
    <div style={styles.wrapper}>
        <div style={styles.topNavbar}>
            <div style={styles.navInfoGroup}>
                 <div style={styles.topNavContact}>
                    <span style={styles.navInfoItem}><Clock size={14} color="#FFD700" /> 24/7 Customer Service</span>
                    <span style={styles.navInfoItem}><Mail size={14} color="#FFD700" /> terralog.idn@gmail.com</span>
                    <span style={styles.navInfoItem}><Phone size={14} color="#FFD700" /> (+62) 895 3279 16134</span>
                </div>
            </div>
           

            {/* Sisi Kanan: Area Kuning Melengkung */}
            <div style={styles.yellowBranding}>
              <div style={styles.socialGroup}>
                <Facebook size={16} color='white' />
              <Twitter size={16} color='white' />
              <Instagram size={16} color='white' />
              </div>
              
            </div>
        </div>

      {/* --- 2. NAVBAR --- */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>TERRALOG</div>
        <div style={styles.navLinks}>
          {[
              { name: 'HOME', hash: '#home' },
              { name: 'TENTANG', hash: '#tentang' },
              { name: 'FITUR', hash: '#fitur' },
              { name: 'LAPORAN', hash: '#laporan' },
              { name: 'KATEGORI', hash: '/kategori' },
              { name: 'KONTAK', hash: '#kontak' },
            ].map((item) => (
              <a
                key={item.hash}
                href={item.hash}
                style={getLinkStyle(item.hash)}
                onClick={(e) => {
                  e.preventDefault(); // Mencegah lompatan instan browser

                  if (item.hash === '/kategori') {
                    window.location.href = '/kategori'; // Navigasi ke halaman kategori
                    return;
                  }
                  
                  setActiveNav(item.hash);
                
                  // Mencari elemen target berdasarkan ID (menghapus tanda #)
                  const targetId = item.hash.substring(1);
                  const element = document.getElementById(targetId);
                
                  if (element) {
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }
                }}
                onMouseEnter={() => setHoverNav(item.hash)}
                onMouseLeave={() => setHoverNav(null)}
              >
                {item.name}
              </a>
            ))}
        </div>
        <div style={styles.navAuth}>
          <a href="/login"><button style={styles.btnMasuk}>Masuk</button></a>
          <a href="/register"><button style={styles.btnDaftar}>Daftar</button></a>
        </div>
      </nav>

      {/* --- 3. HERO SECTION --- */}
      <header id="home" style={{
        ...styles.hero,
        backgroundImage: `url(${backgroundImage})`
      }}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Wujudkan Pengelolaan <br /> Sampah <span style={{color: '#FFD700'}}>Modern</span>
          </h1>
          <p style={styles.heroSubtitle}>
            TerraLog membantu pencatatan dan pelaporan sampah secara digital dan terstruktur.
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.btnGoldHero}>Get Started</button>
            <button style={styles.btnOutlineHero}>See Details</button>
          </div>
        </div>
      </header>

      {/* --- 4. TENTANG SECTION --- */}
      <section id="tentang" style={styles.sectionAbout}>
        <div style={styles.aboutHeader}>
          <h2 style={styles.aboutTitle}>
            <span style={{ color: '#E7B416' }}>Tentang</span>{' '}
            <span style={{ color: '#0B5D3F' }}>TerraLog</span>
          </h2>
          <div style={styles.greenLine}></div>
        </div>

        <div style={styles.aboutContent}>
          <div style={styles.aboutText}>
            <p style={styles.aboutParagraph}>
              Pengelolaan sampah yang masih dilakukan secara manual seringkali
              menyebabkan data sulit terorganisir dan kurang efektif untuk dipantau.
            </p>
            <p style={styles.aboutParagraph}>
              TerraLog hadir sebagai solusi digital yang membantu proses pengelolaan
              lingkungan menjadi lebih modern, praktis, dan terstruktur melalui
              sistem yang mudah digunakan.
            </p>
          </div>

          <div style={styles.imageGroup}>
            <div style={styles.smallImage}>
              <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500" alt="" style={styles.fullImg} />
            </div>
            <div style={styles.bigImage}>
              <img src="https://images.unsplash.com/photo-1511497584788-876760111969?w=500" alt="" style={styles.fullImg} />
            </div>
            <div style={styles.smallImage}>
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500" alt="" style={styles.fullImg} />
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. SOLUSI SECTION --- */}
      <section id="fitur" style={styles.sectionGrey}>
        <div style={{textAlign: 'center', marginBottom: '60px'}}>
          <h2 style={styles.sectionTitle}>Solusi yang Kami Hadirkan</h2>
          <p style={styles.sectionSubtitle}>Fitur TerraLog yang memudahkan proses pengelolaan sampah masyarakat.</p>
        </div>
        <div style={styles.featureGrid}>
          <FeatureCard icon={<Users />} title="Manajemen Data Warga" desc="Mengelola data warga dengan lebih rapi dan terstruktur." />
          <FeatureCard icon={<Calendar />} title="Penjadwalan Pengangkutan" desc="Membantu pengaturan jadwal penjemputan sampah secara real-time." />
          <FeatureCard icon={<BarChart3 />} title="Statistik & Laporan" desc="Menampilkan data dan grafik sampah berdasarkan periode tertentu." />
          <FeatureCard icon={<Map />} title="Monitoring Wilayah" desc="Memantau area pengelolaan sampah secara detail." />
          <FeatureCard icon={<MessageSquare />} title="Pengaduan Masyarakat" desc="Memfasilitasi pelaporan masalah lingkungan secara cepat." />
        </div>
      </section>

      {/* --- 6. LAPORAN & STATISTIK SECTION --- */}
      <section id="laporan" style={styles.statsSection}>
        <div style={styles.statsHeader}>
            <h2 style={styles.statsTitle}>Laporan & <span style={{color: '#FFD700'}}>Statistik</span></h2>
            <p style={styles.statsSubtitle}>Pantau perkembangan pengelolaan sampah melalui data dan statistik yang terorganisir.</p>
        </div>

        <div style={styles.statsGrid}>
          <StatCardDetail icon={<Trash2 size={24} color="#2D6A4F" />} label="Total Sampah Terkumpul" value="1,250" unit="kg" trend="12,2%" />
          <StatCardDetail icon={<FileText size={24} color="#2D6A4F" />} label="Transaksi Tercatat" value="320" unit="transaksi" trend="9,5%" />
          <StatCardDetail icon={<Users size={24} color="#2D6A4F" />} label="Warga Aktif" value="142" unit="orang" trend="10,7%" />
          <StatCardDetail icon={<Layers size={24} color="#E9C46A" />} label="Kategori Sampah" value="5" unit="kategori" isCategory={true} />
        </div>

        <div style={styles.graphRow}>
          <div style={styles.graphBox}>
            <div style={styles.graphHeader}>
              <span style={{fontWeight: 'bold'}}>Grafik Sampah Mingguan</span>
              <select style={styles.dropdown}><option>Minggu Ini</option></select>
            </div>
            <div style={styles.graphPlaceholder}>
              <p style={{color: '#ddd'}}>Area Visualisasi Grafik</p>
            </div>
          </div>

          <div style={styles.summaryBox}>
            <img src="https://cdn-icons-png.flaticon.com/512/3299/3299935.png" alt="bin" style={{width: '70px', marginBottom: '15px'}} />
            <p style={{color: '#2D6A4F', fontWeight: 'bold', fontSize: '14px', margin: 0}}>Total Minggu Ini</p>
            <h2 style={{color: '#2D6A4F', fontSize: '32px', fontWeight: '800', margin: '5px 0'}}>890 <span style={{fontSize: '16px'}}>kg</span></h2>
            <div style={{display: 'flex', alignItems: 'center', gap: '5px', color: '#2D6A4F', fontSize: '12px', fontWeight: 'bold'}}>
              <TrendingUp size={14} /> 12,5% <span style={{color: '#666', fontWeight: 'normal'}}>dari minggu lalu</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- 7. KONTAK SECTION --- */}
      <section id="kontak" style={styles.sectionWhite}>
        <div style={styles.contactContainer}>
          <div style={styles.contactInfo}>
            <h2 style={styles.sectionTitle}><span style={{ color: '#164D0C' }}>Kontak</span> <span style={{color: '#FFD700'}}>Kami</span></h2>
            <p style={styles.p}>Hubungi kami untuk informasi lebih lanjut mengenai layanan TerraLog.</p>
            <div style={styles.contactItem}><Mail size={18} color="#2d6a4f" /> terralog.idn@gmail.com</div>
            <div style={styles.contactItem}><MapPin size={18} color="#2d6a4f" /> Jl. PH.H. Mustopa No. 23, Bandung</div>
            <div style={styles.contactItem}><Phone size={18} color="#2d6a4f" /> (+62) 895 3279 16134</div>
            <div style={styles.mapBox}>
              <MapPin size={40} color="#999" />
              <span style={{color: '#999', marginTop: '10px'}}>Google Map API Placeholder</span>
            </div>
          </div>
          <div style={styles.contactForm}>
  {/* Kontainer Background untuk Field Input */}
            <div style={styles.formBackground}>
              <input placeholder="Nama" style={styles.input} />
              <input placeholder="No. Telp" style={styles.input} />
              <input placeholder="Email" style={styles.input} />
              <textarea placeholder="Pesan" style={{...styles.input, height: '150px', resize: 'none'}}></textarea>
                
            <button style={styles.btnSend}>Kirim <Send size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 8. FOOTER --- */}
      <footer style={styles.footer}>
        <div>Copyright © TerraLog. All Rights Reserved.</div>
        <div style={{display: 'flex', gap: '15px'}}>
          <span>User Terms & Conditions</span>
          <span>|</span>
          <span>Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};

// --- Reusable Components ---
const FeatureCard = ({ icon, title, desc }) => (
  <div style={styles.fCard}>
    <div style={styles.fIconContainer}>
      {React.cloneElement(icon, { size: 50 })} 
    </div>
    <h3 style={styles.fTitle}>{title}</h3>
    <p style={styles.fDesc}>{desc}</p>
  </div>
);

const StatCardDetail = ({ icon, label, value, unit, trend, isCategory }) => (
  <div style={styles.sCardDetail}>
    <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px'}}>
      <div style={styles.sIconCircle}>{icon}</div>
      <div>
        <p style={{fontSize: '12px', color: '#666', margin: 0, fontWeight: '600'}}>{label}</p>
        <h3 style={{fontSize: '22px', color: '#1B4332', margin: 0, fontWeight: 'bold'}}>{value} <span style={{fontSize: '14px', fontWeight: 'normal'}}>{unit}</span></h3>
      </div>
    </div>
    {isCategory ? (
      <div style={{fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '3px', borderTop: '1px solid #eee', paddingTop: '10px', cursor: 'pointer'}}>
        Lihat detail kategori <ChevronRight size={14} />
      </div>
    ) : (
      <div style={{fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px', borderTop: '1px solid #eee', paddingTop: '10px'}}>
        <span style={{color: '#2D6A4F', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px'}}><TrendingUp size={12} /> {trend}</span>
        <span style={{color: '#888'}}>dari minggu lalu</span>
      </div>
    )}
  </div>
);

// --- STYLING ---
const styles = {
  wrapper: { fontFamily: "'Poppins', sans-serif", color: '#333', scrollBehavior: 'smooth' },
  topBar: { backgroundColor: '#fff', padding: '10px 10%', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', fontSize: '11px', color: '#666' },
  topBarLeft: { display: 'flex', gap: '20px' },
  topItem: { display: 'flex', alignItems: 'center', gap: '5px' },
  topIcons: { display: 'flex', gap: '15px', color: '#2d6a4f' },
  navbar: { backgroundColor: '#1b4332', padding: '15px 10%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 },

  topNavContact: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    fontSize: '12px',
    color: '#555'
  },

  navInfoGroup: {
    display: 'flex',
    gap: '20px', // Jarak antar item (CS, Email, Telp) tetap rapat
    marginLeft: '140px', // Ini akan mendorong seluruh blok info ke arah kanan (mendekati area kuning)
    marginRight: '40px', // Jarak antara blok info dengan area kuning
    fontSize: '12px',
    color: '#666',
    alignItems: 'center'
  },

  navInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginLeft: '10px' // Memberikan sedikit ruang antara ikon dan teks
  },

  // 1. Kontainer induk (Navbar Top) harus punya ini
  topNavbar: {
    height: '40px',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative', // WAJIB
    overflow: 'hidden',    // WAJIB biar sisa lengkungan nggak meluber
  },

  // 2. Area Kuningnya\
 yellowBranding: {
    // 1. Ganti warna statis jadi gambar BG kamu
    backgroundImage: `url(${bgKuning})`, 
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
    backgroundSize: '100% 100%', // Biar menutupi area box-nya pas
    
    height: '100%',
    width: '450px', // Atur panjang area kuningnya di sini (sampai tengah navigasi)
    display: 'flex',
    alignItems: 'center',
    
    // 2. Kunci posisi rombongan logo di sini
    justifyContent: 'flex-end', 
    
    // 3. Atur margin right sesuai selera biar pas posisinya
    paddingRight: '60px', 
    
    // Jarak antar logo biar tetep rapat
    gap: '15px', 
    color: '#1b4332',
    marginLeft: 'auto',
  },

  socialGroup: {
    display: 'flex',
    // KUNCI 3: Jarak antar logo tetap rapat (nggak physical distancing)
    gap: '35px', 
    alignItems: 'center',
    // Memberi jarak aman agar rombongan tidak menempel ke pinggir kanan layar
    paddingRight: '130px', 
  },

  logo: { color: '#fff', fontWeight: '800', fontSize: '24px', letterSpacing: '1px' },
  navLinks: { display: 'flex', gap: '20px' },
  link: { 
    color: '#fff', 
    textDecoration: 'none', 
    fontSize: '13px', 
    
    // TAMBAHKAN INI
    fontWeight: 'bold', 
    
    // Opsional: tambahkan sedikit transisi agar halus saat hover
    transition: '0.3s' 
  },

  navAuth: { display: 'flex', gap: '15px' },
btnMasuk: { 
    background: 'none', 
    border: 'none', 
    color: '#fff', 
    cursor: 'pointer', 
    fontSize: '13px',
    
    // TAMBAHKAN INI
    fontWeight: 'bold' 
  },
  btnDaftar: { backgroundColor: '#FFD700', border: 'none', padding: '8px 20px', borderRadius: '15px', fontWeight: 'bold', color: '#1b4332', cursor: 'pointer', fontSize: '13px' },
  hero: { height: '80vh', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', padding: '0 10%' },

 heroContent: { 
    // Diperlebar agar teks tidak tercekik dan turun otomatis
    maxWidth: '900px', 
    color: '#fff',
    textAlign: 'left'
  },

heroTitle: { 
    fontSize: '55px', // Ukuran besar sesuai gambar
    fontWeight: '800', 
    // Merapatkan jarak antar baris agar terlihat menyatu
    lineHeight: '1.1', 
    marginBottom: '20px',
    textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
    // Memastikan tidak ada pembatasan lebar tambahan
    width: '100%' 
  },

heroSubtitle: { 
    fontSize: '19px', 
    marginBottom: '35px',
    // Agar subtitle tetap satu baris panjang
    width: '100%',
    lineHeight: '1.5',
    textShadow: '1px 1px 5px rgba(0,0,0,0.5)'
  }, 

  heroBtns: { display: 'flex', gap: '15px' },

  btnGoldHero: { 
    backgroundColor: '#FFD700', // Warna kuning cerah
    color: '#1b4332', 
    padding: '12px 35px', 
    borderRadius: '15px', // Membuat ujung tombol melengkung sempurna (pill-shaped)
    fontWeight: 'bold', 
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    transition: '0.3s'
  },

  btnOutlineHero: { 
    backgroundColor: 'rgba(27, 67, 50, 0.7)',
    color: '#FFD700', // Teks warna kuning agar kontras
    padding: '12px 35px', 
    borderRadius: '15px', // Melengkung sempurna
    fontWeight: 'bold', 
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    transition: '0.3s'
  },
  
  // Section Tentang & Fitur sekarang menggunakan warna yang sama agar tidak belang
  sectionAbout: {
    backgroundColor: '#f9f9f9',
    padding: '80px 0 80px 8%', 
    overflow: 'hidden',
  },
  sectionGrey: { 
    padding: '80px 10%', 
    backgroundColor: '#f9f9f9' 
  },

  aboutHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    width: '100%',
  },
  aboutTitle: {
    fontSize: '48px',
    fontWeight: '800',
    margin: 0,
    lineHeight: '1',
  },
  greenLine: {
    flex: 1,
    height: '10px',
    backgroundColor: '#0B5D3F',
    marginLeft: '25px',
    borderRadius: '50px 0 0 50px',
  },
  aboutContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '40px',
    paddingRight: '5%',
  },
  aboutText: {
    flex: 1,
    marginTop: -80, // Menaikkan teks agar dekat dengan judul
  },
  aboutParagraph: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#333',
    margin: '0 0 20px 0',
    maxWidth: '550px',
  },
  imageGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexShrink: 0,
  },
  smallImage: { width: '120px', height: '260px', borderRadius: '24px', overflow: 'hidden' },
  bigImage: { width: '150px', height: '380px', borderRadius: '28px', overflow: 'hidden' },
  fullImg: { width: '100%', height: '100%', objectFit: 'cover' },

  sectionWhite: { padding: '80px 10%', backgroundColor: '#fff' },
  sectionTitle: { fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' },
  sectionSubtitle: { color: '#666', marginBottom: '40px' },
  p: { color: '#666', lineHeight: '1.7', marginBottom: '15px', fontSize: '15px' },
  
  featureGrid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '25px' },
  fCard: { 
    backgroundColor: 'rgba(223, 237, 221, 0.6)', 
    padding: '40px 25px', 
    borderRadius: '20px', 
    width: '240px', 
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  fIconContainer: { color: '#164D0C', marginBottom: '20px' },
  fTitle: { fontSize: '19px', fontWeight: '700', color: '#000', marginBottom: '12px' },
  fDesc: { fontSize: '13px', color: '#333', lineHeight: '1.6', margin: 0 },

  statsSection: { backgroundColor: '#1b4332', padding: '40px 10%' },
  statsHeader: { textAlign: 'center', marginBottom: '35px' },
  statsTitle: { color: '#fff', fontSize: '32px', fontWeight: 'bold' },
  statsSubtitle: { color: '#fff', opacity: 0.8, fontSize: '14px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  sCardDetail: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px' },
  sIconCircle: { backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '50%', display: 'flex' },
  graphRow: { display: 'flex', gap: '20px' },
  graphBox: { flex: 3, backgroundColor: '#fff', borderRadius: '12px', padding: '20px' },
  graphHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  dropdown: { padding: '5px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '12px' },
  graphPlaceholder: { height: '180px', border: '1px dashed #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  summaryBox: { flex: 1, backgroundColor: '#E9F5F0', borderRadius: '12px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },

  // Styling Kontak yang sudah diperbaiki agar SIMETRIS
  // --- Update Styling Kontak agar FIX Simetris ---
  contactContainer: { 
    display: 'grid', // Menggunakan Grid agar tinggi kolom otomatis sama
    gridTemplateColumns: '1fr 1fr', // Membagi 50:50 secara presisi
    gap: '60px',
    alignItems: 'start'
  },

  contactInfo: { 
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Memastikan info mengambil tinggi maksimal
    justifyContent: 'space-between' 
  },

  contactItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    marginBottom: '15px', 
    fontSize: '14px' 
  },

  formBackground: {
    backgroundColor: '#DFEDDD', // Warna hijau muda sesuai gambar
    padding: '25px',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', // Jarak antar field di dalam kotak
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)' // Efek shadow halus agar terlihat modern
  },

  mapBox: { 
    flexGrow: 1, 
    minHeight: '300px', // Memberikan tinggi minimal agar map terlihat jelas
    backgroundColor: '#f5f5f5', 
    borderRadius: '15px', 
    marginTop: '10px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    border: '1px solid #eee' 
  },

 contactForm: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px', // Jarak antara kotak background dan tombol Kirim
    paddingTop: '85px' // Menjaga keselarasan dengan teks di kiri
  },

  input: { 
    padding: '15px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    backgroundColor: '#ffffff', // Input tetap berwarna putih agar teks terbaca jelas
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none'
  },

 btnSend: { 
    backgroundColor: '#1b4332', 
    color: '#fff', 
    padding: '15px 0', // Padding atas-bawah tetap, kiri-kanan diset 0 karena sudah pakai width 100%
    border: 'none', 
    borderRadius: '8px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    
    // KUNCI AGAR PANJANG:
    width: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', // Agar teks "Kirim" tetap di tengah
    gap: '10px',
    marginTop: '5px'
  },

  footer: { backgroundColor: '#FFD700', padding: '20px 10%', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#1b4332' }
};  

export default LandingPage;