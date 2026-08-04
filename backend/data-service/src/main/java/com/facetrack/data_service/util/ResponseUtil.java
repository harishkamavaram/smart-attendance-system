package com.facetrack.data_service.util;

public class ResponseUtil {

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(
                true,
                message,
                data
        );
    }

    public static ApiResponse<Void> success(String message) {
        return new ApiResponse<>(
                true,
                message,
                null
        );
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(
                false,
                message,
                null
        );
    }
}