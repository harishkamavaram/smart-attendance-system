package com.facetrack.dto;

import com.facetrack.enums.UploadStatus;

public class FileUploadHistoryResponseDTO {

    private Long id;
    private String fileName;
    private int totalRows;
    private int registeredRows;
    private int failedRows;
    private UploadStatus status;

    private Long adminId;
    private String adminName;

    public FileUploadHistoryResponseDTO() {
    }

    public FileUploadHistoryResponseDTO(
            Long id,
            String fileName,
            int totalRows,
            int registeredRows,
            int failedRows,
            UploadStatus status,
            Long adminId,
            String adminName) {

        this.id = id;
        this.fileName = fileName;
        this.totalRows = totalRows;
        this.registeredRows = registeredRows;
        this.failedRows = failedRows;
        this.status = status;
        this.adminId = adminId;
        this.adminName = adminName;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public int getTotalRows() {
		return totalRows;
	}

	public void setTotalRows(int totalRows) {
		this.totalRows = totalRows;
	}

	public int getRegisteredRows() {
		return registeredRows;
	}

	public void setRegisteredRows(int registeredRows) {
		this.registeredRows = registeredRows;
	}

	public int getFailedRows() {
		return failedRows;
	}

	public void setFailedRows(int failedRows) {
		this.failedRows = failedRows;
	}

	public UploadStatus getStatus() {
		return status;
	}

	public void setStatus(UploadStatus status) {
		this.status = status;
	}

	public Long getAdminId() {
		return adminId;
	}

	public void setAdminId(Long adminId) {
		this.adminId = adminId;
	}

	public String getAdminName() {
		return adminName;
	}

	public void setAdminName(String adminName) {
		this.adminName = adminName;
	}

    
}