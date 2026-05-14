package com.terralog.model;

public class kategoriModel {
    private int idKategori;
    private String namaKategori;

    // 1. WAJIB ADA: Constructor kosong untuk framework (Jackson/Spring)
    public kategoriModel() {
    }

    // 2. Constructor dengan parameter (opsional, tapi bagus buat testing)
    public kategoriModel(int idKategori, String namaKategori) { 
        this.idKategori = idKategori;
        this.namaKategori = namaKategori;
    }

    // Getter dan Setter (Sudah benar)
    public int getIdKategori() { return idKategori; }
    public void setIdKategori(int idKategori) { this.idKategori = idKategori; }

    public String getNamaKategori() { return namaKategori; }
    public void setNamaKategori(String namaKategori) { this.namaKategori = namaKategori; }
}