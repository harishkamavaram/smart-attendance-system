package com.facetrack.contoller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facetrack.dao.StudentImageDaoRepository;
import com.facetrack.data_service.util.ApiResponse;
import com.facetrack.data_service.util.ResponseUtil;
import com.facetrack.dto.StudentImageResponseDTO;
import com.facetrack.models.StudentImage;

@RestController
@RequestMapping("/api/v1/data/studentImages")
public class StudentImageController {

	@Autowired
	private StudentImageDaoRepository studentImageDAO;

	@GetMapping
	public ResponseEntity<ApiResponse<List<StudentImageResponseDTO>>> getAll() {

		List<StudentImageResponseDTO> images = studentImageDAO.findAll().stream()
				.map(img -> new StudentImageResponseDTO(img.getId(), img.getStudent().getId(), img.getImageUrl()))
				.toList();

		return ResponseEntity.ok(ResponseUtil.success("Images fetched successfully.", images));
	}

//	@GetMapping("/{id}")
//	public ResponseEntity<ApiResponse<StudentImageResponseDTO>> getById(@PathVariable Long id) {
//
//		Optional<StudentImage> image = studentImageDAO.findById(id);
//
//		if (image.isEmpty()) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseUtil.error("Image not found."));
//		}
//
//		StudentImage img = image.get();
//
//		StudentImageResponseDTO dto = new StudentImageResponseDTO(img.getId(), img.getStudent().getId(),
//				img.getImageUrl());
//
//		return ResponseEntity.ok(ResponseUtil.success("Image fetched successfully.", dto));
//	}
	@GetMapping("/{studentId}")
	public ResponseEntity<ApiResponse<List<StudentImageResponseDTO>>> getByStudentId(
	        @PathVariable Long studentId) {

	    List<StudentImage> images = studentImageDAO.findByStudentId(studentId);

	    if (images.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body(ResponseUtil.error("No images found for this student."));
	    }

	    List<StudentImageResponseDTO> response = images.stream()
	            .map(img -> new StudentImageResponseDTO(
	                    img.getId(),
	                    img.getStudent().getId(),
	                    img.getImageUrl()))
	            .toList();

	    return ResponseEntity.ok(
	            ResponseUtil.success("Images fetched successfully.", response)
	    );
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {

		if (!studentImageDAO.existsById(id)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseUtil.error("Image not found."));
		}

		studentImageDAO.deleteById(id);

		return ResponseEntity.ok(ResponseUtil.success("Image deleted successfully."));
	}
}
