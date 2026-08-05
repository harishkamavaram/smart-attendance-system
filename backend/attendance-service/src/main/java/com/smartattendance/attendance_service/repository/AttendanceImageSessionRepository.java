package com.smartattendance.attendance_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartattendance.attendance_service.model.AttendanceImageSession;

@Repository
public interface AttendanceImageSessionRepository extends JpaRepository<AttendanceImageSession, Long> {

	List<AttendanceImageSession> findBySessionId(Long id);

}
