<?php
session_start();
require('db.php');
require '../vendor/autoload.php'; // Include the Composer autoloader

$registration_message = "";

// Initialize Google Client
$client = new Google_Client();
$client->setClientId('745111404984-hgicribs2igo6nguei4opo0ubr1g2hup.apps.googleusercontent.com'); // Replace with your Google Client ID
$client->setClientSecret('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'); // Replace with your Google Client Secret
$client->setRedirectUri('http://localhost/TravelPlannerAI/dashboard/create.php'); // Replace with your callback URL
$client->addScope("email");
$client->addScope("profile");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $email = $_POST['email'];
    
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    if ($stmt = $con->prepare($sql)) {
        $stmt->bind_param("sss", $username, $email, $hashed_password);
        if ($stmt->execute()) {
            header("Location: ../dashboard/create.php");
        } else {
            $registration_message = "Грешка при изпълнение на SQL заявката.";
        }
        $stmt->close();
    } else {
        $registration_message = "Грешка при подготовката на SQL заявката.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
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
            width: 300px;
        }

        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin: 10px;
            width: 100%;
        }

        button:hover {
            background-color: #45a049;
        }

        .google-signin-button {
            background-color:rgb(255, 255, 255);
            color: black    ;
            border: solid 1px black;
            padding: 10px 15px;
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
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <h2>Sign Up</h2>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit" name="submit">Sign Up</button>
        <?php
    if (!empty($registration_message)) {
        echo "<p>$registration_message</p>";
    }
    ?>
        <p>Already have an account? <a href="login.php">Login here</a></p>

        <!-- Google Sign-In Button -->
        <button onclick="window.location.href='<?php echo $client->createAuthUrl(); ?>'" class="google-signin-button">
            <img src="google.png" alt="Google Logo" class="google-logo">
            Sign up with Google
        </button>
    </form>
</body>
</html>