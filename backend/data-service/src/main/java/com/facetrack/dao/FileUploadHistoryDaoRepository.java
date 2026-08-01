package com.facetrack.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.FileUploadHistory;

@Repository
public interface FileUploadHistoryDaoRepository extends JpaRepository<FileUploadHistory, Long> {
	List<FileUploadHistory> findByAdminId(Long adminId);
}
