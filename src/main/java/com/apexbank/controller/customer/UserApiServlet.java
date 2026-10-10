package com.apexbank.controller.customer;

import com.apexbank.dao.impl.UserDaoImpl;
import com.apexbank.model.User;
import com.apexbank.util.JsonUtil;
import com.apexbank.util.PasswordUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.mindrot.jbcrypt.BCrypt;

@WebServlet("/api/users")
public class UserApiServlet extends HttpServlet {

    private UserDaoImpl userDao = new UserDaoImpl();

    static class RegisterReq {
        String name;
        String email;
        String phone;
        String password;
        String confirmPassword;
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        RegisterReq reg = JsonUtil.parseRequest(req, RegisterReq.class);

        if (reg == null || reg.email == null || reg.password == null || reg.name == null) {
            JsonUtil.sendError(resp, 400, "Missing required fields");
            return;
        }

        if (reg.confirmPassword != null && !reg.password.equals(reg.confirmPassword)) {
            JsonUtil.sendError(resp, 400, "Passwords do not match");
            return;
        }

        if (userDao.findByEmail(reg.email).isPresent()) {
            JsonUtil.sendError(resp, 409, "Email already exists");
            return;
        }

        try {
            User newUser = new User();
            newUser.setName(reg.name);
            newUser.setEmail(reg.email);
            // Hash password with BCrypt just like the original Next.js backend did
            newUser.setPasswordHash(BCrypt.hashpw(reg.password, BCrypt.gensalt(12)));
            newUser.setRole("CUSTOMER");
            newUser.setActive(true);

            boolean success = userDao.save(newUser);
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "User created successfully");
                
                Map<String, Object> data = new HashMap<>();
                data.put("id", newUser.getId());
                data.put("email", newUser.getEmail());
                data.put("name", newUser.getName());
                data.put("role", newUser.getRole());
                response.put("data", data);

                JsonUtil.sendJsonResponse(resp, 201, response);
            } else {
                JsonUtil.sendError(resp, 500, "Failed to create user in database");
            }
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(resp, 500, "Server error during registration");
        }
    }
}
