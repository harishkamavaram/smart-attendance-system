//package com.smartattendance.attendance_service.service;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.smartattendance.attendance_service.model.FaceEmbedding;
//import com.smartattendance.attendance_service.repository.FaceEmbeddingRepositoty;
//
//@Service
//public class FaceEmbeddingService {
//
//	 @Autowired
//	    private FaceEmbeddingRepositoty FaceRepository;
//	 
//	 public FaceEmbedding createDetectedFace(FaceEmbedding face) {
//	        return FaceRepository.save(face);
//	    }
//
//	    public List<FaceEmbedding> getAllDetectedFaces() {
//	        return FaceRepository.findAll();
//	    }
//
//	    public FaceEmbedding getDetectedFaceById(Long id) {
//	        return FaceRepository.findById(id)
//	                .orElseThrow(() -> new RuntimeException("Detected face not found with id: " + id));
//	    }
//
//	    public FaceEmbedding updateDetectedFace(Long id, FaceEmbedding updated) {
//	        FaceEmbedding existing = FaceRepository.findById(id)
//	                .orElseThrow(() -> new RuntimeException("Detected face not found with id: " + id));
//
//	        existing.setStudentId(updated.getStudentId());
//	        existing.setStudentName(updated.getStudentName());
//	        existing.setScore(updated.getScore());
//	        existing.setSessionId(updated.getSessionId());
//	        existing.setImageUrl(updated.getImageUrl());
//
//	        return FaceRepository.save(existing);
//	    }
//
//	    public void deleteDetectedFace(Long id) {
//	        if (!FaceRepository.existsById(id)) {
//	            throw new RuntimeException("Detected face not found with id: " + id);
//	        }
//	        FaceRepository.deleteById(id);
//	    }
//}
