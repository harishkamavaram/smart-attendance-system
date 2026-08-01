package com.smartattendance.attendance_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartattendance.attendance_service.model.AttendanceSession;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

	List<AttendanceSession> findByTeacherId(Long teacherId);
    List<AttendanceSession> findBySubject(String subject);
	
}
