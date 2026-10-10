package com.apexbank.util;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtil {
    public static boolean verifyPassword(String plainText, String hashedPassword) {
        if (plainText == null || hashedPassword == null) return false;
        try {
            return BCrypt.checkpw(plainText, hashedPassword);
        } catch (Exception e) {
            return false;
        }
    }
}
