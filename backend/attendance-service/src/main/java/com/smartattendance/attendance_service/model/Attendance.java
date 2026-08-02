package com.smartattendance.attendance_service.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Attendance session
    @NotNull(message = "Session ID is required")
    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    // Student details
    @NotNull(message = "Student ID is required")
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @NotBlank
    @Column(name = "student_name", nullable = false)
    private String studentName;

    // Face recognition confidence (0-100 or 0-1 based on your AI service)
    @Column(nullable = false)
    private Double confidence;

    // PRESENT / ABSENT / LATE / UNKNOWN
    @NotBlank
    @Column(nullable = false)
    private String status;

    // Time when attendance was recorded
    @Column(name = "marked_at", nullable = false)
    private LocalDateTime markedAt;

    // Optional: faculty/admin who started the session
    @Column(name = "marked_by")
    private Long markedBy;

    // Optional: image filename used for recognition
    @Column(name = "image_name")
    private String imageName;
    
    @Column(name = "attendance_date") 
    private LocalDate attendanceDate;

    @PrePersist
    protected void onCreate() {
        markedAt = LocalDateTime.now();
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getMarkedAt() {
        return markedAt;
    }

    public void setMarkedAt(LocalDateTime markedAt) {
        this.markedAt = markedAt;
    }

    public Long getMarkedBy() {
        return markedBy;
    }

    public void setMarkedBy(Long markedBy) {
        this.markedBy = markedBy;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

	public LocalDate getAttendanceDate() {
		return attendanceDate;
	}

	public void setAttendanceDate(LocalDate attendanceDate) {
		this.attendanceDate = attendanceDate;
	}
    
}