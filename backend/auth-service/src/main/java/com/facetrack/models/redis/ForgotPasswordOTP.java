package com.facetrack.models.redis;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "forgot_password_otp", timeToLive = 300) // 300 = 5 mins
public class ForgotPasswordOTP {
	@Id
	private String otp;

	private String userId;

	private Instant createdAt;

	public ForgotPasswordOTP() {
		super();
	}

	public ForgotPasswordOTP(String otp, String userId, Instant createdAt) {
		super();
		this.otp = otp;
		this.userId = userId;
		this.createdAt = createdAt;
	}

	public String getOTP() {
		return otp;
	}

	public void setOTP(String otp) {
		this.otp = otp;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return "ForgotPasswordOTP [OTP=" + otp + ", userId=" + userId + ", createdAt=" + createdAt + "]";
	}

}