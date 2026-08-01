package com.facetrack.dto;

public class StudentImageResponseDTO {

    private Long id;
    private Long studentId;
    private String imageUrl;

    public StudentImageResponseDTO() {
    }

    public StudentImageResponseDTO(Long id, Long studentId, String imageUrl) {
        this.id = id;
        this.studentId = studentId;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}