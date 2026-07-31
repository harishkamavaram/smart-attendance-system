package com.facetrack.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.facetrack.client.StudentClient;
import com.facetrack.dto.AttendanceSummary;
import com.facetrack.dto.StudentResponse;
import com.facetrack.entity.Attendance;
import com.facetrack.repository.AttendanceRepository;

@Service
public class AttendanceService {
	private final AttendanceRepository attendanceRepository;
	private final StudentClient studentClient;
	
	public AttendanceService(AttendanceRepository attendanceRepository , StudentClient studentClient) {
		this.attendanceRepository=attendanceRepository;
		this.studentClient=studentClient;
	}
	
	// Create attendance
    public Attendance addAttendance(Attendance attendance) {

        // Check whether student exists
        StudentResponse student = studentClient.getStudentbyId(attendance.getStudentId());

        if (student == null) {
            throw new RuntimeException("Student not found with id: " + attendance.getStudentId());
                    
        }

     // Check duplicate attendance
        boolean alreadyMarked =
                attendanceRepository.existsByStudentIdAndDate(attendance.getStudentId(),attendance.getDate());

        if (alreadyMarked) {
        	throw new ResponseStatusException(HttpStatus.CONFLICT,
        	        "Attendance already marked for student id: "
        	        + attendance.getStudentId()
        	        + " on "
        	        + attendance.getDate());
        }

        return attendanceRepository.save(attendance);
    }

    // Get all attendance records
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // Get attendance by ID
    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Attendance not found with id: " + id));
    }

    // Update attendance
    public Attendance updateAttendance(Long id, Attendance attendance) {

        Attendance existingAttendance = getAttendanceById(id);

        existingAttendance.setStudentId(attendance.getStudentId());
        existingAttendance.setDate(attendance.getDate());
        existingAttendance.setStatus(attendance.getStatus());

        return attendanceRepository.save(existingAttendance);
    }

    // Delete attendance
    public void deleteAttendance(Long id) {

        Attendance existingAttendance = getAttendanceById(id);

        attendanceRepository.delete(existingAttendance);
    }
    // Get attendance by student ID
    public List<Attendance> getAttendanceByStudentId(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }
	
 // Get attendance summary for a student
    public AttendanceSummary getAttendanceSummary(Long studentId) {

        long totalClasses = attendanceRepository.countByStudentId(studentId);

        long present = attendanceRepository
                .countByStudentIdAndStatus(studentId, "PRESENT");

        long absent = attendanceRepository
                .countByStudentIdAndStatus(studentId, "ABSENT");

        double attendancePercentage = 0;

        if (totalClasses > 0) {
            attendancePercentage = (present * 100.0) / totalClasses;
        }

        return new AttendanceSummary(
                studentId,
                totalClasses,
                present,
                absent,
                attendancePercentage
        );
    }
    
    // Get attendance by date
    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }
}
