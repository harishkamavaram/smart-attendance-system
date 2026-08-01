package com.smartattendance.attendance_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartattendance.attendance_service.model.FaceEmbedding;
import com.smartattendance.attendance_service.service.FaceEmbeddingService;

@RestController
@RequestMapping("/api/detected-faces")
public class FaceEmbeddingControlller {

	@Autowired
    private FaceEmbeddingService FaceService;
	
	
	 @PostMapping
	    public ResponseEntity<?> create(@RequestBody FaceEmbedding face) {
	        try {
	            return ResponseEntity.ok(FaceService.createDetectedFace(face));
	        } catch (RuntimeException ex) {
	            return ResponseEntity.badRequest().body(ex.getMessage());
	        }
	    }

	    @GetMapping
	    public List<FaceEmbedding> getAll() {
	        return FaceService.getAllDetectedFaces();
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<?> getById(@PathVariable Long id) {
	        try {
	            return ResponseEntity.ok(FaceService.getDetectedFaceById(id));
	        } catch (RuntimeException ex) {
	            return ResponseEntity.status(404).body(ex.getMessage());
	        }
	    }

	    @PutMapping("/{id}")
	    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody FaceEmbedding face) {
	        try {
	            return ResponseEntity.ok(FaceService.updateDetectedFace(id, face));
	        } catch (RuntimeException ex) {
	            return ResponseEntity.status(404).body(ex.getMessage());
	        }
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<?> delete(@PathVariable Long id) {
	        try {
	            FaceService.deleteDetectedFace(id);
	            return ResponseEntity.ok("Detected face deleted successfully");
	        } catch (RuntimeException ex) {
	            return ResponseEntity.status(404).body(ex.getMessage());
	        }
	    }
	
	
}
