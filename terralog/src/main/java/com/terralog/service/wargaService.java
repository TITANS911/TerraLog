package com.terralog.service;
import java.util.List;
import com.terralog.model.wargaModel;

public interface wargaService {
    List<wargaModel> getAllWarga();
    wargaModel saveWarga(wargaModel warga);
    
    // Cukup tuliskan "kontrak" method-nya saja di sini
    wargaModel getWargaById(Long id); 
    void deleteWarga(Long id);
}