package com.facetrack.models.redis;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "refresh_tokens", timeToLive = 60 * 60 * 24 * 15) //15 days
public class RefreshToken {
	@Id
    private String email;
	
    private String tokenHash; 
    
    private Instant createdAt;

	public RefreshToken() {
		super();
	}

	public RefreshToken(String email, String tokenHash, Instant createdAt) {
		super();
		this.email = email;
		this.tokenHash = tokenHash;
		this.createdAt = createdAt;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTokenHash() {
		return tokenHash;
	}

	public void setToken(String token) {
		this.tokenHash = token;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return "RefreshToken [email=" + email + ", token=" + tokenHash + ", createdAt=" + createdAt + "]";
	}
    
    
}
