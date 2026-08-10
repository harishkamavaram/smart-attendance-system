package com.facetrack.dto;

import java.util.List;

import com.facetrack.models.SessionDetail;

public record StudentDashboardInfoResponseDTO(String todayStatus, Integer totalSessionsCount, List<SessionDetail> todaySessions) {

}
