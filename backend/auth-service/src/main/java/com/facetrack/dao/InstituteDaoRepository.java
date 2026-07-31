package com.facetrack.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.Institute;

@Repository
public interface InstituteDaoRepository extends JpaRepository<Institute, Long> {
	
	boolean existsByName(String name);

	boolean existsByInstituteCode(Integer instituteCode);

	boolean existsByEmail(String email);
}
