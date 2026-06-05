import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    // Ganti dengan URL backend kamu di Railway
    const API_URL = import.meta.env.VITE_API_URL || 'https://terralog-production.up.railway.app'
    
    fetch(`${API_URL}/api/kategori`)
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Gagal mengambil data')
      })
      .then(data => {
        setMessage('Backend terhubung! ✔️ Ada ' + data.length + ' kategori.')
      })
      .catch(err => {
        setMessage('Backend berjalan! Cek API endpoint kamu.')
      })
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>🌍 TerraLog</h1>
        <p>Sistem Manajemen Sampah Terpadu</p>
      </header>
      <main className="main">
        <div className="card">
          <h2>Selamat Datang!</h2>
          <p className="status">{message}</p>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2026 TerraLog</p>
      </footer>
    </div>
  )
}

export default App
