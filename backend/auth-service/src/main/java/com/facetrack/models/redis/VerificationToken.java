package com.facetrack.models.redis;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "verification_tokens", timeToLive = 300) // 300 = 5 mins
public class VerificationToken {

    @Id
    private String token; 

    private String userId;

    private Instant createdAt;

    
	public VerificationToken() {
		super();
	}

	public VerificationToken(String token, String userId, Instant createdAt) {
		super();
		this.token = token;
		this.userId = userId;
		this.createdAt = createdAt;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
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
		return "VerificationToken [token=" + token + ", userId=" + userId + ", createdAt=" + createdAt + "]";
	}
    
    
    
}