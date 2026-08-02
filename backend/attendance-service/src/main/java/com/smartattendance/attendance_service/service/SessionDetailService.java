package com.smartattendance.attendance_service.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import com.smartattendance.attendance_service.dto.ApiResponse;
import com.smartattendance.attendance_service.model.SessionDetail;
import com.smartattendance.attendance_service.repository.SessionDetailRepository;

@Service
public class SessionDetailService {

	@Autowired
	private SessionDetailRepository sessionDetailRepository;
	@Autowired
	private RestTemplate restTemplate;
	@Autowired
	private DiscoveryClient discoveryClient;

	@Value("${dataurl}")
	private String dataUrl;

	public SessionDetail createSessionDetails(SessionDetail details) {
		List<ServiceInstance> instances = discoveryClient.getInstances("DATA-SERVICE");
		System.out.println(instances);
		
		String url = dataUrl + "/api/v1/data/students/count/course/" + details.getCourseId();

		ResponseEntity<ApiResponse<Long>> response = restTemplate.exchange(url, HttpMethod.GET, null,
				new ParameterizedTypeReference<ApiResponse<Long>>() {
				});

		Long studentCount = response.getBody().getData();
		
		System.out.println("studentCount: " + studentCount);
		
		details.setTotalStudents(studentCount.intValue());
		details.setPresent(0);
		details.setAbsent(0);
		details.setAccuracy(0.0);
		details.setStatus("Scheduled");

		return sessionDetailRepository.save(details);
	}

	public List<SessionDetail> getAllSessionDetails() {
		return sessionDetailRepository.findAll();
	}

	public SessionDetail getSessionDetailsById(Long id) {
		return sessionDetailRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Session Details not found with id: " + id));
	}

	public SessionDetail updateSessionDetails(Long id, SessionDetail updated) {

		SessionDetail existing = sessionDetailRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Session Details not found with id: " + id));

		existing.setCourseId(updated.getCourseId());
		existing.setSectionId(updated.getSectionId());

		existing.setCourseName(updated.getCourseName());
		existing.setSectionName(updated.getSectionName());
		existing.setSessionName(updated.getSessionName());

		existing.setDate(updated.getDate());
		existing.setStartTime(updated.getStartTime());
		existing.setEndTime(updated.getEndTime());

		existing.setRoom(updated.getRoom());

		existing.setTotalStudents(updated.getTotalStudents());
		existing.setPresent(updated.getPresent());
		existing.setAbsent(updated.getAbsent());

		existing.setStatus(updated.getStatus());
		existing.setAccuracy(updated.getAccuracy());

		return sessionDetailRepository.save(existing);
	}

	public void deleteSessionDetails(Long id) {

		if (!sessionDetailRepository.existsById(id)) {
			throw new RuntimeException("Session Details not found with id: " + id);
		}

		sessionDetailRepository.deleteById(id);
	}
}