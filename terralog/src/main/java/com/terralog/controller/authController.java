package com.terralog.controller;

import com.terralog.model.userModel;
import com.terralog.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin sudah dihapus karena sudah di-handle secara global oleh
// WebConfig.java kamu!
public class authController {

    @Autowired
    private userService userService;

    @GetMapping
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Auth API is running");
        response.put("endpoints", "POST /api/auth/login, POST /api/auth/register");
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody userModel loginData) {
        Map<String, Object> response = new HashMap<>();

        try {
            userModel user = userService.login(loginData.getUsername(), loginData.getPassword());

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
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Terjadi kesalahan internal pada server: " + e.getMessage());
        }

        return response;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody userModel userData) {
        Map<String, Object> response = new HashMap<>();
        try {
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
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
        }
        return response;
    }
}