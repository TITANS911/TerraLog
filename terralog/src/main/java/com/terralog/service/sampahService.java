package com.terralog.service;
import com.terralog.model.sampahModel;
import java.util.List;

public interface sampahService {
    sampahModel saveSampah(sampahModel sampah);
    List<sampahModel> getAllSampah();
    List<sampahModel> getSampahByUserId(Long userId);
    sampahModel updateStatus(Long id, String status);
    sampahModel getSampahById(Long id);
    void deleteSampah(Long id);
}
