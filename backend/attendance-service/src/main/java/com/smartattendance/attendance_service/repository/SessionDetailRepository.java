package com.smartattendance.attendance_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartattendance.attendance_service.model.SessionDetail;

public interface SessionDetailRepository extends JpaRepository<SessionDetail, Long> {

}
