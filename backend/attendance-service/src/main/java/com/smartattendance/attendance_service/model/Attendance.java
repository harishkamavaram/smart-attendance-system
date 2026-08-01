package com.smartattendance.attendance_service.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "attendance")
public class Attendance {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull()
    
    @Column(name = "student_id", nullable = false , length = 50)
    private String studentId;
    @NotBlank
    private String subject;

    @Column(name = "attendance_date")
    private LocalDate attendanceDate;

    @Column(name = "attendance_time")
    private LocalTime attendanceTime;

    private String status; 
    @Column(name = "marked_by")
    private Long markedBy;

    private LocalDateTime createdAt;

//    @PrePersist
//    protected void onCreate() {
//        attendanceDate = LocalDate.now();
//        attendanceTime = LocalTime.now();
//        createdAt = LocalDateTime.now();
//    }
    
    @PrePersist
    protected void onCreate() {
        if (attendanceDate == null) {
            attendanceDate = LocalDate.now();   
        }
        

        attendanceTime = LocalTime.now();       
        createdAt = LocalDateTime.now();
    }
    
   
    

	public Long getId() { 
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public LocalDate getAttendanceDate() {
		return attendanceDate;
	}

	public void setAttendanceDate(LocalDate attendanceDate) {
		this.attendanceDate = attendanceDate;
	}

	public LocalTime getAttendanceTime() {
		return attendanceTime;
	}

	public void setAttendanceTime(LocalTime attendanceTime) {
		this.attendanceTime = attendanceTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getMarkedBy() {
		return markedBy;
	}

	public void setMarkedBy(Long markedBy) {
		this.markedBy = markedBy;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    

}
