package com.terralog.model;

import jakarta.persistence.*;
@Entity

public class wargaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String nama;
    private String alamat;
	private String noHp;
	private String komplek;

	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getNama() {
		return nama;
	}
	public void setNama(String nama) {
		this.nama = nama;
	}
	public String getAlamat() {
		return alamat;
	}
	public void setAlamat(String alamat) {
		this.alamat = alamat;
	}
	public String getNoHp() {
		return noHp;
	}
	public void setNoHp(String noHp) {
		this.noHp = noHp;
	}
	public String getKomplek() {
	    return komplek;
	}
	public void setKomplek(String komplek) {
	    this.komplek = komplek;
	}
    

}
