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
            $_SESSION['error'] = "Невалидно потребителско име или парола.";
        }
    } else {
        $_SESSION['error'] = "Невалидно потребителско име или парола.";
    }
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="bg-BG">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Влизане - TravelPlannerAI</title>
    <link rel="stylesheet" href="style.css"/>
</head>
<body>
    <form class="form" method="post" name="login">
        <h1 class="login-title">Влизане</h1>        
        <?php
        if (isset($_SESSION['error'])) {
            echo "<div class='error-message'>{$_SESSION['error']}</div>";
            unset($_SESSION['error']);
        }
        ?>
        <label for="username">Потребителско име:</label>
        <input type="text" id="username" class="login-input" name="username" required>

        <label for="password">Парола:</label>
        <input type="password" id="password" class="login-input" name="password" required>

        <button type="submit" name="submit">Влез</button>
        <p class="link">Нямате акаунт? <a href="register.php">Регистрирайте се!</a></p>
    </form>
</body>
</html>
