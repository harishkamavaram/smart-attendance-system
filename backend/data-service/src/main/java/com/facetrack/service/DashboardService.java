package com.facetrack.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.facetrack.dao.AttendanceRepository;
import com.facetrack.dao.SessionDetailRepository;
import com.facetrack.dao.StudentDaoRepository;
import com.facetrack.data_service.util.ApiResponse;
import com.facetrack.dto.DashboardInfoResponseDTO;
import com.facetrack.dto.StudentDashboardInfoResponseDTO;
import com.facetrack.models.Attendance;
import com.facetrack.models.SessionDetail;
import com.facetrack.models.Student;

@Service
public class DashboardService {
	@Autowired
	private StudentDaoRepository studentRepo;
	@Autowired
	private SessionDetailRepository sessionDetailRepo;
	@Autowired
	private AttendanceRepository attendanceRepo;

	public ResponseEntity<ApiResponse<DashboardInfoResponseDTO>> getInfo(Long instituteId) {

		List<Student> students = studentRepo.findByInstituteId(instituteId);
		System.out.println("Students Count: " + students.size());

		int pendingRegistrations = 0;

		for (Student s : students) {
			if (!s.isHasEmbeddings()) {
				System.out.println(s);
				pendingRegistrations++;
			}
		}
		LocalDate today = LocalDate.now();

		List<SessionDetail> sessionDetails = sessionDetailRepo.findByDate(today);

		System.out.println("Today's Sessions: " + sessionDetails.size());

		int totalPresent = 0;
		int totalAbsent = 0;

		for (SessionDetail sd : sessionDetails) {
			System.out.println(sd);
			totalPresent = totalPresent + sd.getPresent();
			totalAbsent = totalAbsent + sd.getAbsent();
		}

		int totalStudents = totalPresent + totalAbsent;

		double percentage = 0.0;

		if (totalStudents > 0) {
			percentage = (double) totalPresent / totalStudents * 100;
		}

		System.out.println("Attendance Percentage: " + percentage);

		return ResponseEntity.status(HttpStatus.OK)
				.body(new ApiResponse<>(true, "Fetching Successful.", new DashboardInfoResponseDTO(students.size(),
						percentage, totalPresent, totalAbsent, pendingRegistrations, sessionDetails)));
	}

	public ResponseEntity<ApiResponse<StudentDashboardInfoResponseDTO>> getStudentInfo(Long id) {
//		System.out.println("ID: " + id);
		Optional<Student> student = studentRepo.findById(id);
//		System.out.println(student.get());
		Long courseId = student.get().getCourse().getId();
//		System.out.println("Course Id:" + courseId);
		
		LocalDate today = LocalDate.now();
		List<SessionDetail> sessionDetails = sessionDetailRepo.findByCourseIdAndDate(courseId,today);
		
		String status = "Not Marked";
		
		for (SessionDetail sd : sessionDetails) {
			System.out.println(sd);
			if(sd.isHasUploadedImage()) {
				List<Attendance> attendance = attendanceRepo.findBySessionIdAndStudentId(sd.getId(),id);
				for(Attendance a : attendance) {
					status = a.getStatus();
				}
			}
		}
		System.out.println("Today's Sessions: " + sessionDetails.size());
		
		return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<>(true, "Fetching Successful.",
				new StudentDashboardInfoResponseDTO(status,sessionDetails.size(),sessionDetails)));
	}

}
