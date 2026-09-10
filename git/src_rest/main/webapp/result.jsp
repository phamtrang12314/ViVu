<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ket qua</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background: #f5f6fa;
      color: #1f2937;
    }

    .box {
      width: 420px;
      padding: 24px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .result {
      font-size: 28px;
      font-weight: bold;
      color: #2563eb;
    }
  </style>
</head>
<body>
<div class="box">
  <h1>Ket qua tinh toan</h1>
  <p>So thu nhat: ${a}</p>
  <p>Phep tinh: ${operatorText}</p>
  <p>So thu hai: ${b}</p>
  <p class="result">Ket qua: ${result}</p>
  <p><a href="${pageContext.request.contextPath}/calculator">Tinh lai</a></p>
</div>
</body>
</html>
