package com.facetrack.repository;


import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.facetrack.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
	List<Attendance> findByStudentId(Long studentId);
	
	long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(Long studentId, String status);
    
    boolean existsByStudentIdAndDate(Long studentId, LocalDate date);
    
    List<Attendance> findByDate(LocalDate date);
}