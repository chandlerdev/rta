package com.appointware.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI appointwareOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Appointware API")
                .version("1.0.0")
                .description("Appointware - Appointment & Surgery Scheduling REST API")
                .contact(new Contact().name("Appointware").email("support@appointware.local")));
    }
}
