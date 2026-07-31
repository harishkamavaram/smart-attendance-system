package com.facetrack.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResendVerificationMailRequest(
		@NotBlank(message = "Super admin email is required")
	    @Email(message = "Invalid email format")
	    @Size(max = 100, message = "Email cannot exceed 100 characters")
	    String email
		) {

}
