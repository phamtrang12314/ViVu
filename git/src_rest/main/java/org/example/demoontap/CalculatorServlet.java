package org.example.demoontap;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "calculatorServlet", value = "/calculator")
public class CalculatorServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        try {
            double a = Double.parseDouble(request.getParameter("a"));
            double b = Double.parseDouble(request.getParameter("b"));
            String operator = request.getParameter("operator");

            double result;
            String operatorText;

            switch (operator) {
                case "add":
                    result = a + b;
                    operatorText = "Cong";
                    break;
                case "sub":
                    result = a - b;
                    operatorText = "Tru";
                    break;
                case "mul":
                    result = a * b;
                    operatorText = "Nhan";
                    break;
                case "div":
                    if (b == 0) {
                        request.setAttribute("error", "Khong the chia cho 0");
                        request.getRequestDispatcher("/index.jsp").forward(request, response);
                        return;
                    }
                    result = a / b;
                    operatorText = "Chia";
                    break;
                default:
                    request.setAttribute("error", "Phep tinh khong hop le");
                    request.getRequestDispatcher("/index.jsp").forward(request, response);
                    return;
            }

            request.setAttribute("a", a);
            request.setAttribute("b", b);
            request.setAttribute("operatorText", operatorText);
            request.setAttribute("result", result);
            request.getRequestDispatcher("/result.jsp").forward(request, response);
        } catch (NumberFormatException exception) {
            request.setAttribute("error", "Vui long nhap so hop le");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }
}
