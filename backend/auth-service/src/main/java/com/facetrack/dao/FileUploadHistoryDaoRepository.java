package com.facetrack.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.facetrack.models.FileUploadHistory;

@Repository
public interface FileUploadHistoryDaoRepository extends JpaRepository<FileUploadHistory, Long>{

}
