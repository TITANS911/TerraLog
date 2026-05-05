package com.terralog.repository;

import com.terralog.model.wargaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; 

@Repository

public interface wargaRepository extends JpaRepository<wargaModel, Long>{
	
}



