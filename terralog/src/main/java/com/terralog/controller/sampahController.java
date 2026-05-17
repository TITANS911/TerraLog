package com.terralog.controller;

import com.terralog.model.sampahModel;
import com.terralog.service.sampahService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")// Supaya aman pas ditembak dari React
public class sampahController {

    @Autowired
    private sampahService sampahService; // Pakai s kecil sesuai nama interface kamu

    // 1. Tambah Data Sampah (POST)
    @PostMapping
    public sampahModel create(@RequestBody sampahModel sampah) {
        return sampahService.saveSampah(sampah);
    }

    // 2. Ambil Semua Data (Hanya untuk Admin/Petugas nantinya)
    @GetMapping
    public List<sampahModel> getAll() {
        return sampahService.getAllSampah();
    }

    // 3. Ambil Data Spesifik per Warga (GET)
    @GetMapping("/user/{userId}")
    public List<sampahModel> getByUserId(@PathVariable Long userId) {
        return sampahService.getSampahByUserId(userId);
    }

    // 4. Update Status (Misal dari PENDING ke DIAMBIL)
    @PutMapping("/{id}/status")
    public sampahModel updateStatus(@PathVariable Long id, @RequestBody String status) {
        return sampahService.updateStatus(id, status);
    }

    // 5. Hapus Data
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        sampahService.deleteSampah(id);
        return "Data sampah berhasil dihapus!";
    }
    @GetMapping("/{id}")
    public sampahModel getById(@PathVariable Long id) {
        return sampahService.getSampahById(id); 
    }
}