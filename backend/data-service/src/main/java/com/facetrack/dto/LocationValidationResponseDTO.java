package com.facetrack.dto;

public record LocationValidationResponseDTO(

    boolean valid,
    double distanceInMeters,
    double allowedRadius,
    String message

) {}