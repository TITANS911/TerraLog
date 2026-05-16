import React from 'react';
import {
  Search,
  Bell,
  User
} from 'lucide-react';

import PetugasSidebar from './PetugasSidebar';

const PetugasDashboard = () => {
  const userName = localStorage.getItem('nama') || 'Petugas';

  return (
    <div style={styles.container}>
      <PetugasSidebar activeMenu="dashboard" />

      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <section style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>
                Halo, <span style={styles.greenText}>{userName}!</span>
              </h1>

              <p style={styles.subtitle}>
                Pantau aktivitas pengelolaan sampah dengan lebih efisien
              </p>
            </div>

            <div style={styles.headerRight}>
              <div style={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search..."
                  style={styles.searchInput}
                />
                <Search size={28} color="#111" />
              </div>

              <button style={styles.circleButton}>
                <Bell size={22} color="#111" />
              </button>

              <button style={styles.circleButton}>
                <User size={22} color="#111" />
              </button>
            </div>
          </section>

          <section style={styles.emptyContent}>
            {/* Isi dashboard petugas nanti ditaruh di sini kalau backend sudah ada */}
          </section>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#064D36',
    fontFamily: "'Poppins', sans-serif"
  },

  main: {
    marginLeft: '270px',
    minHeight: '100vh',
    padding: '24px 24px 24px 0',
    boxSizing: 'border-box'
  },

  contentWrapper: {
    minHeight: 'calc(100vh - 48px)',
    backgroundColor: '#fff',
    borderRadius: '38px',
    padding: '40px 48px',
    boxSizing: 'border-box'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: '36px'
  },

  pageTitle: {
    margin: '0 0 12px 0',
    fontSize: '42px',
    lineHeight: '1',
    fontWeight: '900',
    color: '#111'
  },

  greenText: {
    color: '#064D36'
  },

  subtitle: {
    margin: 0,
    fontSize: '19px',
    color: '#8A8A8A'
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#064D36',
    borderRadius: '28px',
    padding: '6px 14px 6px 250px'
  },

  searchBox: {
    width: '245px',
    height: '44px',
    backgroundColor: '#fff',
    borderRadius: '24px',
    border: '1px solid #E5E5E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px 0 18px',
    boxSizing: 'border-box'
  },

  searchInput: {
    border: 'none',
    outline: 'none',
    width: '165px',
    fontSize: '12px',
    color: '#777',
    fontFamily: "'Poppins', sans-serif"
  },

  circleButton: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },

  emptyContent: {
    minHeight: '560px',
    backgroundColor: '#fff'
  }
};

export default PetugasDashboard;