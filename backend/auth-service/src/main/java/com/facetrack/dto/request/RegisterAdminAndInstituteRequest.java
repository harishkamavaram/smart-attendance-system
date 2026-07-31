package com.facetrack.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RegisterAdminAndInstituteRequest(

    @NotNull(message = "Institute details are required")
    @Valid
    CreateInstituteRequest institute,

    @NotNull(message = "Super admin details are required")
    @Valid
    CreateSuperAdminRequest superAdmin

) {}