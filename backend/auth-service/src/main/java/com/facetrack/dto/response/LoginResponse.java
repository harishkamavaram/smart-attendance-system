package com.facetrack.dto.response;

public record LoginResponse(
		AdminLoginResponse admin,
        String message
		) {

}
