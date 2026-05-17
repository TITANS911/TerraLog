package com.terralog.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "waste")

public class sampahModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "waste_id")
    private Long wasteId;

    @Column(name = "nama_sampah", length = 50)
    private String namaSampah;

    @Column(name = "deskripsi")
    private String deskripsi;

    @Column(name = "user_id")
    private Long userId;
    private Double organik;
    private Double anorganik;
    private Double campuran;
    private Double b3;
    @Column(name = "tanggal_input")
    private LocalDateTime tanggalInput = LocalDateTime.now();
    private String status = "PENDING";

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }

    public String getNamaSampah() {
        return namaSampah;
    }
    
    public void setNamaSampah(String namaSampah) {
        this.namaSampah = namaSampah;
    }

    public Long getWasteId() {
        return wasteId;
    }

    public void setWasteId(Long wasteId) {
        this.wasteId = wasteId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getOrganik() {
        return organik;
    }

    public void setOrganik(Double organik) {
        this.organik = organik;
    }

    public Double getAnorganik() {
        return anorganik;
    }

    public void setAnorganik(Double anorganik) {
        this.anorganik = anorganik;
    }

    public Double getCampuran() {
        return campuran;
    }

    public void setCampuran(Double campuran) {
        this.campuran = campuran;
    }

    public Double getB3() {
        return b3;
    }

    public void setB3(Double b3) {
        this.b3 = b3;
    }

    public LocalDateTime getTanggalInput() {
        return tanggalInput;
    }

    public void setTanggalInput(LocalDateTime tanggalInput) {
        this.tanggalInput = tanggalInput;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
