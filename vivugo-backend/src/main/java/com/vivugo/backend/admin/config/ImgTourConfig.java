package com.vivugo.backend.admin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ImgTourConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                // Hình có sẵn trong src/main/resources/static/images/...
                .addResourceLocations("classpath:/static/images/")
                // Hình upload runtime: lưu ở ./uploads/images/...
                .addResourceLocations("file:uploads/images/");
    }
}
