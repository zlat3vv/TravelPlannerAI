<?php
session_start();
require('db.php');

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['username'], $_POST['password'])) {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {
        $_SESSION['error'] = "Потребителско име и парола са задължителни!";
        header("Location: login.php");
        exit();
    }

    $sql = $con->prepare("SELECT * FROM users WHERE username = ?");
    $sql->bind_param('s', $username);
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if (password_verify($password, $row["password"])) {
            $_SESSION['username'] = $row['username'];
            header("Location: ../dashboard/create.php");
            exit();
        } else {
            $_SESSION['error'] = "Не валидно потреебителско име или парола.";
        }
    header("Location: login.php");
    exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Login</title>
    <link rel="stylesheet" href="style.css"/>
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

        .error-message {
            color: red;
            font-size: 14px;
            margin-bottom: 10px;
        }

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

        .link {
            margin-top: 10px;
        }
    </style>    
</head>
<body>
    <form class="form" method="post" name="login">
        <h1 class="login-title">Влизане</h1>        
        <?php
        if (isset($_SESSION['error'])) {
            echo "<p class='error-message'>{$_SESSION['error']}</p>";
            unset($_SESSION['error']);
        }
        ?>
        <label for="username">Потребителско име:</label>
        <input type="text" class="login-input" name="username"required />
        <br>
        <label for="username">Парола:</label>
        <input type="password" class="login-input" name="password" required />
        <br>
        <button type="submit" name="submit">Влез</button>
        <p class="link">Нямате акаунт? <a href="register.php">Регистрирайте се сега!</a></p>
    </form>
</body>
</html>
