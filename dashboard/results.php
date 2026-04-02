<?php
require '../auth/auth_session.php';
?>
<!DOCTYPE html>
<html lang="bg-BG">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вашият план за пътуване – Travel Planner AI</title>
    <meta name="description" content="Персонализиран план за вашето пътуване с препоръки за места, хотели и дейности.">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="result-styles.css">
</head>
<body>
    <div class="page-bg"></div>

    <nav class="top-nav">
        <a href="create.php" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Нов план
        </a>
        <div class="nav-logo">✈️ Travel Planner AI</div>
        <a href="../auth/logout.php" class="logout-btn">Излизане</a>
    </nav>

    <div id="loading-screen">
        <div class="loading-card">
            <div class="pulse-circles">
                <div class="circle c1"></div>
                <div class="circle c2"></div>
                <div class="circle c3"></div>
            </div>
            <div class="plane-icon">✈️</div>
            <h2>Зареждаме вашия план...</h2>
        </div>
    </div>

    <div id="app" style="display:none;">
        <!-- Hero Header -->
        <header class="trip-header">
            <div class="header-content">
                <div class="destination-badge">📍 <span id="destination-name"></span></div>
                <h1 id="trip-title">Вашият план за пътуване</h1>
                <div class="trip-meta-row">
                    <span class="meta-chip" id="meta-dates">🗓️</span>
                    <span class="meta-chip" id="meta-budget">💰</span>
                    <span class="meta-chip" id="meta-people">👥</span>
                </div>
            </div>
        </header>

        <!-- Tab Navigation -->
        <div class="tabs-container">
            <div class="tabs">
                <button class="tab active" onclick="showTab('itinerary', this)">📅 Програма по дни</button>
                <button class="tab" onclick="showTab('hotels', this)">🏨 Хотели</button>
            </div>
        </div>

        <!-- Itinerary Section -->
        <section id="itinerary-section" class="section">
            <div class="days-container" id="days-container"></div>
        </section>

        <!-- Hotels Section -->
        <section id="hotels-section" class="section" style="display:none;">
            <div class="hotels-grid" id="hotels-container"></div>
        </section>
    </div>

    <script>
        const budgetLabels = { cheap: '💵 Евтино', moderate: '💰 Умерено', luxury: '💎 Луксозно' };
        const peopleLabels = { solo: '🧍 Сам', couple: '👫 Двойка', family: '👨‍👩‍👧 Семейство', friends: '👥 Приятели' };

        function formatDate(dateStr) {
            const d = new Date(dateStr + 'T00:00:00');
            return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        function showTab(tab, btn) {
            document.getElementById('itinerary-section').style.display = tab === 'itinerary' ? 'block' : 'none';
            document.getElementById('hotels-section').style.display = tab === 'hotels' ? 'block' : 'none';
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
        }

        function createActivityCard(activity) {
            const photoHtml = activity.photo
                ? `<div class="card-photo"><img src="${activity.photo}" alt="${activity.name}" onerror="this.parentElement.style.display='none'"></div>`
                : '';
            const linkHtml = activity.url
                ? `<a href="${activity.url}" target="_blank" rel="noopener" class="card-link">Научи повече →</a>`
                : '';
            return `
                <div class="activity-card">
                    ${photoHtml}
                    <div class="card-body">
                        <h4 class="card-title">${activity.name}</h4>
                        <p class="card-desc">${activity.description}</p>
                        ${linkHtml}
                    </div>
                </div>`;
        }

        function createHotelCard(hotel) {
            const photoHtml = hotel.photo
                ? `<div class="hotel-photo"><img src="${hotel.photo}" alt="${hotel.name}" onerror="this.parentElement.style.display='none'"></div>`
                : '<div class="hotel-photo-placeholder">🏨</div>';
            const linkHtml = hotel.url
                ? `<a href="${hotel.url}" target="_blank" rel="noopener" class="card-link">Виж хотела →</a>`
                : '';
            return `
                <div class="hotel-card">
                    ${photoHtml}
                    <div class="hotel-body">
                        <h3 class="hotel-name">${hotel.name}</h3>
                        <p class="hotel-desc">${hotel.description}</p>
                        ${linkHtml}
                    </div>
                </div>`;
        }

        window.onload = () => {
            const tripDataRaw = sessionStorage.getItem('tripData');
            const tripMetaRaw = sessionStorage.getItem('tripMeta');

            if (!tripDataRaw) {
                window.location.href = 'create.php';
                return;
            }

            const trip = JSON.parse(tripDataRaw);
            const meta = tripMetaRaw ? JSON.parse(tripMetaRaw) : {};

            // Fill header
            document.getElementById('destination-name').textContent = trip.destination || meta.destination || '';
            document.getElementById('trip-title').textContent = `Вашият план за ${trip.destination || meta.destination}`;

            if (meta.startDate && meta.endDate) {
                document.getElementById('meta-dates').textContent = `🗓️ ${formatDate(meta.startDate)} – ${formatDate(meta.endDate)}`;
            }
            if (meta.budget) {
                document.getElementById('meta-budget').textContent = budgetLabels[meta.budget] || meta.budget;
            }
            if (meta.people) {
                document.getElementById('meta-people').textContent = peopleLabels[meta.people] || meta.people;
            }

            // Build days
            const daysContainer = document.getElementById('days-container');
            if (trip.days && trip.days.length > 0) {
                trip.days.forEach(day => {
                    const dateStr = day.date ? `<span class="day-date">${formatDate(day.date)}</span>` : '';
                    const activitiesHtml = (day.activities || []).map(createActivityCard).join('');
                    daysContainer.innerHTML += `
                        <div class="day-block">
                            <div class="day-header">
                                <div class="day-number">Ден ${day.day}</div>
                                ${dateStr}
                            </div>
                            <div class="activities-row">${activitiesHtml}</div>
                        </div>`;
                });
            }

            // Build hotels
            const hotelsContainer = document.getElementById('hotels-container');
            if (trip.hotels && trip.hotels.length > 0) {
                hotelsContainer.innerHTML = trip.hotels.map(createHotelCard).join('');
            }

            // Hide loading, show app
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('app').style.display = 'block';
        };
    </script>
</body>
</html>
