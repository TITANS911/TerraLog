package com.terralog.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.terralog.model.wargaModel;
import com.terralog.service.wargaService;

@RestController
@RequestMapping("/api/warga")
@CrossOrigin(origins = "*") 
public class wargaController {

    @Autowired
    private wargaService wargaService;

    @GetMapping
    public List<wargaModel> getAllWarga() {
        return wargaService.getAllWarga();
    }

    @PostMapping
    public wargaModel createWarga(@RequestBody wargaModel warga) {
        return wargaService.saveWarga(warga);
    }

    // Method Delete
    @DeleteMapping("/{id}")
    public void deleteWarga(@PathVariable("id") Long id) { // Tambahkan ("id") agar eksplisit
        wargaService.deleteWarga(id);
    }
    
    // Method Update
    @PutMapping("/{id}")
    public wargaModel updateWarga(@PathVariable("id") Long id, @RequestBody wargaModel dataBaru) {
        wargaModel wargaLama = wargaService.getWargaById(id);
        if (wargaLama != null) {
            wargaLama.setNama(dataBaru.getNama());
            wargaLama.setAlamat(dataBaru.getAlamat());
            wargaLama.setNoHp(dataBaru.getNoHp());
            wargaLama.setKomplek(dataBaru.getKomplek());
            return wargaService.saveWarga(wargaLama);
        }
        return null;
    }
}
