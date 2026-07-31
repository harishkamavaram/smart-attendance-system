package com.facetrack.dto;

import java.time.LocalDateTime;

import com.facetrack.enums.UploadStatus;


public record FileDetails(
		Long id,
	    String fileName,
	    int totalRows,
	    int registeredRows,
	    int failedRows,
	    UploadStatus status,
	    LocalDateTime uploadedAt
) {

}
