package com.facetrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facetrack.dto.request.EmailVerificationRequest;
import com.facetrack.dto.request.ForgotPasswordRequest;
import com.facetrack.dto.request.LoginRequest;
import com.facetrack.dto.request.RegisterAdminAndInstituteRequest;
import com.facetrack.dto.request.ResendVerificationMailRequest;
import com.facetrack.dto.request.UpdatePasswordRequest;
import com.facetrack.dto.request.VerifyOtpRequest;
import com.facetrack.dto.request.VerifyResetPasswordRequest;
import com.facetrack.dto.response.ApiResponse;
import com.facetrack.dto.response.EmailVerificationResponse;
import com.facetrack.dto.response.ForgotPasswordResponse;
import com.facetrack.dto.response.LoginResponse;
import com.facetrack.dto.response.LogoutAdminResponse;
import com.facetrack.dto.response.RefreshTokenResponse;
import com.facetrack.dto.response.RegisterAdminAndInstituteResponse;
import com.facetrack.dto.response.ResendVerificationMailResponse;
import com.facetrack.dto.response.UpdatePasswordResponse;
import com.facetrack.dto.response.VerifyOtpResponse;
import com.facetrack.dto.response.VerifyResetPasswordResponse;
import com.facetrack.service.AdminService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth/admin")
public class AuthController {
	@Autowired
	public AdminService adminService;

	@GetMapping("/health")
	public String getHealth() {
		return "Auth Service is Working !";
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<RegisterAdminAndInstituteResponse>> registerAdmin(
			@Valid @RequestBody RegisterAdminAndInstituteRequest admin) {
		return adminService.createAdmin(admin);
	}

	@PostMapping("/verify")
	public ResponseEntity<ApiResponse<EmailVerificationResponse>> verifyEmail(
			@Valid @RequestBody EmailVerificationRequest emailVerify) {
		return adminService.emailVerification(emailVerify);
	}

	@PostMapping("/resendMail")
	public ResponseEntity<ApiResponse<ResendVerificationMailResponse>> resendVerificationMail(
			@Valid @RequestBody ResendVerificationMailRequest email) {
		return adminService.resendVerificationMail(email);
	}

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<LoginResponse>> adminLogin(@Valid @RequestBody LoginRequest loginData) {
		return adminService.adminLogin(loginData);
	}

	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshTokens(HttpServletRequest request,
			HttpServletResponse response) {

		return adminService.refreshTokens(request, response);
	}

	@PostMapping("/forgotPassword")
	public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(
			@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
		return adminService.forgotPassword(forgotPasswordRequest);
	}
	@PostMapping("/verifyOtp")
	public ResponseEntity<ApiResponse<VerifyOtpResponse>> verfiyOtp(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest){
		return adminService.verifyOtp(verifyOtpRequest);
	}
	@PostMapping("/updatePassword")
	public ResponseEntity<ApiResponse<UpdatePasswordResponse>> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest){
		return adminService.updatePassword(updatePasswordRequest);
	}

	@PostMapping("/verifyResetPassword")
	public ResponseEntity<ApiResponse<VerifyResetPasswordResponse>> resetPassword(
			@Valid @RequestBody VerifyResetPasswordRequest verifyResetPasswordRequest) {
		return adminService.verifyResetPassword(verifyResetPasswordRequest);
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<LogoutAdminResponse>> logoutAdmin(HttpServletRequest logoutAdminRequest) {
		return adminService.logout(logoutAdminRequest);
	}
}
