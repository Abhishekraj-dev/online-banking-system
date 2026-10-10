package com.apexbank.dao.impl;

import com.apexbank.model.Transaction;
import com.apexbank.util.DBConnectionPool;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class TransactionDaoImpl {
    public List<Transaction> findByUserId(String userId) {
        List<Transaction> transactions = new ArrayList<>();
        String sql = "SELECT * FROM \"Transaction\" WHERE \"createdById\" = ? ORDER BY \"createdAt\" DESC";
        try (Connection conn = DBConnectionPool.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Transaction t = new Transaction();
                    t.setId(rs.getString("id"));
                    t.setReference(rs.getString("reference"));
                    t.setType(rs.getString("type"));
                    t.setAmount(rs.getBigDecimal("amount"));
                    t.setCurrency(rs.getString("currency"));
                    t.setStatus(rs.getString("status"));
                    t.setDescription(rs.getString("description"));
                    t.setSenderAccountId(rs.getString("senderAccountId"));
                    t.setReceiverAccountId(rs.getString("receiverAccountId"));
                    t.setCreatedById(rs.getString("createdById"));
                    t.setCreatedAt(rs.getTimestamp("createdAt"));
                    t.setUpdatedAt(rs.getTimestamp("updatedAt"));
                    transactions.add(t);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return transactions;
    }
}
