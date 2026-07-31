package com.facetrack.dto.response;

public record InstituteResponse(
		Long id,
		String name,
		Integer instituteCode,
		String email,
		String mobileNumber,
		String address
		) {

}
