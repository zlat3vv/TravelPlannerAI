"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeaderControls from "../components/HeaderControls";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/trips.css";

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function TripsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/trips")
        .then(res => res.json())
        .then(data => {
          setTrips(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (loading || status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "var(--text)" }}>
        <h2>Loading trips...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="page-bg"></div>

      <nav className="top-nav">
        <Link href="/create" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t("navNewPlan")}
        </Link>
        <div className="nav-logo">✈️ TravelPlannerAI</div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <HeaderControls />
        </div>
      </nav>

      <div className="trips-container">
        <h1>My Generated Trips</h1>
        
        {trips.length === 0 ? (
          <div className="no-trips">
            <p>You haven&apos;t generated any trips yet.</p>
            <Link href="/create" className="create-new-btn">Create your first trip</Link>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.map(trip => (
              <Link href={`/trips/${trip.id}`} key={trip.id} className="trip-card">
                <div className="trip-card-header">
                  <h3>📍 {trip.destination}</h3>
                </div>
                <div className="trip-card-body">
                  <p><strong>Date:</strong> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                  <p><strong>Budget:</strong> {trip.budget}</p>
                  <p><strong>People:</strong> {trip.people}</p>
                  <p className="trip-date">Created on: {new Date(trip.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
