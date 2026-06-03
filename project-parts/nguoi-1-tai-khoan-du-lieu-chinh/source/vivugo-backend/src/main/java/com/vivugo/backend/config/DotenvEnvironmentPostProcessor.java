package com.vivugo.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "vivugoDotenv";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> values = new LinkedHashMap<>();
        for (Path dotenvPath : dotenvCandidates()) {
            loadDotenv(dotenvPath, values);
        }

        if (!values.isEmpty() && !environment.getPropertySources().contains(PROPERTY_SOURCE_NAME)) {
            environment.getPropertySources().addAfter(
                    StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME,
                    new MapPropertySource(PROPERTY_SOURCE_NAME, values)
            );
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }

    private List<Path> dotenvCandidates() {
        Path cwd = Paths.get("").toAbsolutePath().normalize();
        Path parent = cwd.getParent();
        return List.of(
                parent == null ? cwd.resolve(".env") : parent.resolve(".env"),
                parent == null ? cwd.resolve("vivugo-backend/.env") : parent.resolve("vivugo-backend/.env"),
                cwd.resolve(".env"),
                cwd.resolve("vivugo-backend/.env")
        );
    }

    private void loadDotenv(Path path, Map<String, Object> values) {
        if (path == null || !Files.isRegularFile(path)) {
            return;
        }

        try {
            for (String line : Files.readAllLines(path, StandardCharsets.UTF_8)) {
                parseLine(line, values);
            }
        } catch (IOException e) {
            throw new IllegalStateException("Cannot read dotenv file: " + path, e);
        }
    }

    private void parseLine(String line, Map<String, Object> values) {
        if (line == null) {
            return;
        }

        String trimmed = line.trim();
        if (trimmed.isEmpty() || trimmed.startsWith("#")) {
            return;
        }

        int equalsIndex = trimmed.indexOf('=');
        if (equalsIndex <= 0) {
            return;
        }

        String key = trimmed.substring(0, equalsIndex).trim();
        if (!key.matches("[A-Za-z_][A-Za-z0-9_]*")) {
            return;
        }

        values.put(key, unquote(trimmed.substring(equalsIndex + 1).trim()));
    }

    private String unquote(String value) {
        if (value.length() >= 2
                && ((value.startsWith("\"") && value.endsWith("\""))
                || (value.startsWith("'") && value.endsWith("'")))) {
            return value.substring(1, value.length() - 1);
        }
        return value;
    }
}
