package com.facetrack.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "http://192.168.1.111:5173",
                "http://172.29.128.1:5173",
                "https://smart-attend-ai.netlify.app",
                "http://ec2-16-16-76-165.eu-north-1.compute.amazonaws.com"
        ));

        config.setAllowedMethods(List.of(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.DELETE.name(),
                HttpMethod.PATCH.name(),
                HttpMethod.OPTIONS.name()
        ));

        config.setAllowedHeaders(List.of("*"));

        config.setExposedHeaders(List.of(
                HttpHeaders.AUTHORIZATION,
                HttpHeaders.SET_COOKIE
        ));

        config.setAllowCredentials(true);

        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}


//package com.facetrack.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.reactive.CorsWebFilter;
//import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
//
//import java.util.Arrays;
//
//@Configuration
//public class CorsConfig {
//
//	@Bean
//	CorsWebFilter corsWebFilter() {
//		CorsConfiguration corsConfig = new CorsConfiguration();
//
//		// 1. Allow frontend
//		corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://smart-attend-ai.netlify.app",
//				"http://192.168.1.111:5173", "http://172.29.128.1:5173"));
//
//		// 2. Allow all standard HTTP methods, including OPTIONS (Crucial for CORS
//		// pre-flight)
//		corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//
//		// 3. Allow all headers (like Authorization for your JWT token)
//		corsConfig.setAllowedHeaders(Arrays.asList("*"));
//
//		// 4. Cache the CORS response so the browser doesn't ask every single time
//		corsConfig.setMaxAge(3600L);
//
//		// 5. Accepts Cookies [ withCredentials: true ]
//		corsConfig.setAllowCredentials(true);
//
//		// Apply this configuration to ALL routes (/**)
//		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//		source.registerCorsConfiguration("/**", corsConfig);
//
//		return new CorsWebFilter(source);
//	}
//}