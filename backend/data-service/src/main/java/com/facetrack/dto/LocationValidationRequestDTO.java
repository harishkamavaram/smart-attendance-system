package com.facetrack.dto;

import jakarta.validation.constraints.NotNull;

public record LocationValidationRequestDTO(

    @NotNull
    Double latitude,

    @NotNull
    Double longitude

) {}