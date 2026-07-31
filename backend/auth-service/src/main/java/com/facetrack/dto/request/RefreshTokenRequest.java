package com.facetrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RefreshTokenRequest(

    @NotBlank(message = "Refresh token is required")
    @Size(max = 2048, message = "Refresh token is too long")
    String refreshToken

) {
}