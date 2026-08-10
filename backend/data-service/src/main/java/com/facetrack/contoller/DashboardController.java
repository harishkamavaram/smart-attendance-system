package com.facetrack.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facetrack.data_service.util.ApiResponse;
import com.facetrack.dto.DashboardInfoResponseDTO;
import com.facetrack.dto.StudentDashboardInfoResponseDTO;
import com.facetrack.service.DashboardService;

@RestController
@RequestMapping("/api/v1/data/dashboard")
public class DashboardController {
	@Autowired
	private DashboardService dashboardService;
	
	@GetMapping("/{instituteId}")
	public ResponseEntity<ApiResponse<DashboardInfoResponseDTO>> getMetrics(@PathVariable Long instituteId){
		return dashboardService.getInfo(instituteId);
	}
	
	@GetMapping("/student/{id}")
	public ResponseEntity<ApiResponse<StudentDashboardInfoResponseDTO>> getStudentMetrics(@PathVariable Long id){
		return dashboardService.getStudentInfo(id);
	}
}
