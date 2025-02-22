<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC3YUQokfrVjE2ClcMwgRgiWJxspyCCYcM&libraries=places"></script>
    <title>Create Trip</title>
</head>
<body>
    <form id="trip-form">
        <h1>Create Trip</h1>
        <div>
            <label for="destination-input">Where are you planning on going?</label> <br>
            <input id="destination-input" type="text" placeholder="Type a destination" style="width: 50%; padding: 8px;">
        </div>
        <div>
            <label for="days">How many days is your trip?</label> <br>
            <input id="days" type="number" placeholder="Ex. 3" style="width: 50%; padding: 8px;">
        </div>
        <button type="button" onclick="getTravelRecommendations()">Generate suggestions</button>
        <div id="recommendations" style="margin-top: 20px;"></div>
    </form>
</body>
<script>
    function initAutocomplete() {
        const input = document.getElementById('destination-input');
        const autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log("Selected Place:", place);
        });
    }
    window.onload = initAutocomplete;

    async function getTravelRecommendations() {
        const destination = document.getElementById('destination-input').value;
        const days = document.getElementById('days').value;
        const recommendationsDiv = document.getElementById('recommendations');

        if (!destination || !days) {
            recommendationsDiv.innerHTML = "<p>Please enter both a destination and number of days.</p>";
            return;
        }

        recommendationsDiv.innerHTML = "<p>Loading recommendations...</p>";

        try {
            const response = await fetch('http://localhost:3000/create-trip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ destination, days })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const travelAdvice = await response.json();
            recommendationsDiv.innerHTML = `<p><strong>Recommendations for ${destination}:</strong></p><p>${travelAdvice.message}</p>`;
        } catch (error) {
            console.error("Error:", error);
            recommendationsDiv.innerHTML = "<p>Failed to load recommendations. Please try again later.</p>";
        }
    }
</script>
</html>
