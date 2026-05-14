package com.terralog.repository;

import com.terralog.model.kategoriModel;
import org.springframework.stereotype.Repository; // Tambahkan ini
import java.util.ArrayList;
import java.util.List;
import java.util.Optional; // Tambahkan ini agar lebih aman

@Repository // Tambahkan anotasi ini agar bisa di-inject ke Service
public class kategoriRepository {
    private List<kategoriModel> dbKategori = new ArrayList<>();

    // Simpan Data
    public void save(kategoriModel k) {
        dbKategori.add(k);
    }

    // Ambil Semua
    public List<kategoriModel> findAll() {
        return dbKategori;
    }

    // PENTING: Cari satu data berdasarkan ID (Buat fungsi Edit)
    public kategoriModel findById(int id) {
        return dbKategori.stream()
                .filter(k -> k.getIdKategori() == id)
                .findFirst()
                .orElse(null); // Return null kalau ID gak ketemu
    }

    // Update
    public boolean update(int id, String namaBaru) {
        for (kategoriModel k : dbKategori) {
            if (k.getIdKategori() == id) {
                k.setNamaKategori(namaBaru);
                return true;
            }
        }
        return false;
    }

    // Delete
    public boolean delete(int id) {
        return dbKategori.removeIf(k -> k.getIdKategori() == id);
    }
}