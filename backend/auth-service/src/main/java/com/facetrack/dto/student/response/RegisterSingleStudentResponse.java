package com.facetrack.dto.student.response;


public record RegisterSingleStudentResponse(
	    String message,
	    StudentDetailsResponse student
	) {}
