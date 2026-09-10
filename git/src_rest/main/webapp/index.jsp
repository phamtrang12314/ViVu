<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>May tinh Servlet</title>
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

    label {
      display: block;
      margin-top: 14px;
      font-weight: bold;
    }

    input, select, button {
      width: 100%;
      padding: 10px;
      margin-top: 6px;
      box-sizing: border-box;
      font-size: 16px;
    }

    button {
      margin-top: 20px;
      background: #2563eb;
      color: white;
      border: 0;
      cursor: pointer;
    }

    .error {
      color: #b91c1c;
      font-weight: bold;
    }
  </style>
</head>
<body>
<div class="box">
  <h1>May tinh co ban</h1>

  <% if (request.getAttribute("error") != null) { %>
  <p class="error"><%= request.getAttribute("error") %></p>
  <% } %>

  <form method="post" action="${pageContext.request.contextPath}/calculator">
    <label for="a">So thu nhat</label>
    <input id="a" name="a" type="number" step="any" required>

    <label for="operator">Phep tinh</label>
    <select id="operator" name="operator">
      <option value="add">Cong</option>
      <option value="sub">Tru</option>
      <option value="mul">Nhan</option>
      <option value="div">Chia</option>
    </select>

    <label for="b">So thu hai</label>
    <input id="b" name="b" type="number" step="any" required>

    <button type="submit">Tinh ket qua</button>
  </form>
</div>
</body>
</html>
