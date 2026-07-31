package com.facetrack.dto.response;

import com.facetrack.enums.Role;

public record AdminLoginResponse(
		Long id,
		String name,
		String email,
		Role role,
		InstituteResponse institute
		) {

}
