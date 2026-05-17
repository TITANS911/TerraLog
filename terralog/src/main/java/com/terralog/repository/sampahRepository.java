package com.terralog.repository;

import com.terralog.model.sampahModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface sampahRepository extends JpaRepository<sampahModel, Long> {
    List<sampahModel> findByUserId(Long userId);

}
