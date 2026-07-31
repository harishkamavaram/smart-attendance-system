package com.facetrack.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateInstituteRequest(

    @NotBlank(message = "Institute name is required")
    @Size(min = 3, max = 100, message = "Institute name must be between 3 and 100 characters")
    String name,

    @NotNull(message = "Institute code is required")
    @Positive(message = "Institute code must be greater than 0")
    Integer instituteCode,

    @NotBlank(message = "Institute email is required")
    @Email(message = "Invalid institute email format")
    @Size(max = 100, message = "Institute email cannot exceed 100 characters")
    String email,

    @NotBlank(message = "Mobile number is required")
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Mobile number must be a valid 10-digit Indian mobile number"
    )
    String mobileNumber,

    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 255, message = "Address must be between 10 and 255 characters")
    String address

) {}