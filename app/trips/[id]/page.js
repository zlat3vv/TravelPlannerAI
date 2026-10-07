"use client";

import Image from "next/image";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import HeaderControls from "../../components/HeaderControls";
import "../../styles/results.css";

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function TripDetails({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t, lang } = useLanguage();

  const [trip, setTrip] = useState(null);
  const [meta, setMeta] = useState(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch(`/api/trips/${resolvedParams.id}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to load trip");
          return res.json();
        })
        .then(data => {
          setTrip(data.tripData);
          setMeta({
            destination: data.destination,
            startDate: data.startDate,
            endDate: data.endDate,
            budget: data.budget,
            people: data.people
          });
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load trip or unauthorized");
        });
    }
  }, [status, resolvedParams.id, router]);

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "var(--text)" }}>
        <h2>{error}</h2>
        <Link href="/trips" style={{ color: "#3182ce" }}>Back to Trips</Link>
      </div>
    );
  }

  if (!trip || !meta) {
    return (
      <div id="loading-screen" style={{ display: "flex" }}>
        <div className="loading-card">
          <div className="pulse-circles">
            <div className="circle c1"></div>
            <div className="circle c2"></div>
            <div className="circle c3"></div>
          </div>
          <div className="plane-icon">✈️</div>
          <h2>{t("resultsLoading")}</h2>
        </div>
      </div>
    );
  }

  const destinationName = trip.destination || meta.destination || "";

  return (
    <>
      <div className="page-bg"></div>

      <nav className="top-nav">
        <Link href="/trips" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Trips
        </Link>
        <div className="nav-logo">✈️ TravelPlannerAI</div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <HeaderControls />
        </div>
      </nav>

      <div id="app">
        <header className="trip-header">
          <div className="header-content">
            <div className="destination-badge">📍 <span>{destinationName}</span></div>
            <h1 id="trip-title">{t("resultsTitle")} {destinationName}</h1>
            <div className="trip-meta-row">
              {meta.startDate && meta.endDate && (
                <span className="meta-chip">🗓️ {formatDate(meta.startDate)} – {formatDate(meta.endDate)}</span>
              )}
              {meta.budget && (
                <span className="meta-chip">{
                  meta.budget === 'cheap' ? t("budgetCheap") : 
                  meta.budget === 'moderate' ? t("budgetModerate") : 
                  t("budgetLuxury")
                }</span>
              )}
              {meta.people && (
                <span className="meta-chip">{
                  meta.people === 'solo' ? t("peopleSolo") : 
                  meta.people === 'couple' ? t("peopleCouple") : 
                  meta.people === 'family' ? t("peopleFamily") : 
                  t("peopleFriends")
                }</span>
              )}
            </div>
          </div>
        </header>

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "itinerary" ? "active" : ""}`}
              onClick={() => setActiveTab("itinerary")}
            >
              {t("tabItinerary")}
            </button>
            <button
              className={`tab ${activeTab === "hotels" ? "active" : ""}`}
              onClick={() => setActiveTab("hotels")}
            >
              {t("tabHotels")}
            </button>
          </div>
        </div>

        {activeTab === "itinerary" && (
          <section id="itinerary-section" className="section">
            <div className="days-container">
              {(trip.days || []).map((day, idx) => (
                <div className="day-block" key={idx}>
                  <div className="day-header">
                    <div className="day-number">{t("dayPrefix")} {day.day}</div>
                    {day.date && <span className="day-date">{formatDate(day.date)}</span>}
                  </div>
                  <div className="activities-row">
                    {(day.activities || []).map((activity, aidx) => (
                      <div className="activity-card" key={aidx}>
                        {activity.photo && (
                          <div className="card-photo">
                            <Image src={activity.photo} alt={activity.name} width={800} height={400} />
                          </div>
                        )}
                        <div className="card-body">
                          <h4 className="card-title">{activity.name}</h4>
                          <p className="card-desc">{activity.description}</p>
                          {activity.url && (
                            <a href={activity.url} target="_blank" rel="noopener noreferrer" className="card-link">
                              {t("learnMore")}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "hotels" && (
          <section id="hotels-section" className="section">
            <div className="hotels-grid">
              {(trip.hotels || []).map((hotel, idx) => (
                <div className="hotel-card" key={idx}>
                  {hotel.photo ? (
                    <div className="hotel-photo">
                      <Image src={hotel.photo} alt={hotel.name} width={800} height={400} />
                    </div>
                  ) : (
                    <div className="hotel-photo-placeholder">🏨</div>
                  )}
                  <div className="hotel-body">
                    <h3 className="hotel-name">{hotel.name}</h3>
                    <p className="hotel-desc">{hotel.description}</p>
                    {hotel.url && (
                      <a href={hotel.url} target="_blank" rel="noopener noreferrer" className="card-link">
                        {t("viewHotel")}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
