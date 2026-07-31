package com.smartattendance.attendance_service.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartattendance.attendance_service.model.AttendanceSession;
import com.smartattendance.attendance_service.repository.AttendanceSessionRepository;

@RestController
@RequestMapping("/api/sessions")
public class AttendanceSessionController {

	 @Autowired
	    private AttendanceSessionRepository repo;

	    @PostMapping("/start")
	    public AttendanceSession startSession(@RequestBody AttendanceSession session) {
	        session.setSessionDate(LocalDate.now());
	        session.setStartTime(LocalTime.now());
	        session.setStatus("ACTIVE");
	        return repo.save(session);
	    }

	    @PutMapping("/end/{id}")
	    public AttendanceSession endSession(@PathVariable Long id) {
	        AttendanceSession s = repo.findById(id).orElseThrow();
	        s.setEndTime(LocalTime.now());
	        s.setStatus("COMPLETED");
	        return repo.save(s);
	    }

	    @GetMapping("/all")
	    public List<AttendanceSession> getAll() {
	        return repo.findAll();
	    }
}
