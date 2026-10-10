package com.apexbank.controller.customer;

import com.apexbank.dao.impl.TransactionDaoImpl;
import com.apexbank.model.Transaction;
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

@WebServlet("/api/transactions")
public class TransactionApiServlet extends HttpServlet {
    private TransactionDaoImpl transactionDao = new TransactionDaoImpl();

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String userId = req.getParameter("userId");
        if (userId == null || userId.isEmpty()) {
            JsonUtil.sendError(resp, 400, "Missing userId parameter");
            return;
        }

        List<Transaction> transactions = transactionDao.findByUserId(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", transactions);
        
        JsonUtil.sendJsonResponse(resp, 200, response);
    }
}
