package com.facetrack.contoller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facetrack.dao.StudentDaoRepository;
import com.facetrack.data_service.util.ApiResponse;
import com.facetrack.data_service.util.ResponseUtil;
import com.facetrack.dto.StudentResponseDTO;
import com.facetrack.models.Student;

@RestController
@RequestMapping("/api/v1/data/students")
public class StudentController {
	private StudentResponseDTO toDTO(Student student) {

		return new StudentResponseDTO(student.getId(), student.getRollNumber(), student.getFirstName(),
				student.getLastName(), student.getEmail(),

				student.getInstitute().getId(), student.getInstitute().getName(),

				student.getCourse().getId(), student.getCourse().getName(),

				student.getBatch(), student.getSection(),

				student.isHasImages(), student.isHasEmbeddings(), student.getIsPasswordUpdated(),

				student.getParentName(), student.getParentMobileNumber(), student.getParentEmail(),

				student.getPointId());
	}

	@Autowired
	private StudentDaoRepository studentDAO;

	@GetMapping("/find/{id}")
	public ResponseEntity<ApiResponse<StudentResponseDTO>> getStudent(@PathVariable Long id) {

		Optional<Student> student = studentDAO.findById(id);

		if (student.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseUtil.error("Student not found."));
		}

		return ResponseEntity.ok(ResponseUtil.success("Student fetched successfully.", toDTO(student.get())));
	}

	@GetMapping("/{instituteId}")
	public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getStudentsByInstitute(
			@PathVariable Long instituteId) {

		List<Student> students = studentDAO.findByInstituteId(instituteId);

		if (students.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseUtil.error("No students found."));
		}

		List<StudentResponseDTO> response = students.stream().map(this::toDTO).toList();

		return ResponseEntity.ok(ResponseUtil.success("Students fetched successfully.", response));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {

		if (!studentDAO.existsById(id)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseUtil.error("Student not found."));
		}

		studentDAO.deleteById(id);

		return ResponseEntity.ok(ResponseUtil.success("Student deleted successfully."));
	}

	@GetMapping("/count/course/{courseId}")
	public ResponseEntity<ApiResponse<Long>> getStudentCountByCourseId(@PathVariable Long courseId) {

		long count = studentDAO.countByCourseId(courseId);

		return ResponseEntity.ok(ResponseUtil.success("Student count fetched successfully.", count));
	}

//	@GetMapping
//	public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getAllStudents() {
//
//		List<StudentResponseDTO> students = studentDAO.findAll().stream().map(this::toDTO).toList();
//
//		return ResponseEntity.ok(ResponseUtil.success("Students fetched successfully.", students));
//	}

//	@PutMapping("/{id}")
//	public ResponseEntity<ApiResponse<Student>> updateStudent(@PathVariable Long id, @RequestBody Student student) {
//
//		Optional<Student> optional = studentDAO.findById(id);
//
//		if (optional.isEmpty()) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseUtil.error("Student not found."));
//		}
//
//		Student existing = optional.get();
//
//		existing.setFirstName(student.getFirstName());
//		existing.setLastName(student.getLastName());
//
//		existing.setBatch(student.getBatch());
//		existing.setSection(student.getSection());
//
//		existing.setParentName(student.getParentName());
//		existing.setParentMobileNumber(student.getParentMobileNumber());
//		existing.setParentEmail(student.getParentEmail());
//
//		existing.setCourse(student.getCourse());
//		existing.setInstitute(student.getInstitute());
//
//		// Optional fields
//		existing.setPointId(student.getPointId());
//
//		// Flags (only if they are intended to be updated)
//		existing.setHasImages(student.isHasImages());
//		existing.setHasEmbeddings(student.isHasEmbeddings());
//		existing.setPasswordUpdated(student.getIsPasswordUpdated());
//
//		Student updated = studentDAO.save(existing);
//
//		return ResponseEntity.ok(ResponseUtil.success("Student updated successfully.", updated));
//	}

}