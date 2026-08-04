package com.facetrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateInstituteLocationRequest(

    @NotNull(message = "Latitude is required")
    Double latitude,

    @NotNull(message = "Longitude is required")
    Double longitude,

    @NotNull(message = "Allowed radius is required")
    Integer allowedRadius,

    @NotBlank(message = "Location name is required")
    String locationName

) {}