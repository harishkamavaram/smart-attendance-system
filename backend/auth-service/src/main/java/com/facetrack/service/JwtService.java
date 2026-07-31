package com.facetrack.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.facetrack.dto.JwtUser;
import com.facetrack.enums.TokenType;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String USER_ID = "userId";
    private static final String ROLE = "role";
    private static final String TOKEN_TYPE = "tokenType";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.issuer}")
    private String issuer;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;


    public String generateAccessToken(JwtUser user) {

        Map<String, Object> claims = new HashMap<>();

        claims.put(USER_ID, user.userId());
        claims.put(ROLE, user.role());
        claims.put(TOKEN_TYPE, TokenType.ACCESS.name());

        return createToken(claims, user.email(), accessTokenExpiration);
    }

    public String generateRefreshToken(JwtUser user) {

        Map<String, Object> claims = new HashMap<>();

        claims.put(USER_ID, user.userId());
        claims.put(TOKEN_TYPE, TokenType.REFRESH.name());

        return createToken(claims, user.email(), refreshTokenExpiration);
    }

    private String createToken(
            Map<String, Object> claims,
            String subject,
            long expiration) {

        Date now = new Date();

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuer(issuer)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .id(UUID.randomUUID().toString())
                .signWith(getSignKey())
                .compact();
    }


    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }
    
    public Long extractUserId(String token) {
        return extractClaim(token, USER_ID, Long.class);
    }

    public String extractRole(String token) {
        return extractClaim(token, ROLE, String.class);
    }

    public String extractTokenType(String token) {
        return extractClaim(token, TOKEN_TYPE, String.class);
    }

    private <T> T extractClaim(
            String token,
            String claimName,
            Class<T> clazz) {

        return extractClaims(token).get(claimName, clazz);
    }

    public boolean validateAccessToken(String token, String email) {
        return validateToken(token, email, TokenType.ACCESS);
    }

    public boolean validateRefreshToken(String token, String email) {
        return validateToken(token, email, TokenType.REFRESH);
    }

    private boolean validateToken(
            String token,
            String expectedSubject,
            TokenType tokenType) {

        try {

            Claims claims = extractClaims(token);

            return expectedSubject.equals(claims.getSubject())
                    && tokenType.name().equals(
                            claims.get(TOKEN_TYPE, String.class));

        } catch (JwtException | IllegalArgumentException e) {

            return false;
        }
    }

    private Claims extractClaims(String token) {

        return Jwts.parser()
                .requireIssuer(issuer)
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignKey() {
    	 return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
//        byte[] keyBytes = Decoders.BASE64.decode(secret);
//
//        return Keys.hmacShaKeyFor(keyBytes);
    }
}