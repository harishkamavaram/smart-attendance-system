package com.facetrack.dto;

import lombok.Data;

@Data
public class StudentResponse {
	
	private Long id;
    private String name;
    private String email;
    private Long rollno;
    private String department;
}
