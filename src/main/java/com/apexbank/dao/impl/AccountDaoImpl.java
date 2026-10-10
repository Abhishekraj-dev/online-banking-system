package com.apexbank.dao.impl;

import com.apexbank.model.Account;
import com.apexbank.util.DBConnectionPool;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class AccountDaoImpl {
    public List<Account> findByUserId(String userId) {
        List<Account> accounts = new ArrayList<>();
        String sql = "SELECT * FROM \"Account\" WHERE \"userId\" = ?";
        try (Connection conn = DBConnectionPool.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Account a = new Account();
                    a.setId(rs.getString("id"));
                    a.setAccountNumber(rs.getString("accountNumber"));
                    a.setAccountType(rs.getString("accountType"));
                    a.setBalance(rs.getBigDecimal("balance"));
                    a.setCurrency(rs.getString("currency"));
                    a.setStatus(rs.getString("status"));
                    a.setUserId(rs.getString("userId"));
                    a.setCreatedAt(rs.getTimestamp("createdAt"));
                    a.setUpdatedAt(rs.getTimestamp("updatedAt"));
                    accounts.add(a);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return accounts;
    }
}
