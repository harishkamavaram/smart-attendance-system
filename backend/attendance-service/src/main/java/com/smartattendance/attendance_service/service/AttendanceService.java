package com.smartattendance.attendance_service.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartattendance.attendance_service.model.Attendance;
import com.smartattendance.attendance_service.repository.AttendanceRepository;

@Service
public class AttendanceService {
	 @Autowired
	    private AttendanceRepository attendanceRepository;
	 public Attendance markAttendance(Attendance attendance) {
	        // FR-012: Duplicate Check
	        boolean alreadyExists = attendanceRepository
	                .findByStudentIdAndSubjectAndAttendanceDate(
	                        attendance.getStudentId(),
	                        attendance.getSubject(),
	                        attendance.getAttendanceDate() != null ? attendance.getAttendanceDate() : java.time.LocalDate.now()
	                ).isPresent();

	        if (alreadyExists) {
	            throw new RuntimeException("Attendance already marked for student " + attendance.getStudentId() + " for subject " + attendance.getSubject() + " today");
	        }

	        attendance.setStatus("PRESENT");
	        return attendanceRepository.save(attendance);
	    }

	    public List<Attendance> getAllAttendance() {
	        return attendanceRepository.findAll();
	    }

	    public List<Attendance> getByStudentId(String studentId) {
	        return attendanceRepository.findByStudentId(studentId);
	    }
	    
	    public long getTotalPresentByStudentAndSubject(Long studentId, String subject) {
	        return attendanceRepository.countByStudentIdAndSubjectAndStatus(studentId, subject, "PRESENT");
	    }
	    
	    public List<Attendance> getByDate(LocalDate date) {
	        return attendanceRepository.findByAttendanceDate(date);
	    }

	    public List<Attendance> getReport(String studentId, String subject, LocalDate startDate, LocalDate endDate) {
	        
	    	return attendanceRepository.findByStudentIdAndSubject(studentId, subject)
	                .stream()
	                .filter(a -> !a.getAttendanceDate().isBefore(startDate) && !a.getAttendanceDate().isAfter(endDate))
	                .toList();
	    	
	    	
	    }
	    public double getAttendancePercentage(String studentId) {
	        long total = attendanceRepository.countByStudentId(studentId);
	        long present = attendanceRepository.countByStudentIdAndStatus(studentId, "PRESENT");
	        if (total == 0) return 0.0;
	        return (present * 100.0) / total;
	    }
	}



