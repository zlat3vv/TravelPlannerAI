<?php
session_start();
require('db.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($email) || empty($password)) {
        $_SESSION['error'] = "Всички полета са задължителни!";
        header("Location: register.php");
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "Невалиден формат на имейл!";
        header("Location: register.php");
        exit();
    }
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

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

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
<html lang="bg-BG">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация - TravelPlannerAI</title>
    <link rel="stylesheet" href="style.css"/>
    <link rel="icon" type="image/png" href="/TravelPlannerAI/favicon.png">
</head>
<body>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <h2>Регистрация</h2>
        <?php
        if (isset($_SESSION['error'])) {
            echo "<div class='message error'>{$_SESSION['error']}</div>";
            unset($_SESSION['error']);
        }
        if (isset($_SESSION['success'])) {
            echo "<div class='message success'>{$_SESSION['success']}</div>";
            unset($_SESSION['success']);
        }
        ?>
        <label for="username">Потребителско име:</label>
        <input type="text" id="username" name="username" required>

        <label for="email">Имейл:</label>
        <input type="email" id="email" name="email" required>

        <label for="password">Парола:</label>
        <input type="password" id="password" name="password" required>

        <button type="submit" name="submit">Регистрирай се</button>
        <p class="link">Вече имате акаунт? <a href="login.php">Вход</a></p>
    </form>
</body>
</html>
