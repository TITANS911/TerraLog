package com.terralog.service.impl;

// SESUAIKAN: Pastikan nama class di file tujuan memang huruf kecil depannya
import com.terralog.model.sampahModel; 
import com.terralog.repository.sampahRepository;
import com.terralog.service.sampahService; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class sampahServiceImpl implements sampahService {

    @Autowired
    private sampahRepository sampahRepository; // Pakai s kecil sesuai nama file

    @Override
    public sampahModel saveSampah(sampahModel sampah) {
        return sampahRepository.save(sampah);
    }

    @Override
    public List<sampahModel> getAllSampah() {
        return sampahRepository.findAll();
    }

    @Override
    public List<sampahModel> getSampahByUserId(Long userId) {
        // Pastikan di sampahRepository.java sudah ada method: List<sampahModel> findByUserId(Long userId);
        return sampahRepository.findByUserId(userId);
    }

    @Override
    public sampahModel updateStatus(Long id, String status) {
        sampahModel sampah = sampahRepository.findById(id).orElse(null);
        if (sampah != null) {
            sampah.setStatus(status);
            return sampahRepository.save(sampah);
        }
        return null;
    }

    @Override
    public void deleteSampah(Long id) {
        sampahRepository.deleteById(id);
    }

    @Override
    public sampahModel getSampahById(Long id) {
        // Menggunakan findById bawaan JpaRepository, kalau kosong return null
        return sampahRepository.findById(id).orElse(null);
    }
}