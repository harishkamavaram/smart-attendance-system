package com.facetrack.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmailVerificationRequest(
		@NotBlank(message = "Admin email is required")
	    @Email(message = "Invalid email format")
	    @Size(max = 100, message = "Email cannot exceed 100 characters")
	    String email,
	    
	    @NotBlank(message = "Token is required")
	    String token
		) {

}
