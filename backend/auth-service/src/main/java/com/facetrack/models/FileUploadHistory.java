package com.facetrack.models;

import com.facetrack.enums.UploadStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "file_upload_history")
public class FileUploadHistory extends BaseEntity {

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private int totalRows;

    @Column(nullable = false)
    private int registeredRows;

    @Column(nullable = false)
    private int failedRows;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UploadStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

	public FileUploadHistory() {
		super();
	}

	public FileUploadHistory(String fileName, int totalRows, int registeredRows, int failedRows, UploadStatus status,
			Admin admin) {
		super();
		this.fileName = fileName;
		this.totalRows = totalRows;
		this.registeredRows = registeredRows;
		this.failedRows = failedRows;
		this.status = status;
		this.admin = admin;
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

	public Admin getAdmin() {
		return admin;
	}

	public void setAdmin(Admin admin) {
		this.admin = admin;
	}

	@Override
	public String toString() {
		return "FileUploadHistory [fileName=" + fileName + ", totalRows=" + totalRows + ", registeredRows="
				+ registeredRows + ", failedRows=" + failedRows + ", status=" + status + ", admin=" + admin + "]";
	}

}