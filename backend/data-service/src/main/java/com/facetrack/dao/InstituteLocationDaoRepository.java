package com.facetrack.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.InstituteLocation;

@Repository
public interface InstituteLocationDaoRepository extends JpaRepository<InstituteLocation, Long> {
	List<InstituteLocation> findByInstituteId(Long instituteId);
}
