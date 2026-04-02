<?php
    $envFile = __DIR__ . '/../.env';
    $envVars = [];
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            $parts = explode('=', $line, 2);
            if (count($parts) === 2) {
                $envVars[trim($parts[0])] = trim($parts[1]);
            }
        }
    }

    $dbHost = $envVars['DB_HOST'] ?? 'localhost';
    $dbUser = $envVars['DB_USER'] ?? 'root';
    $dbPass = $envVars['DB_PASS'] ?? '';
    $dbName = $envVars['DB_NAME'] ?? 'loginsystem';

    $con = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
?>
