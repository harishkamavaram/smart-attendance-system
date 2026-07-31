package com.facetrack.helpers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.facetrack.service.EmailService;

@Configuration
public class EmailHelpers {

	@Autowired
	private EmailService emailService;


	@Value("${clientUrl}")
	private String url;

	public String sendVerificationEmail(String toEmail, String user, String token) {

		String subject = "Verify Your Email - Smart Attendance [ FACETRACK ]";

		String body = """
				<!DOCTYPE html>
				<html>
				<body style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
				    <p>Hi %s,</p>

				    <p>Welcome to <strong>FaceTrack</strong>!</p>

				    <p>Please verify your email by clicking the button below.</p>

				    <p style="text-align:center;margin:30px 0;">
				        <a href="%s/verify?token=%s&email=%s"
				           style="background:#2563eb;
				                  color:#ffffff;
				                  padding:12px 24px;
				                  text-decoration:none;
				                  border-radius:6px;
				                  display:inline-block;
				                  font-weight:bold;">
				            Verify Email
				        </a>
				    </p>

				    <p><strong>Note:</strong> This link will expire in <strong>5 minutes</strong>.</p>

				    <p>If you didn't create this account, you can safely ignore this email.</p>

				    <p>Regards,<br>
				    Smart Attendance Team</p>
				</body>
				</html>
				""".formatted(user, url, token, toEmail);

		return emailService.sendHtmlEmail(toEmail, subject, body);
	}

	public String sendResetPasswordEmail(String toEmail, String user, String token) {

		String subject = "Reset Your Password - Smart Attendance [ FACETRACK ]";

		String body = """
				<!DOCTYPE html>
				<html>
				<body style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">

				    <p>Hi %s,</p>

				    <p>We received a request to reset the password for your <strong>FaceTrack</strong> account.</p>

				    <p>If you made this request, click the button below to create a new password.</p>

				    <p style="text-align:center;margin:30px 0;">
				        <a href="%s/reset-password?token=%s&email=%s"
				           style="background:#dc2626;
				                  color:#ffffff;
				                  padding:12px 24px;
				                  text-decoration:none;
				                  border-radius:6px;
				                  display:inline-block;
				                  font-weight:bold;">
				            Reset Password
				        </a>
				    </p>

				    <p><strong>This password reset link will expire in 5 minutes.</strong></p>

				    <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

				    <hr style="border:none;border-top:1px solid #e5e5e5;margin:30px 0;">

				    <p>Regards,<br>
				    <strong>FaceTrack Team</strong></p>

				</body>
				</html>
				"""
				.formatted(user, url, token, toEmail);

		return emailService.sendHtmlEmail(toEmail, subject, body);
	}

	public String sendForgotPasswordOtpEmail(String toEmail, String user, String otp) {

		String subject = "Your Password Reset OTP - Smart Attendance [ FACETRACK ]";

		String body = """
				<!DOCTYPE html>
				<html>
				<body style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">

				    <p>Hi %s,</p>

				    <p>We received a request to reset the password for your <strong>FaceTrack</strong> account.</p>

				    <p>Please use the following One-Time Password (OTP) to reset your password:</p>

				    <div style="
				        text-align:center;
				        margin:30px 0;
				        ">
				        <span style="
				            display:inline-block;
				            font-size:32px;
				            font-weight:bold;
				            letter-spacing:8px;
				            background:#f3f4f6;
				            color:#dc2626;
				            padding:16px 30px;
				            border-radius:8px;
				            border:2px dashed #dc2626;
				        ">
				            %s
				        </span>
				    </div>

				    <p><strong>This OTP is valid for 5 minutes.</strong></p>

				    <p>Do not share this OTP with anyone. FaceTrack will never ask you for your OTP via phone, email, or message.</p>

				    <p>If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>

				    <hr style="border:none;border-top:1px solid #e5e5e5;margin:30px 0;">

				    <p>Regards,<br>
				    <strong>FaceTrack Team</strong></p>

				</body>
				</html>
				"""
				.formatted(user, otp);

		return emailService.sendHtmlEmail(toEmail, subject, body);
	}


}