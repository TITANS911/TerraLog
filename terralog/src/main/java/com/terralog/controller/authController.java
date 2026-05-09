package com.terralog.controller;

import com.terralog.model.userModel;
import com.terralog.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// Tambahin ini biar React nggak kena blokir pintu
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.OPTIONS})
public class authController {

    @Autowired
    private userService userService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody userModel loginData) {
        userModel user = userService.login(loginData.getUsername(), loginData.getPassword());
        Map<String, Object> response = new HashMap<>();
        
        if (user != null) {
            response.put("success", true);
            response.put("message", "Login Berhasil");
            response.put("role", user.getRole());
            response.put("nama", user.getNama());
            response.put("userId", user.getUserId());
        } else {
            response.put("success", false);
            response.put("message", "Username atau Password Salah!");
        }
        return response;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody userModel userData) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Set default role jika kosong
            if (userData.getRole() == null || userData.getRole().isEmpty()) {
                userData.setRole("WARGA");
            }
            
            userModel savedUser = userService.saveUser(userData);
            if (savedUser != null) {
                response.put("success", true);
                response.put("message", "Registrasi Berhasil!");
            } else {
                response.put("success", false);
                response.put("message", "Gagal simpan user.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }
}