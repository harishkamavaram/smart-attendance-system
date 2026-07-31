package com.facetrack.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // List of open endpoints that do not require JWT
    public static final List<String> openApiEndpoints = List.of(
            "/auth/**",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
    	    request -> openApiEndpoints.stream()
    	        .noneMatch(uri -> request.getURI().getPath().startsWith(uri.replace("/**", "")));
}