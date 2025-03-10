function initAutocomplete() {
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        console.error("Google Maps API is not loaded.");
        return;
    }

    const input = document.getElementById('destination-input');
    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['(cities)']
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.error("Няма информация за:", place.name);
            alert("Изберете валидна дестинация.");
            return;
        }
    });
}

window.onload = () => {
    initAutocomplete();

    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    startDateInput.min = tomorrow.toISOString().split('T')[0];
    endDateInput.min = tomorrow.toISOString().split('T')[0];

    startDateInput.value = tomorrow.toISOString().split('T')[0];
    endDateInput.value = tomorrow.toISOString().split('T')[0];

    startDateInput.addEventListener('change', () => {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate < tomorrow) {
            alert('Началната дате не може да е в миналото.');
            startDateInput.value = tomorrow.toISOString().split('T')[0];
        }

        endDateInput.min = startDateInput.value;
        if (endDate < startDate) {
            endDateInput.value = startDateInput.value;
        }
    });

    endDateInput.addEventListener('change', () => {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (endDate < startDate) {
            alert('Крайната дата трябва да е след началната дата.');
            endDateInput.value = startDateInput.value;
        }
    });
};

async function getTravelRecommendations() {
    const destination = document.getElementById('destination-input').value.trim();
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const budget = document.querySelector('input[name="budget"]:checked');
    const people = document.querySelector('input[name="people"]:checked');
    const recommendationsDiv = document.getElementById('recommendations');

    if (!destination || !startDate || !endDate || !budget || !people) {
        recommendationsDiv.innerHTML = "<p><strong>Трябва да въведете всички полета(дестинация, дни, бюджет и група).</strong></p>";
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days < 1) {
        recommendationsDiv.innerHTML = "<p><strong>Крайната дата трябва да е след началната дата.</strong></p>";
        return;
    }

    recommendationsDiv.innerHTML = "<p><strong>Моля изчакайте....Работим по въпроса.....</strong></p>";

    try {
        const response = await fetch('http://localhost:3000/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                destination,
                startDate,
                endDate,
                days,
                budget: budget.value,
                people: people.value
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const travelAdvice = await response.json();
        recommendationsDiv.innerHTML = `<p><strong>Препоръки за ${destination}:</strong></p><p>${travelAdvice.message}</p>`;
    } catch (error) {
        console.error("Error:", error);
        recommendationsDiv.innerHTML = "<p><strong>Не успяхме да създадем препоръки. Опитайте пак по-късно.</strong></p>";
    }
}