package com.smartattendance.attendance_service.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartattendance.attendance_service.model.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	Optional<Attendance> findByStudentIdAndAttendanceDate(String string,
			LocalDate attendanceDate);
	
	List<Attendance> findBySessionId(Long sessionId);
	
	List<Attendance> findByStudentId(String studentId);

	List<Attendance> findByAttendanceDate(LocalDate attendanceDate);


	long countByStudentIdAndStatus(Long studentId, String status);


	List<Attendance> findByAttendanceDateBetween(LocalDate startDate, LocalDate endDate);

	long countByStudentId(String studentId);

	long countByStudentIdAndStatus(String studentId, String status);

	Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate attendanceDate);

	Optional<Attendance>  findBySessionIdAndStudentId(Long sessionId, Long studentId);

}
