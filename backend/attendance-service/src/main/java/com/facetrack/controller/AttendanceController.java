package com.facetrack.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.facetrack.dto.AttendanceSummary;
import com.facetrack.entity.Attendance;
import com.facetrack.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // GET all attendance records
    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    // GET attendance by ID
    @GetMapping("/{id}")
    public Attendance getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id);
    }

    // POST - Add attendance
    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance attendance) {
        return attendanceService.addAttendance(attendance);
    }

    // PUT - Update attendance
    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance attendance) {

        return attendanceService.updateAttendance(id, attendance);
    }

    // DELETE - Delete attendance
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttendance(@PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.ok("Attendance deleted successfully");
    }
    //GET - Attendance
    @GetMapping("/student/{studentId}")
    public List<Attendance> getAttendanceByStudentId(
            @PathVariable Long studentId) {

        return attendanceService.getAttendanceByStudentId(studentId);
    }
    
 // Get attendance summary by student ID
    @GetMapping("/student/{studentId}/summary")
    public AttendanceSummary getAttendanceSummary(
            @PathVariable Long studentId) {

        return attendanceService.getAttendanceSummary(studentId);
    }
    
 // Get attendance by date
    @GetMapping("/date/{date}")
    public List<Attendance> getAttendanceByDate(
            @PathVariable LocalDate date) {

        return attendanceService.getAttendanceByDate(date);
    }
}