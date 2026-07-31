package com.facetrack.dto.student.request;

public record RegisterSingleStudentRequest(
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
