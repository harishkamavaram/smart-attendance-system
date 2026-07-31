package com.facetrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.facetrack.dto.request.ForgotPasswordRequest;
import com.facetrack.dto.request.VerifyOtpRequest;
import com.facetrack.dto.response.ApiResponse;
import com.facetrack.dto.response.ForgotPasswordResponse;
import com.facetrack.dto.response.LogoutAdminResponse;
import com.facetrack.dto.response.RefreshTokenResponse;
import com.facetrack.dto.response.VerifyOtpResponse;
import com.facetrack.dto.student.request.ChangePasswordRequest;
import com.facetrack.dto.student.request.RegisterSingleStudentRequest;
import com.facetrack.dto.student.request.StudentLoginRequest;
import com.facetrack.dto.student.request.UpdateForgotPasswordRequest;
import com.facetrack.dto.student.request.UpdatePasswordRequest;
import com.facetrack.dto.student.response.ChangePasswordResponse;
import com.facetrack.dto.student.response.RegisterSingleStudentResponse;
import com.facetrack.dto.student.response.RegisterStudentsResponse;
import com.facetrack.dto.student.response.StudentLoginResponse;
import com.facetrack.dto.student.response.UpdateForgotPasswordResponse;
import com.facetrack.dto.student.response.UpdatePasswordResponse;
import com.facetrack.service.StudentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth/student")
public class StudentAuthController {

	@Autowired
	public StudentService studentService;

	@PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<RegisterStudentsResponse>> registerStudents(
			@RequestParam("file") MultipartFile file, HttpServletRequest request) {
		return studentService.importStudents(file, request);
	}

	@PostMapping("/registerStudent")
	public ResponseEntity<ApiResponse<RegisterSingleStudentResponse>> registerSingleStudent(
			@Valid @RequestBody RegisterSingleStudentRequest registerSingleStudentRequest) {
		return studentService.registerSingleStudent(registerSingleStudentRequest);
	}

	@PostMapping("/updatePassword")
	public ResponseEntity<ApiResponse<UpdatePasswordResponse>> updatePassword(
			@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
		return studentService.updatePassword(updatePasswordRequest);
	}

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<StudentLoginResponse>> login(
			@Valid @RequestBody StudentLoginRequest studentLoginRequest) {
		return studentService.login(studentLoginRequest);
	}

	@PostMapping("/forgotPassword")
	public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(
			@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
		return studentService.forgotPassword(forgotPasswordRequest);
	}

	@PostMapping("/verifyOtp")
	public ResponseEntity<ApiResponse<VerifyOtpResponse>> verfiyOtp(
			@Valid @RequestBody VerifyOtpRequest verifyOtpRequest) {
		return studentService.verifyOtp(verifyOtpRequest);
	}

	@PostMapping("/updateForgotPassword")
	public ResponseEntity<ApiResponse<UpdateForgotPasswordResponse>> updateForgotPassword(
			@Valid @RequestBody UpdateForgotPasswordRequest updateForgotPasswordRequest) {
		return studentService.updateForgotPassword(updateForgotPasswordRequest);
	}

	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshTokens(HttpServletRequest request,
			HttpServletResponse response) {
		return studentService.refreshTokens(request, response);
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<LogoutAdminResponse>> logoutAdmin(HttpServletRequest logoutAdminRequest) {
		return studentService.logout(logoutAdminRequest);
	}

	@PostMapping("/changePassword")
	public ResponseEntity<ApiResponse<ChangePasswordResponse>> changePassword(
			@Valid @RequestBody ChangePasswordRequest changePasswordRequest, HttpServletRequest request) {
		return studentService.changePassword(changePasswordRequest, request);
	}
}
