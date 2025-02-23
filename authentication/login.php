<?php
session_start();
require('db.php');
require '../vendor/autoload.php'; // Include the Composer autoloader

$client = new Google_Client();
$client->setClientId('745111404984-hgicribs2igo6nguei4opo0ubr1g2hup.apps.googleusercontent.com');
$client->setClientSecret('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');
$client->setRedirectUri('http://localhost/TravelPlannerAI/dashboard/create.php');
$client->addScope("email");
$client->addScope("profile");

if (isset($_POST['username'])) {
    // Existing login logic
    $sql = $con->prepare("SELECT * FROM users WHERE username = ?");
    $sql->bind_param('s', $_POST['username']);
    $sql->execute();
    $result = $sql->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $_SESSION['username'] = $row['username'];
        if (password_verify($_POST['password'], $row["password"])) {
            if ($row["isAdmin"] == 1) {
                header("Location: ./dashboard/create.php");
            } else {
                echo "<div class='form'>
                    <h3>You are not an admin.</h3><br/>
                    <p class='link'>Click here to <a href='login.php'> login</a> again.</p>
                    </div>";
            }
        } else {
            echo "<div class='form'>
                <h3>Invalid username or password.</h3><br/>
                <p class='link'>Click here to <a href='login.php'> login</a> again.</p>
                </div>";
        }
    } else {
        echo "<div class='form'>
            <h3>Invalid username or password.</h3><br/>
            <p class='link'>Click here to <a href='login.php'> login</a> again.</p>
            </div>";
    }
    exit;
}
?>

<!DOCTYPE html>
<html>
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
        .google-signin-button {
            background-color:rgb(255, 255, 255);
            color: black;
            border: solid 1px black;
            padding: ceneter;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: background-color 0.3s ease;
            width: 100%;
        }

        .google-signin-button:hover {
            background-color:rgb(201, 201, 201);
        }

        .google-logo {
            width: 20px;
            height: 20px;
        }
    </style>    
</head>
<body>
    <form class="form" method="post" name="login">
        <h1 class="login-title">Login</h1>
        <input type="text" class="login-input" name="username" placeholder="Username" autofocus="true"/>
        <input type="password" class="login-input" name="password" placeholder="Password"/>
        <button type="submit" name="submit">Login</button>
        <p class="link">Don't have an account? <a href="register.php">Register now!</a></p>
        <button onclick="window.location.href='<?php echo $client->createAuthUrl(); ?>'" class="google-signin-button">
            <img src="google.png" alt="Google Logo" class="google-logo">
            Sign up with Google
        </button></form>
</body>
</html>