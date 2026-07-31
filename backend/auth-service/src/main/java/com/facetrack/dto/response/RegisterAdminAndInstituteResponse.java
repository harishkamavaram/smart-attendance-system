package com.facetrack.dto.response;

public record RegisterAdminAndInstituteResponse(
        Long instituteId,
        Long adminId,
        String message
) {}
