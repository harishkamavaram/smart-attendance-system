package com.facetrack.dto;

import com.facetrack.enums.Role;

public record JwtUser(Long userId, String email,Role role) {

}
