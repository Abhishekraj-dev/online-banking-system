package com.apexbank.controller.auth;

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
import java.util.Optional;

@WebServlet("/api/auth/login")
public class AuthApiServlet extends HttpServlet {

    static class LoginReq { String email; String password; }
    private UserDaoImpl userDao = new UserDaoImpl();

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        LoginReq login = JsonUtil.parseRequest(req, LoginReq.class);
        if (login != null && login.email != null && login.password != null) {
            Optional<User> uOpt = userDao.findByEmail(login.email);
            if (uOpt.isPresent()) {
                User u = uOpt.get();
                if (u.isActive() && PasswordUtil.verifyPassword(login.password, u.getPasswordHash())) {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", u.getId());
                    userMap.put("email", u.getEmail());
                    userMap.put("name", u.getName());
                    userMap.put("role", u.getRole());
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("data", userMap);
                    
                    req.getSession(true).setAttribute("user", userMap);
                    JsonUtil.sendJsonResponse(resp, 200, response);
                    return;
                }
            }
        }
        JsonUtil.sendError(resp, 401, "Invalid credentials");
    }
}
