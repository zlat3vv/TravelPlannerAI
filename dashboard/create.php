<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Planner</title>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC3YUQokfrVjE2ClcMwgRgiWJxspyCCYcM&libraries=places"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Tell us your travel preferences 🏕️🌴</h1>
    <p>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>
    <form id="trip-form">
        <!-- Destination Input -->
        <div class="location-options">
            <label for="destination-input"><strong>Where are you planning on going?</strong></label><br>
            <input id="destination-input" type="text" placeholder="Type a destination">
        </div>

        <!-- Date Inputs -->
        <div class="date-options">
            <label for="start-date"><strong>Start Date:</strong></label><br>
            <input id="start-date" name="start-date" type="date">
        </div>
        <div class="date-options">
            <label for="end-date"><strong>End Date:</strong></label><br>
            <input id="end-date" name="end-date" type="date">
        </div>

        <!-- Budget Options -->
        <div class="budget-options-container">
            <label><strong>What is Your Budget?</strong></label>
            <div class="budget-options">
                <div class="budget-option">
                    <input type="radio" id="cheap" name="budget" value="cheap">
                    <label for="cheap">
                        <div class="budget-icon">💵</div>
                        <div><strong>Cheap</strong></div>
                        <div class="budget-description">Stay conscious of costs</div>
                    </label>
                </div>
                <div class="budget-option">
                    <input type="radio" id="moderate" name="budget" value="moderate">
                    <label for="moderate">
                        <div class="budget-icon">💰</div>
                        <div><strong>Moderate</strong></div>
                        <div class="budget-description">Keep cost on the average side</div>
                    </label>
                </div>
                <div class="budget-option">
                    <input type="radio" id="luxury" name="budget" value="luxury">
                    <label for="luxury">
                        <div class="budget-icon">🤑</div>
                        <div><strong>Luxury</strong></div>
                        <div class="budget-description">Don't worry about cost</div>
                    </label>
                </div>
            </div>
        </div>

        <!-- People Options -->
        <div class="people-options-container">
            <label><strong>Who are you traveling with?</strong></label>
            <div class="people-options">
                <div class="people-option">
                    <input type="radio" id="solo" name="people" value="solo">
                    <label for="solo">
                        <div class="people-icon">🙋‍♂️</div>
                        <div><strong>Solo</strong></div>
                        <div class="people-description">Traveling alone</div>
                    </label>
                </div>
                <div class="people-option">
                    <input type="radio" id="couple" name="people" value="couple">
                    <label for="couple">
                        <div class="people-icon">👫</div>
                        <div><strong>Couple</strong></div>
                        <div class="people-description">Traveling with a partner</div>
                    </label>
                </div>
                <div class="people-option">
                    <input type="radio" id="family" name="people" value="family">
                    <label for="family">
                        <div class="people-icon">👨‍👩‍👧‍👦</div>
                        <div><strong>Family</strong></div>
                        <div class="people-description">Traveling with family</div>
                    </label>
                </div>
                <div class="people-option">
                    <input type="radio" id="friends" name="people" value="friends">
                    <label for="friends">
                        <div class="people-icon">👯‍♂️</div>
                        <div><strong>Friends</strong></div>
                        <div class="people-description">Traveling with friends</div>
                    </label>
                </div>
            </div>
        </div>

        <!-- Generate Suggestions Button -->
        <button type="button" onclick="getTravelRecommendations()">Generate suggestions</button>
    </form>

    <!-- Recommendations Display -->
    <div id="recommendations" style="margin-top: 20px;"></div>

    <!-- Scripts -->
    <script src="script.js"></script>
</body>
</html>