package com.apexbank.dao.impl;

import com.apexbank.model.User;
import com.apexbank.util.DBConnectionPool;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Optional;

public class UserDaoImpl {
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM \"User\" WHERE email = ?";
        try (Connection conn = DBConnectionPool.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    User u = new User();
                    u.setId(rs.getString("id"));
                    u.setEmail(rs.getString("email"));
                    u.setName(rs.getString("name"));
                    u.setPasswordHash(rs.getString("passwordHash"));
                    u.setRole(rs.getString("role"));
                    u.setActive(rs.getBoolean("isActive"));
                    return Optional.of(u);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    public boolean save(User user) {
        String sql = "INSERT INTO \"User\" (id, email, name, \"passwordHash\", role, \"isActive\", \"createdAt\", \"updatedAt\") VALUES (gen_random_uuid()::text, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id";
        try (Connection conn = DBConnectionPool.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, user.getEmail());
            ps.setString(2, user.getName());
            ps.setString(3, user.getPasswordHash());
            ps.setString(4, user.getRole());
            ps.setBoolean(5, user.isActive());
            
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    user.setId(rs.getString(1));
                    return true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
