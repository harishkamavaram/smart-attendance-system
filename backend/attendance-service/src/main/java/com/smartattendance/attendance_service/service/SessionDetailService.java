package com.smartattendance.attendance_service.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartattendance.attendance_service.model.SessionDetail;
import com.smartattendance.attendance_service.repository.SessionDetailRepository;

@Service
public class SessionDetailService {

	 @Autowired
	    private SessionDetailRepository sessionDetailRepository;
	 
	 public SessionDetail createSessionDetails(SessionDetail details) {
	        return sessionDetailRepository.save(details);
	    }

	    public List<SessionDetail> getAllSessionDetails() {
	        return sessionDetailRepository.findAll();
	    }

	    public SessionDetail getSessionDetailsById(Long id) {
	        return sessionDetailRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Session Details not found with id: " + id));
	    }

	    public SessionDetail updateSessionDetails(Long id, SessionDetail updated) {
	        SessionDetail existing = sessionDetailRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Session Details not found with id: " + id));

	        existing.setCourse(updated.getCourse());
	        existing.setSection(updated.getSection());
	        existing.setDate(updated.getDate());
	        existing.setTime(updated.getTime());
	        existing.setRoom(updated.getRoom());
	        existing.setTotalStudents(updated.getTotalStudents());
	        existing.setPresent(updated.getPresent());
	        existing.setAbsent(updated.getAbsent());
	        
	        existing.setStatus(updated.getStatus());
	        existing.setAccuracy(updated.getAccuracy());

	        return sessionDetailRepository.save(existing);
	    }

	    public void deleteSessionDetails(Long id) {
	        if (!sessionDetailRepository.existsById(id)) {
	            throw new RuntimeException("Session Details not found with id: " + id);
	        }
	        sessionDetailRepository.deleteById(id);
}
}
