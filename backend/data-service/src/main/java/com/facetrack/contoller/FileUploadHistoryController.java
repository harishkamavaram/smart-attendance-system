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

import com.facetrack.dao.FileUploadHistoryDaoRepository;
import com.facetrack.data_service.payload.ApiResponse;
import com.facetrack.data_service.util.ResponseUtil;
import com.facetrack.dto.FileUploadHistoryResponseDTO;
import com.facetrack.models.FileUploadHistory;

@RestController
@RequestMapping("/api/v1/data/fileUploadHistory")
public class FileUploadHistoryController {

	private FileUploadHistoryResponseDTO toDTO(FileUploadHistory history) {

		return new FileUploadHistoryResponseDTO(history.getId(), history.getFileName(), history.getTotalRows(),
				history.getRegisteredRows(), history.getFailedRows(), history.getStatus(),

				history.getAdmin().getId(), history.getAdmin().getName());
	}

	@Autowired
	private FileUploadHistoryDaoRepository fileUploadHistoryDAO;

	@GetMapping
	public ResponseEntity<ApiResponse<List<FileUploadHistoryResponseDTO>>> getAll() {

		List<FileUploadHistoryResponseDTO> history = fileUploadHistoryDAO.findAll().stream().map(this::toDTO).toList();

		return ResponseEntity.ok(ResponseUtil.success("Upload history fetched successfully.", history));
	}

	@GetMapping("/{adminId}")
	public ResponseEntity<ApiResponse<List<FileUploadHistoryResponseDTO>>> getByAdminId(@PathVariable Long adminId) {

		List<FileUploadHistory> histories = fileUploadHistoryDAO.findByAdminId(adminId);

		if (histories.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseUtil.error("No upload history found."));
		}

		List<FileUploadHistoryResponseDTO> response = histories.stream().map(this::toDTO).toList();

		return ResponseEntity.ok(ResponseUtil.success("Upload history fetched successfully.", response));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {

		if (!fileUploadHistoryDAO.existsById(id)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseUtil.error("Record not found."));
		}

		fileUploadHistoryDAO.deleteById(id);

		return ResponseEntity.ok(ResponseUtil.success("Record deleted successfully."));
	}
}
