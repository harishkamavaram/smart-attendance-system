package com.smartattendance.attendance_service.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartattendance.attendance_service.model.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
	
	 Optional<Attendance> findByStudentIdAndSubjectAndAttendanceDate(String string, String subject, LocalDate attendanceDate);

	    List<Attendance> findByStudentId(String studentId);

	    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

	    List<Attendance> findBySubject(String subject);
	    
    long countByStudentIdAndSubjectAndStatus(Long studentId, String subject, String status);
	    
	    List<Attendance> findByStudentIdAndSubject(String studentId, String subject);

	    List<Attendance> findByAttendanceDateBetween(LocalDate startDate, LocalDate endDate);

	    long countByStudentIdAndSubject(String studentId, String subject);
	    
	    long countByStudentId(String studentId);

	    long countByStudentIdAndStatus(String studentId, String status);

}
