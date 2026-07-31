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
		return (exchange, chain) -> {

			System.out.println("AuthenticationFilter executed");

			if (validator.isSecured.test(exchange.getRequest())) {

				System.out.println("Secured route");
				System.out.println("Cookie: "+exchange.getRequest().getCookies().toString());
				HttpCookie cookie = exchange.getRequest().getCookies().getFirst("accessToken");

				System.out.println("Cookie = " + cookie);

				if (cookie == null || cookie.getValue().isBlank()) {
					System.out.println("No access token");

					exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
					return exchange.getResponse().setComplete();
				}

				System.out.println("Token found");

				return chain.filter(exchange);
			}

			System.out.println("Public route");
			return chain.filter(exchange);
		};
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