package com.terralog.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.util.Map;

@Configuration
@Profile("prod")
public class RailwayDatabaseConfig {

    @Bean
    public DataSource dataSource() {
        Map<String, String> env = System.getenv();

        // Coba variabel Railway standar
        String host = env.get("MYSQLHOST");
        String port = env.get("MYSQLPORT");
        String database = env.get("MYSQLDATABASE");
        String username = env.get("MYSQLUSER");
        String password = env.get("MYSQLPASSWORD");

        // Coba variasi nama lain
        if (host == null)
            host = env.get("MYSQL_HOST");
        if (port == null)
            port = env.get("MYSQL_PORT");
        if (database == null)
            database = env.get("MYSQL_DATABASE");
        if (username == null)
            username = env.get("MYSQL_USER");
        if (password == null)
            password = env.get("MYSQL_PASSWORD");

        if (host != null && port != null && database != null && username != null && password != null) {
            String jdbcUrl = "jdbc:mysql://" + host + ":" + port + "/" + database;
            return DataSourceBuilder.create()
                    .url(jdbcUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .build();
        }

        throw new IllegalStateException(
                "Railway MySQL environment variables not found. Available vars: " + env.keySet());
    }
}
