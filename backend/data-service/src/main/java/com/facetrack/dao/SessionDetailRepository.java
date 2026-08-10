package com.facetrack.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.facetrack.models.SessionDetail;

public interface SessionDetailRepository extends JpaRepository<SessionDetail, Long> {

//	List<SessionDetail> findByInstituteIdAndDate(Long instituteId, LocalDate date);

	List<SessionDetail> findByDate(LocalDate date);

	List<SessionDetail> findByCourseIdAndDate(Long courseId, LocalDate today);

}
