package com.facetrack.dto.student.response;

public record StudentLoginResponse(
		StudentDetailsResponse student,
		String message) {

}
