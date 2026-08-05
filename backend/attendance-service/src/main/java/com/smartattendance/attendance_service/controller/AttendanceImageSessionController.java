package com.smartattendance.attendance_service.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.smartattendance.attendance_service.model.AttendanceImageSession;
import com.smartattendance.attendance_service.repository.AttendanceImageSessionRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/attendance/image-sessions")
public class AttendanceImageSessionController {

    private final AttendanceImageSessionRepository repository;

    public AttendanceImageSessionController(AttendanceImageSessionRepository repository) {
        this.repository = repository;
    }

    // Create
    @PostMapping
    public ResponseEntity<AttendanceImageSession> create(
            @Valid @RequestBody AttendanceImageSession attendanceImageSession) {

        AttendanceImageSession saved = repository.save(attendanceImageSession);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Get All
    @GetMapping
    public ResponseEntity<List<AttendanceImageSession>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    // Get By Id
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {

    	List<AttendanceImageSession> sessions = repository.findBySessionId(id);

        if (sessions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Attendance Image Session not found.");
        }

        return ResponseEntity.ok(sessions);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceImageSession updated) {

        Optional<AttendanceImageSession> optional = repository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Attendance Image Session not found.");
        }

        AttendanceImageSession existing = optional.get();

        existing.setInstituteId(updated.getInstituteId());
        existing.setCourseId(updated.getCourseId());
        existing.setSectionId(updated.getSectionId());
        existing.setSessionId(updated.getSessionId());
        existing.setImageUrl(updated.getImageUrl());
        existing.setUploadedImageUrl(updated.getUploadedImageUrl());
        existing.setIsFirstImage(updated.getIsFirstImage());

        repository.save(existing);

        return ResponseEntity.ok(existing);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        Optional<AttendanceImageSession> optional = repository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Attendance Image Session not found.");
        }

        repository.deleteById(id);

        return ResponseEntity.ok("Attendance Image Session deleted successfully.");
    }

}