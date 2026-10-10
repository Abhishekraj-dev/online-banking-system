package com.apexbank.controller.customer;

import com.apexbank.dao.impl.TransactionDaoImpl;
import com.apexbank.util.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/transactions")
public class TransactionApiServlet extends HttpServlet {
    private TransactionDaoImpl transactionDao;

    public void init() { this.transactionDao = new TransactionDaoImpl(); }

    static class TransferReq { String fromAccountId; String toAccountId; BigDecimal amount; String description; }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map<String, Object> user = (Map<String, Object>) req.getSession(false).getAttribute("user");
        if (user == null) { JsonUtil.sendError(resp, 401, "Unauthorized"); return; }
        
        TransferReq tr = JsonUtil.parseRequest(req, TransferReq.class);
        try {
            boolean success = transactionDao.executeTransfer(tr.fromAccountId, tr.toAccountId, tr.amount, tr.description, (String) user.get("id"));
            if (success) {
                Map<String, Object> res = new HashMap<>(); res.put("success", true);
                JsonUtil.sendJsonResponse(resp, 200, res);
            }
        } catch (Exception e) {
            JsonUtil.sendError(resp, 400, e.getMessage());
        }
    }
}
