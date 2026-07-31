package com.facetrack.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.Student;

@Repository
public interface StudentDaoRepository extends JpaRepository<Student, Long> {
	
	boolean existsByRollNumber(String rollNumber);

	boolean existsByEmail(String email);
	
	Optional<Student> findByEmail(String email);
}
