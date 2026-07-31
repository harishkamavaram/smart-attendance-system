package com.facetrack.dto;

public record StudentImportDTO(
        String rollNumber,
        String firstName,
        String lastName,
        String email,
        String batch,
        Long courseCode,
        String section,
        String parentName,
        String parentMobileNumber,
        String parentEmail,
        Long institueCode
) {
}