package com.smartattendance.attendance_service.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.smartattendance.attendance_service.model.AttendanceSession;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

	
	
}
