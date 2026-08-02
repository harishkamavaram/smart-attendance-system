package com.smartattendance.attendance_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartattendance.attendance_service.model.AttendanceImageSession;

@Repository
public interface AttendanceImageSessionRepository extends JpaRepository<AttendanceImageSession, Long> {

}
