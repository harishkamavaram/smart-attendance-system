package com.facetrack.filter;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

	@Autowired
	private RouteValidator validator;

	@Value("${jwt.secret}")
	private String secret;

	public AuthenticationFilter() {
		super(Config.class);
	}

	@Override
	public GatewayFilter apply(Config config) {
		return ((exchange, chain) -> {

			// Check if the route requires authentication
			if (validator.isSecured.test(exchange.getRequest())) {

				// Get accessToken from HttpOnly cookie
				HttpCookie accessTokenCookie = exchange.getRequest().getCookies().getFirst("accessToken");

				// If cookie is missing, block the request
				if (accessTokenCookie == null || accessTokenCookie.getValue().isBlank()) {
					exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
					return exchange.getResponse().setComplete();
				}

				// Get the JWT from the cookie
				String accessToken = accessTokenCookie.getValue();

				// Validate the JWT
				try {
					Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(accessToken);
				} catch (Exception e) {
					System.out.println("Invalid access token: " + e.getMessage());
					exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
					return exchange.getResponse().setComplete();
				}
			}
			// If everything is fine, pass the request to the target service
			return chain.filter(exchange);
		});
	}

	private SecretKey getSignKey() {

		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
//		byte[] keyBytes = Decoders.BASE64.decode(secret);
//		return Keys.hmacShaKeyFor(keyBytes);
	}

	public static class Config {
		// Empty class as we don't have custom properties for the filter
	}
}