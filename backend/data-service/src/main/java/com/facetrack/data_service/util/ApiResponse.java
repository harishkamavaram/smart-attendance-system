package com.facetrack.data_service.util;


public record ApiResponse<T>(
        boolean success,
        String message,
        T data
//        LocalDateTime timestamp
) {}