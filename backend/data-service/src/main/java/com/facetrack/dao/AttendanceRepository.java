package com.facetrack.dao;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.facetrack.models.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	List<Attendance>  findBySessionIdAndStudentId(Long sessionId, Long studentId);

}

