package com.apexbank.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class DBConnectionPool {
    private static volatile HikariDataSource dataSource;

    public static synchronized void init() {
        if (dataSource != null && !dataSource.isClosed()) return;
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");
        
        String dbUrl = System.getenv("DATABASE_URL");
        
        // Fallback: Read from .env.local or .env if environment variable isn't set
        if (dbUrl == null || dbUrl.isEmpty()) {
            dbUrl = readEnvFile("DATABASE_URL");
        }

        if (dbUrl != null) {
            try {
                // Parse the URL to extract credentials since JDBC driver rejects them inline sometimes
                String cleanUrl = dbUrl.replace("jdbc:", "");
                java.net.URI uri = new java.net.URI(cleanUrl);
                
                String userInfo = uri.getUserInfo();
                if (userInfo != null) {
                    String[] parts = userInfo.split(":");
                    config.setUsername(parts[0]);
                    if (parts.length > 1) {
                        config.setPassword(parts[1]);
                    }
                }
                
                String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + 
                                 (uri.getPort() != -1 ? ":" + uri.getPort() : "") + 
                                 uri.getPath();
                if (uri.getQuery() != null) {
                    jdbcUrl += "?" + uri.getQuery();
                }
                
                config.setJdbcUrl(jdbcUrl);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to parse DATABASE_URL");
            }
        } else {
            throw new RuntimeException("DATABASE_URL not found in environment or .env files");
        }
        
        dataSource = new HikariDataSource(config);
    }

    private static String readEnvFile(String key) {
        String[] files = { "d:/project/online-banking-system/.env.local", "d:/project/online-banking-system/.env", ".env.local", ".env" };
        for (String file : files) {
            java.io.File f = new java.io.File(file);
            if (f.exists()) {
                try (java.util.Scanner scanner = new java.util.Scanner(f)) {
                    while (scanner.hasNextLine()) {
                        String line = scanner.nextLine().trim();
                        if (line.startsWith(key + "=")) {
                            String value = line.substring(key.length() + 1).trim();
                            if (value.startsWith("\"") && value.endsWith("\"")) {
                                value = value.substring(1, value.length() - 1);
                            }
                            return value;
                        }
                    }
                } catch (Exception e) {
                    // Ignore and try next file
                }
            }
        }
        return null;
    }

    public static Connection getConnection() throws SQLException {
        if (dataSource == null || dataSource.isClosed()) init();
        return dataSource.getConnection();
    }
}
