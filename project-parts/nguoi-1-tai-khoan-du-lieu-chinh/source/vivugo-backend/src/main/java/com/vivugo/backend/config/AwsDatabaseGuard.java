package com.vivugo.backend.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class AwsDatabaseGuard implements ApplicationRunner {

    private final Environment environment;

    public AwsDatabaseGuard(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) {
        boolean requireAws = environment.getProperty("app.database.require-aws", Boolean.class, true);
        if (!requireAws) {
            return;
        }

        String datasourceUrl = environment.getProperty("spring.datasource.url", "");
        if (!datasourceUrl.contains(".rds.amazonaws.com")) {
            throw new IllegalStateException(
                    "AWS database is required. Set DB_URL to the AWS RDS PostgreSQL JDBC URL."
            );
        }
    }
}
