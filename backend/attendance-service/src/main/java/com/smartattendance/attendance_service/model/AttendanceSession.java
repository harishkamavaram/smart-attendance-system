package com.smartattendance.attendance_service.model;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance_sessions")
public class AttendanceSession extends BaseEntity {

	@Column(length = 50)
	private String subject;

	@Column(name = "class_name", length = 50)
	private String className;

	@Column(name = "teacher_id", length = 50)
	private String teacherId;

	@Column(name = "session_date")
	private LocalDate sessionDate;

	@Column(name = "start_time")
	private LocalTime startTime;

	@Column(name = "end_time")
	private LocalTime endTime;

	private String status;

	public AttendanceSession(String subject, String teacherId, LocalDate sessionDate, LocalTime starTime,
			LocalTime endTime) {
		this.subject = subject;
		this.teacherId = teacherId;
		this.sessionDate = sessionDate;
		this.startTime = starTime;
		this.endTime = endTime;
	}


	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getTeacherId() {
		return teacherId;
	}

	public void setTeacherId(String teacherId) {
		this.teacherId = teacherId;
	}

	public LocalDate getSessionDate() {
		return sessionDate;
	}

	public void setSessionDate(LocalDate sessionDate) {
		this.sessionDate = sessionDate;
	}

	public LocalTime getStartTime() {
		return startTime;
	}

	public void setStartTime(LocalTime startTime) {
		this.startTime = startTime;
	}

	public LocalTime getEndTime() {
		return endTime;
	}

	public void setEndTime(LocalTime endTime) {
		this.endTime = endTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
