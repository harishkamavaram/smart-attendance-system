package com.facetrack.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.facetrack.dto.StudentResponse;


@FeignClient(name = "STUDENT-SERVICE")
public interface StudentClient {

    @GetMapping("/api/students/{id}")
	
    StudentResponse getStudentbyId(@PathVariable ("id") Long id);
}
