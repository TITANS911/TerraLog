package com.terralog.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users") 
public class userModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // Sesuai gambar: user_id
    private Long userId;
    
    private String nama;
    private String alamat;

    @Column(name = "no_hp") // Sesuai gambar: no_hp
    private String noHp;

    private String komplek;
    private String role; 
    private String username;
    private String password;

    // --- Getter dan Setter (Tetap Pakai CamelCase Gak Apa-apa) ---
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }

    public String getAlamat() { return alamat; }
    public void setAlamat(String alamat) { this.alamat = alamat; }

    public String getNoHp() { return noHp; }
    public void setNoHp(String noHp) { this.noHp = noHp; }

    public String getKomplek() { return komplek; }
    public void setKomplek(String komplek) { this.komplek = komplek; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}