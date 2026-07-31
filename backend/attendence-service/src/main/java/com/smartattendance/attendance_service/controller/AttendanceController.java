package com.smartattendance.attendance_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartattendance.attendance_service.model.Attendance;
import com.smartattendance.attendance_service.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

	
	

	    @Autowired
	    private AttendanceService attendanceService;

//	    @PostMapping("/mark")
//	    public Attendance mark(@RequestBody Attendance attendance) {
//	        return attendanceService.markAttendance(attendance);
//	    }
	    @PostMapping("/mark")
	    public ResponseEntity<?> mark(@RequestBody Attendance attendance) {
	        try {
	            Attendance saved = attendanceService.markAttendance(attendance);
	            return ResponseEntity.ok(saved);
	        } catch (RuntimeException ex) {
	            return ResponseEntity.badRequest().body(ex.getMessage());
	        }
	    }

	    @GetMapping("/all")
	    public List<Attendance> getAll() {
	        return attendanceService.getAllAttendance();
	    }

	    @GetMapping("/student/{studentId}")
	    public List<Attendance> getByStudent(@PathVariable String studentId) {
	        return attendanceService.getByStudentId(studentId);
	    }
	    @GetMapping("/percentage/{studentId}")
	    public double getPercentage(@PathVariable String studentId) {
	        return attendanceService.getAttendancePercentage(studentId);
	    }
	   
}
