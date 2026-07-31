package com.facetrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.entity.Student;

@Repository
public interface Studentrepository extends JpaRepository<Student, Long>  {
	
}
