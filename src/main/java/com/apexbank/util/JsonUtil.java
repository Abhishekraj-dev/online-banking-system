package com.apexbank.util;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

public class JsonUtil {
    private static final Gson gson = new Gson();

    public static <T> T parseRequest(HttpServletRequest req, Class<T> classOfT) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
        }
        String json = sb.toString();
        System.out.println("DEBUG JSON PAYLOAD: [" + json + "]");
        return gson.fromJson(json, classOfT);
    }

    public static void sendJsonResponse(HttpServletResponse resp, int statusCode, Object data) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(statusCode);
        try (PrintWriter out = resp.getWriter()) {
            out.print(gson.toJson(data));
        }
    }

    public static void sendError(HttpServletResponse resp, int statusCode, String message) throws IOException {
        class ErrorResponse { boolean success = false; String message; ErrorResponse(String msg) { this.message = msg; } }
        sendJsonResponse(resp, statusCode, new ErrorResponse(message));
    }
}
