package com.facetrack.dto.student.response;

public record StudentDetailsResponse(
	    Long id,
	    String rollNumber,
	    String firstName,
	    String lastName,
	    String email,
	    String batch,
	    String section,
	    String courseName,
	    Long courseId,
	    String instituteName,
	    Long instituteId,
	    boolean hasEmbeddings,
	    String parentName,
	    String parentMobileNumber,
	    String parentEmail,
	    String role

	) {}
