package com.smartattendance.attendance_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "attendance_image_sessions")
public class AttendanceImageSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Institute ID is required")
    @Column(name = "institute_id", nullable = false)
    private Long instituteId;

    @NotNull(message = "Course ID is required")
    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @NotBlank(message = "Section ID is required")
    @Column(name = "section_id", nullable = false)
    private String sectionId;

    @NotNull(message = "Session ID is required")
    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    @NotBlank(message = "Image URL is required")
    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    @Column(name = "is_first_image", nullable = false)
    private Boolean isFirstImage;

    @NotBlank(message = "Uploaded image URL is required")
    @Column(name = "uploaded_image_url", nullable = false, length = 1000)
    private String uploadedImageUrl;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInstituteId() {
        return instituteId;
    }

    public void setInstituteId(Long instituteId) {
        this.instituteId = instituteId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getSectionId() {
        return sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsFirstImage() {
        return isFirstImage;
    }

    public void setIsFirstImage(Boolean isFirstImage) {
        this.isFirstImage = isFirstImage;
    }
    public String getUploadedImageUrl() {
        return uploadedImageUrl;
    }

    public void setUploadedImageUrl(String uploadedImageUrl) {
        this.uploadedImageUrl = uploadedImageUrl;
    }
}