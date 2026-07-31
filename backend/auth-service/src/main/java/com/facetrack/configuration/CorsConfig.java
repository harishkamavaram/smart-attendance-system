//package com.facetrack.configuration;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class CorsConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//
//        registry.addMapping("/**")
//                .allowedOriginPatterns(
//                        "http://localhost:5173",
//                        "http://192.168.1.111:5173",
//                        "http://172.29.128.1:5173",
//                        "https://smart-attend-ai.netlify.app"
//                )
//                .allowedMethods(
//                        "GET",
//                        "POST",
//                        "PUT",
//                        "DELETE",
//                        "PATCH",
//                        "OPTIONS"
//                )
//                .allowedHeaders("*")
//                .allowCredentials(true)
//                .maxAge(3600);
//    }
//}