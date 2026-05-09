package com.terralog.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.terralog.model.userModel;
import com.terralog.service.userService; // Nanti pelan-pelan rename ini jadi userService ya

@RestController
@RequestMapping("/api/users") // Ubah ke /users agar lebih umum
@CrossOrigin(origins = "*")
public class userController {

    @Autowired
    private userService userService; // Variabel kita namakan userService agar tidak bingung

    // --- GET ALL USERS ---
    @GetMapping
    public List<userModel> getAllUsers() {
        return userService.getAllUsers(); // Method di service masih pakai nama lama nggak apa-apa
    }

    // --- CREATE USER ---
    @PostMapping
    public userModel createUser(@RequestBody userModel user) {
        return userService.saveUser(user);
    }

    // --- GET USER BY ID ---
    @GetMapping("/{id}")
    public userModel getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // --- UPDATE USER ---
    @PutMapping("/{id}")
    public userModel updateUser(@PathVariable Long id, @RequestBody userModel dataBaru) {
        userModel userLama = userService.getUserById(id);

        if (userLama != null) {
            userLama.setNama(dataBaru.getNama());
            userLama.setAlamat(dataBaru.getAlamat());
            userLama.setNoHp(dataBaru.getNoHp());
            userLama.setKomplek(dataBaru.getKomplek());

            // Tambahkan field baru untuk User jika sudah ada di model
            userLama.setRole(dataBaru.getRole());
            userLama.setUsername(dataBaru.getUsername());

            // Jangan lupa set password hanya jika tidak kosong
            if (dataBaru.getPassword() != null && !dataBaru.getPassword().isEmpty()) {
                userLama.setPassword(dataBaru.getPassword());
            }

            return userService.saveUser(userLama);
        }
        return null;
    }

    // --- DELETE USER ---
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}