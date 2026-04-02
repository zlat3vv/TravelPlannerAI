<?php
require '../auth/auth_session.php';
?>
<!DOCTYPE html>
<html lang="bg-BG">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Planner</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC3YUQokfrVjE2ClcMwgRgiWJxspyCCYcM&libraries=places"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="main-container">
        <a href="../auth/logout.php" class="logout-btn">Излизане</a>
        <h1>Кажете ни вашите предпочитания за пътуване &#9978 &#127796</h1>
        <p>Предоставете малко информация и нашата платформа ще генерира персонализирани препоръки въз основа на вашите предпочитания.</p>
        
        <form id="trip-form">
            <div class="location-options">
                <h4 for="destination-input"><strong>Къде планувате да ходите?</strong></h4><br>
                <input id="destination-input" type="text" placeholder="Въведете дестинация">
            </div>

            <div class="date-options">
                <h4 for="start-date"><strong>Начална дата:</strong></h4><br>
                <input id="start-date" name="start-date" type="date">
            </div> 
            <div class="date-options">
                <h4 for="end-date"><strong>Крайна дата:</strong></h4><br>
                <input id="end-date" name="end-date" type="date">
            </div>

            <div class="budget-options-container">
                <h4><strong>Какъв е вашия бюджет?</strong></h4>
                <div class="budget-options">
                    <div class="budget-option">
                        <input type="radio" id="cheap" name="budget" value="cheap">
                        <label for="cheap">
                            <div class="budget-icon">&#128181</div>
                            <div><strong>Евтино</strong></div>
                            <div class="budget-description">По-внимателно с разходите</div>
                        </label>
                    </div>
                    <div class="budget-option">
                        <input type="radio" id="moderate" name="budget" value="moderate">
                        <label for="moderate">
                            <div class="budget-icon">&#128176</div>
                            <div><strong>Умерено</strong></div>
                            <div class="budget-description">Поддържайте разходите не толкова насериозно</div>
                        </label>
                    </div>
                    <div class="budget-option">
                        <input type="radio" id="luxury" name="budget" value="luxury">
                        <label for="luxury">
                            <div class="budget-icon">&#129297</div>
                            <div><strong>Луксозно</strong></div>
                            <div class="budget-description">Не гледате етикета</div>
                        </label>
                    </div>
                </div>
            </div>

            <div class="people-options-container">
                <h4><strong>С кого ще пътувате?</strong></h4>
                <div class="people-options">
                    <div class="people-option">
                        <input type="radio" id="solo" name="people" value="solo">
                        <label for="solo">
                            <div class="people-icon">&#128589</div>
                            <div><strong>Сам</strong></div>
                            <div class="people-description">Пътувате сам</div>
                        </label>
                    </div>
                    <div class="people-option">
                        <input type="radio" id="couple" name="people" value="couple">
                        <label for="couple">
                            <div class="people-icon">&#128107</div>
                            <div><strong>Двойка</strong></div>
                            <div class="people-description">Пътувате с партньор</div>
                        </label>
                    </div>
                    <div class="people-option">
                        <input type="radio" id="family" name="people" value="family">
                        <label for="family">
                            <div class="people-icon">&#128106</div>
                            <div><strong>Семейство</strong></div>
                            <div class="people-description">Пътувате със семейството</div>
                        </label>
                    </div>
                    <div class="people-option">
                        <input type="radio" id="friends" name="people" value="friends">
                        <label for="friends">
                            <div class="people-icon">&#128111</div>
                            <div><strong>Приятели</strong></div>
                            <div class="people-description">Пътувате с приятели</div>
                        </label>
                    </div>
                </div>
            </div>
            <button type="button" onclick="getTravelRecommendations()">Генерирай препоръки</button>
        </form>
        <div id="recommendations"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>