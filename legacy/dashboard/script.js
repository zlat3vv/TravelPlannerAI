function initAutocomplete() {
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        console.error("Google Maps API is not loaded.");
        return;
    }

    const input = document.getElementById('destination-input');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') e.preventDefault();
    });
    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['(cities)']
    });

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
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
            alert('Началната дата не може да е в миналото.');
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
    const btn = document.getElementById('generate-btn');
    const statusDiv = document.getElementById('status-message');
    const overlay = document.getElementById('loading-overlay');

    if (!destination || !startDate || !endDate || !budget || !people) {
        statusDiv.innerHTML = '<p><strong>Трябва да въведете всички полета (дестинация, дни, бюджет и група).</strong></p>';
        statusDiv.style.display = 'block';
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (days < 1) {
        statusDiv.innerHTML = '<p><strong>Крайната дата трябва да е след началната дата.</strong></p>';
        statusDiv.style.display = 'block';
        return;
    }

    statusDiv.style.display = 'none';
    const oldBar = overlay.querySelector('.loading-bar');
    const newBar = oldBar.cloneNode(true);
    oldBar.parentNode.replaceChild(newBar, oldBar);
    overlay.classList.add('active');
    btn.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destination, startDate, endDate, days, budget: budget.value, people: people.value })
        });

        if (!response.ok) {
            const err = await response.json();
            let errorMsg = err.error || `Server error: ${response.status}`;
            if (err.googleStatus) {
                errorMsg += ` (Google API Status: ${err.googleStatus})`;
            }
            throw new Error(errorMsg);
        }

        const tripData = await response.json();

        sessionStorage.setItem('tripData', JSON.stringify(tripData));
        sessionStorage.setItem('tripMeta', JSON.stringify({ destination, startDate, endDate, budget: budget.value, people: people.value }));
        window.location.href = 'results.php';

    } catch (error) {
        console.error("Error:", error);
        overlay.classList.remove('active');
        btn.disabled = false;
        statusDiv.innerHTML = `<p><strong>❌ Не успяхме да създадем препоръки: ${error.message}</strong></p>`;
        statusDiv.style.display = 'block';
    }
}