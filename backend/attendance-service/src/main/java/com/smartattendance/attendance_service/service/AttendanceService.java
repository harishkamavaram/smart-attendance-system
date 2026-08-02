package com.smartattendance.attendance_service.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartattendance.attendance_service.model.Attendance;
import com.smartattendance.attendance_service.repository.AttendanceRepository;

@Service
public class AttendanceService {
	 @Autowired
	    private AttendanceRepository attendanceRepository;
	 
		public Attendance markAttendance(Attendance attendance) {

			Optional<Attendance> existing = attendanceRepository.findBySessionIdAndStudentId(attendance.getSessionId(),
					attendance.getStudentId());

			if (existing.isPresent()) {

				Attendance old = existing.get();

				old.setStatus("PRESENT");

				return attendanceRepository.save(old);
			}

			return attendanceRepository.save(attendance);
		}
	 	
	 public List<Attendance> getStudentsBySessionId(Long sessionId){
		 return attendanceRepository.findBySessionId(sessionId);
	 }
	    public List<Attendance> getAllAttendance() {
	        return attendanceRepository.findAll();
	    }

	    public List<Attendance> getByStudentId(String studentId) {
	        return attendanceRepository.findByStudentId(studentId);
	    }
	    
	    public long getTotalPresentByStudentAndSubject(Long studentId) {
	        return attendanceRepository.countByStudentIdAndStatus(studentId, "PRESENT");
	    }
	    
	    public List<Attendance> getByDate(LocalDate date) {
	        return attendanceRepository.findByAttendanceDate(date);
	    }

	    public List<Attendance> getReport(String studentId, LocalDate startDate, LocalDate endDate) {
	        
	    	return attendanceRepository.findByStudentId(studentId)
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



