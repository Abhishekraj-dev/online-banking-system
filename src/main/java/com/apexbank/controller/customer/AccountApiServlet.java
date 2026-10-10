package com.apexbank.controller.customer;

import com.apexbank.dao.impl.AccountDaoImpl;
import com.apexbank.model.Account;
import com.apexbank.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/accounts")
public class AccountApiServlet extends HttpServlet {
    private AccountDaoImpl accountDao = new AccountDaoImpl();

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String userId = req.getParameter("userId");
        if (userId == null || userId.isEmpty()) {
            JsonUtil.sendError(resp, 400, "Missing userId parameter");
            return;
        }

        List<Account> accounts = accountDao.findByUserId(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", accounts);
        
        JsonUtil.sendJsonResponse(resp, 200, response);
    }
}
