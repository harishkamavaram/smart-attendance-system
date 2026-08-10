package com.facetrack.dto;

import java.util.List;

import com.facetrack.models.SessionDetail;

public record DashboardInfoResponseDTO(Integer totalStudents, Double attendanceToday,Integer present, Integer Absent,
		Integer pendingRegistration,List<SessionDetail> todaySessions) {

}