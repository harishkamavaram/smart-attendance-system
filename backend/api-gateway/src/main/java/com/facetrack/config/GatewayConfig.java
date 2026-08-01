package com.facetrack.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.facetrack.filter.AuthenticationFilter;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthenticationFilter authFilter;

    @Bean
    RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Route: Auth Service (No Filter)
                .route("auth-service", r -> r
                        .path("/auth/**")
                        .uri("lb://AUTH-SERVICE"))

                .route("service-a", r -> r
                        .path("/api/v1/data/**")
                        .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://SERVICEA"))

                .route("face-recognition", r -> r
                        .path("/api/v1/fr/**")
                        .filters(f -> f
                                .setRequestHeader(
                                        "Host",
                                        "harishkamavaram--smart-attendance-ai-fastapi-app-dev.modal.run")
                        // .filter(authFilter.apply(new AuthenticationFilter.Config()))
                        )
                        .uri("https://harishkamavaram--smart-attendance-ai-fastapi-app-dev.modal.run"))

                .route("image-service", r -> r
                        .path("/api/v1/images/**")
                        .filters(f -> f
                                .setRequestHeader(
                                        "Host",
                                        "harishkamavaram--smart-attendance-image-service-fastapi-app.modal.run")
                        // .filter(authFilter.apply(new AuthenticationFilter.Config()))
                        )
                        .uri("https://harishkamavaram--smart-attendance-image-service-fastapi-app.modal.run"
                                + ""))

                .build();

    }
}