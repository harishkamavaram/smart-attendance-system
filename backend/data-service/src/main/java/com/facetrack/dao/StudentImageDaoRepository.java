package com.facetrack.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.StudentImage;

@Repository
public interface StudentImageDaoRepository extends JpaRepository<StudentImage, Long>{
	List<StudentImage> findByStudentId(Long studentId);
}
