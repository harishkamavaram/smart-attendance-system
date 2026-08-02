//package com.smartattendance.attendance_service.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.smartattendance.attendance_service.model.AttendanceSession;
//
//import com.smartattendance.attendance_service.service.AttendanceSessionService;
//
//import jakarta.validation.Valid;
//
//@RestController
//@RequestMapping("/api/v1/attendance/sessions")
//public class AttendanceSessionController {
//
//	@Autowired
//	private AttendanceSessionService sessioncontroller;
//
//	@PostMapping
//	public ResponseEntity<?> create(@Valid @RequestBody AttendanceSession session) {
//		try {
//			return ResponseEntity.ok(sessioncontroller.createSession(session));
//		} catch (RuntimeException ex) {
//			return ResponseEntity.badRequest().body(ex.getMessage());
//		}
//	}
//
//	@GetMapping()
//	public List<AttendanceSession> getAll() {
//		return sessioncontroller.getAllSessions();
//	}
//
//	@GetMapping("/{id}")
//	public ResponseEntity<?> getById(@PathVariable Long id) {
//		try {
//			return ResponseEntity.ok(sessioncontroller.getSessionById(id));
//		} catch (RuntimeException ex) {
//			return ResponseEntity.status(404).body(ex.getMessage());
//		}
//	}
//
//	@PutMapping("/{id}")
//	public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody AttendanceSession session) {
//		try {
//			return ResponseEntity.ok(sessioncontroller.updateSession(id, session));
//		} catch (RuntimeException ex) {
//			return ResponseEntity.status(404).body(ex.getMessage());
//		}
//	}
//
//	@DeleteMapping("/{id}")
//	public ResponseEntity<?> delete(@PathVariable Long id) {
//		try {
//			sessioncontroller.deleteSession(id);
//			return ResponseEntity.ok("Session deleted successfully");
//		} catch (RuntimeException ex) {
//			return ResponseEntity.status(404).body(ex.getMessage());
//		}
//	}
//}
