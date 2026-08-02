//package com.smartattendance.attendance_service.service;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.smartattendance.attendance_service.model.AttendanceSession;
//import com.smartattendance.attendance_service.repository.AttendanceSessionRepository;
//
//
//@Service
//public class AttendanceSessionService {
//
//	@Autowired AttendanceSessionRepository  sessionservice;
//	
//	public AttendanceSession createSession (AttendanceSession session ) {
//		
//		return sessionservice.save(session);
//	}
//	
//	public List<AttendanceSession> getAllSessions() {
//        return sessionservice.findAll();
//    }
//	
//	
//	 public AttendanceSession getSessionById(Long id) {
//	        return sessionservice.findById(id)
//	                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
//	    }
//	 
//	    public AttendanceSession updateSession(Long id, AttendanceSession updatedSession) {
//	        AttendanceSession existing = sessionservice.findById(id)
//	                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
//
//	        existing.setCourseId(updatedSession.getCourseId());
//	        existing.setSectionId(updatedSession.getSectionId());
//	        existing.setDate(updatedSession.getDate());
//	        existing.setStartTime(updatedSession.getStartTime());
//	        existing.setEndTime(updatedSession.getEndTime());
//	        existing.setRoom(updatedSession.getRoom());
//
//	        return sessionservice.save(existing);
//	    }
//	    
//	    public void deleteSession(Long id) {
//	        if (!sessionservice.existsById(id)) {
//	            throw new RuntimeException("Session not found with id: " + id);
//	        }
//	        sessionservice.deleteById(id);
//	    }
//	
//
//}
