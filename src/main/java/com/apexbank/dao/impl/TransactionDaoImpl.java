package com.apexbank.dao.impl;

import com.apexbank.util.DBConnectionPool;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class TransactionDaoImpl {

    public boolean executeTransfer(String senderAccountId, String receiverAccountId, BigDecimal amount, String description, String userId) throws Exception {
        Connection conn = null;
        try {
            conn = DBConnectionPool.getConnection();
            conn.setAutoCommit(false); 

            // 1. Lock sender account
            String checkSender = "SELECT balance FROM \"Account\" WHERE id = ? FOR UPDATE";
            BigDecimal senderBalance;
            try (PreparedStatement ps = conn.prepareStatement(checkSender)) {
                ps.setString(1, senderAccountId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) senderBalance = rs.getBigDecimal("balance");
                    else throw new Exception("Sender account not found.");
                }
            }

            if (senderBalance.compareTo(amount) < 0) {
                throw new Exception("Insufficient funds.");
            }

            // 2. Lock receiver
            String checkReceiver = "SELECT 1 FROM \"Account\" WHERE id = ? FOR UPDATE";
            try (PreparedStatement ps = conn.prepareStatement(checkReceiver)) {
                ps.setString(1, receiverAccountId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (!rs.next()) throw new Exception("Receiver account not found.");
                }
            }

            // 3. Deduct
            String deduct = "UPDATE \"Account\" SET balance = balance - ?, \"updatedAt\" = CURRENT_TIMESTAMP WHERE id = ?";
            try (PreparedStatement ps = conn.prepareStatement(deduct)) {
                ps.setBigDecimal(1, amount);
                ps.setString(2, senderAccountId);
                ps.executeUpdate();
            }

            // 4. Add
            String add = "UPDATE \"Account\" SET balance = balance + ?, \"updatedAt\" = CURRENT_TIMESTAMP WHERE id = ?";
            try (PreparedStatement ps = conn.prepareStatement(add)) {
                ps.setBigDecimal(1, amount);
                ps.setString(2, receiverAccountId);
                ps.executeUpdate();
            }

            // 5. Create Transaction Record
            String insertTx = "INSERT INTO \"Transaction\" (id, reference, type, amount, status, description, \"senderAccountId\", \"receiverAccountId\", \"createdById\", \"createdAt\", \"updatedAt\") " +
                              "VALUES (gen_random_uuid()::text, ?, 'TRANSFER'::\"TransactionType\", ?, 'COMPLETED'::\"TransactionStatus\", ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
            try (PreparedStatement ps = conn.prepareStatement(insertTx)) {
                ps.setString(1, "TRX" + System.currentTimeMillis());
                ps.setBigDecimal(2, amount);
                ps.setString(3, description);
                ps.setString(4, senderAccountId);
                ps.setString(5, receiverAccountId);
                ps.setString(6, userId);
                ps.executeUpdate();
            }

            conn.commit();
            return true;
        } catch (Exception e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { }
            }
            throw e;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException e) { }
            }
        }
    }
}
