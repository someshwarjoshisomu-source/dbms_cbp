package com.projecttracker.project_tracker_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        // ✅ Explicitly allow only your frontend origin (no wildcard)
                        .allowedOrigins("http://localhost:5173")

                        // ✅ Allowed HTTP methods for REST APIs
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

                        // ✅ Allow headers commonly used in JWT / JSON communication
                        .allowedHeaders("Authorization", "Content-Type", "X-Requested-With")

                        // ✅ Expose important headers to frontend
                        .exposedHeaders("Authorization", "Content-Type")

                        // ✅ Enable credentials (cookies, Authorization headers)
                        .allowCredentials(true)

                        // ✅ Optional: preflight cache time (browser optimization)
                        .maxAge(3600);
            }
        };
    }
}
