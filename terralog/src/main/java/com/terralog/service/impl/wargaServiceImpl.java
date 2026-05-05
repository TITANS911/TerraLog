package com.terralog.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.terralog.model.wargaModel;
import com.terralog.repository.wargaRepository;
import com.terralog.service.wargaService;

@Service
public class wargaServiceImpl implements wargaService {

    @Autowired
    private wargaRepository wargaRepository;

    // Method ini mungkin sudah ada
    @Override
    public List<wargaModel> getAllWarga() {
        return wargaRepository.findAll();
    }

    // Method ini yang harus kamu tambahkan (Fix error 1)
    @Override
    public wargaModel getWargaById(Long id) {
        return wargaRepository.findById(id).orElse(null);
    }

    // Method ini yang harus kamu tambahkan (Fix error 2)
    @Override
    public void deleteWarga(Long id) {
        wargaRepository.deleteById(id);
    }

    // Tambahkan juga saveWarga jika belum ada untuk fitur Update/Create
    @Override
    public wargaModel saveWarga(wargaModel warga) {
        return wargaRepository.save(warga);
    }
}