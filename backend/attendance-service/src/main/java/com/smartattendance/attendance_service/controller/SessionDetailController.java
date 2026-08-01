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

import com.smartattendance.attendance_service.model.SessionDetail;
import com.smartattendance.attendance_service.service.SessionDetailService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/session-details")
public class SessionDetailController {

	@Autowired
    private SessionDetailService sessionDetailService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody SessionDetail details) {
        try {
            return ResponseEntity.ok(sessionDetailService.createSessionDetails(details));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/all")
    public List<SessionDetail> getAll() {
        return sessionDetailService.getAllSessionDetails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(sessionDetailService.getSessionDetailsById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody SessionDetail details) {
        try {
            return ResponseEntity.ok(sessionDetailService.updateSessionDetails(id, details));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            sessionDetailService.deleteSessionDetails(id);
            return ResponseEntity.ok("Session Details deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        }
	
	
}
}
