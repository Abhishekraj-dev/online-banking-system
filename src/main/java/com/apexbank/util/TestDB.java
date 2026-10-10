package com.apexbank.util;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;

public class TestDB {
    public static void main(String[] args) {
        try {
            DBConnectionPool.init();
            try (Connection conn = DBConnectionPool.getConnection();
                 Statement stmt = conn.createStatement()) {
                 
                System.out.println("--- Account ---");
                try (ResultSet rs = stmt.executeQuery("SELECT * FROM \"Account\" LIMIT 1")) {
                    ResultSetMetaData md = rs.getMetaData();
                    for (int i = 1; i <= md.getColumnCount(); i++) {
                        System.out.println(md.getColumnName(i) + " : " + md.getColumnTypeName(i));
                    }
                }
                
                System.out.println("--- Transaction ---");
                try (ResultSet rs = stmt.executeQuery("SELECT * FROM \"Transaction\" LIMIT 1")) {
                    ResultSetMetaData md = rs.getMetaData();
                    for (int i = 1; i <= md.getColumnCount(); i++) {
                        System.out.println(md.getColumnName(i) + " : " + md.getColumnTypeName(i));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
