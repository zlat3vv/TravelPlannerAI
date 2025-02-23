<?php
session_start();
require('db.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Проверка за празни полета
    if (empty($username) || empty($email) || empty($password)) {
        $_SESSION['error'] = "Всички полета са задължителни!";
        header("Location: register.php");
        exit();
    }

    // Валидация на имейл
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "Невалиден формат на имейл!";
        header("Location: register.php");
        exit();
    }

    // Проверка дали потребителското име или имейлът вече съществуват
    $check_sql = $con->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $check_sql->bind_param("ss", $username, $email);
    $check_sql->execute();
    $check_sql->store_result();

    if ($check_sql->num_rows > 0) {
        $_SESSION['error'] = "Потребителското име или имейлът вече са заети!";
        header("Location: register.php");
        exit();
    }
    $check_sql->close();

    // Хеширане на паролата
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Вмъкване на нов потребител
    $sql = $con->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $sql->bind_param("sss", $username, $email, $hashed_password);

    if ($sql->execute()) {
        $_SESSION['success'] = "Успешна регистрация! Влезте в профила си.";
        header("Location: login.php");
        exit();
    } else {
        $_SESSION['error'] = "Грешка при регистрацията. Опитайте отново!";
    }

    $sql->close();
}
?>

<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        form {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .message {
            font-size: 14px;
            margin-bottom: 10px;
        }

        .error { color: red; }
        .success { color: green; }

        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin: 10px;
        }

        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <h2>Регистрация</h2>

        <?php
        if (isset($_SESSION['error'])) {
            echo "<p class='message error'>{$_SESSION['error']}</p>";
            unset($_SESSION['error']);
        }
        if (isset($_SESSION['success'])) {
            echo "<p class='message success'>{$_SESSION['success']}</p>";
            unset($_SESSION['success']);
        }
        ?>

        <label for="username">Потребителско име:</label>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="email">Имейл:</label>
        <input type="email" id="email" name="email" required>
        <br>
        <label for="password">Парола:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit" name="submit">Регистрирай се</button>
        <p>Вече имате акаунт? <a href="login.php">Вход</a></p>
    </form>
</body>
</html>
