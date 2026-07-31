package com.facetrack.dto.response;

public record EmailVerificationResponse(
		AdminLoginResponse admin,
		String email,
        String message
        ) {

}
