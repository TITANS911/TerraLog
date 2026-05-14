package com.terralog.service.impl;

import com.terralog.model.kategoriModel;
import com.terralog.service.kategoriService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class kategoriServiceImpl implements kategoriService {

    private static List<kategoriModel> daftarKategori = new ArrayList<>();

    // Variabel untuk melacak ID terakhir agar tidak bentrok
    private static int lastId = 0;

    @Override
    public void tambahKategori(kategoriModel k) {
        lastId++; // Naikkan counter ID
        k.setIdKategori(lastId); // Pasang ID baru ke objek kategori

        daftarKategori.add(k);
        System.out.println("Berhasil menambahkan ID " + lastId + ": " + k.getNamaKategori());
    }

    @Override
    public List<kategoriModel> tampilkanSemua() {
        return daftarKategori;
    }

    @Override
    public kategoriModel ambilById(int id) {
        return daftarKategori.stream()
                .filter(k -> k.getIdKategori() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public void updateKategori(int id, String namaBaru) {
        for (kategoriModel k : daftarKategori) {
            if (k.getIdKategori() == id) {
                k.setNamaKategori(namaBaru);
                System.out.println("ID " + id + " berhasil diupdate.");
                return;
            }
        }
    }

    @Override
    public void hapusKategori(int id) {
        daftarKategori.removeIf(k -> k.getIdKategori() == id);
    }
}