"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import HeaderControls from "../components/HeaderControls";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/create.css";

export default function CreateTrip() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t, lang } = useLanguage();

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  const toISO = (dateObj) => {
    if (!dateObj) return "";
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const todayISO = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split("T")[0];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!startDate) setStartDate(tomorrow);
     
    if (!endDate) setEndDate(tomorrow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScriptLoad = () => {
    if (typeof window.google === "undefined" || !window.google.maps) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["(cities)"] }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry) {
        alert("Select a valid destination.");
        return;
      }
      setDestination(place.name || inputRef.current.value);
    });
  };

  const handleSubmit = async () => {
    const finalDest = inputRef.current?.value || destination;

    if (!finalDest || !startDate || !endDate || !budget || !people) {
      setErrorMsg(t("errorRequired") || "You must fill all fields.");
      return;
    }

    const startISO = toISO(startDate);
    const endISO = toISO(endDate);
    const start = new Date(startISO);
    const end = new Date(endISO);

    if (end < start) {
      setErrorMsg("End date must be on or after start date.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: finalDest,
          startDate: toISO(startDate),
          endDate: toISO(endDate),
          budget,
          people,
          language: lang,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Server error: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.tripId) {
        router.push(`/trips/${responseData.tripId}`);
      } else {
        throw new Error("Failed to get trip ID from response");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(`${t("errorUnexpected")}: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        onReady={handleScriptLoad}
        strategy="lazyOnload"
      />

      {loading && (
        <div id="loading-overlay" className="active" aria-hidden="true">
          <div className="loading-content">
            <div className="plane-wrapper">
              <div className="trail"></div>
              <div className="trail t2"></div>
              <div className="trail t3"></div>
              <div className="plane-emoji">✈️</div>
            </div>
            <h2 className="loading-title">{t("loadingTitle")}</h2>
            <p className="loading-sub">{t("loadingSub")}</p>
            <div className="loading-bar-wrap">
              <div className="loading-bar"></div>
            </div>
          </div>
        </div>
      )}

      <div className="main-container">
          <div className="create-header">
            <Link href="/trips" className="trips-btn" style={{ 
              textDecoration: "none", color: "var(--text)", fontWeight: "600", fontSize: "0.9rem",
              background: "var(--glass)", padding: "8px 16px", borderRadius: "20px", border: "1px solid var(--border)"
            }}>
              🗺️ My Trips
            </Link>
            <HeaderControls />
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })} 
              className="btn-logout"
            >
              {t("navLogout")}
            </button>
          </div>

          <h1>
            <span>{t("createTitle")}</span>
            <span style={{ color: "initial", WebkitTextFillColor: "initial" }}> ⛺ 🌴</span>
          </h1>
        <p>{t("createSubtitle")}</p>

        <form id="trip-form" onSubmit={(e) => e.preventDefault()}>
          <div className="location-options">
            <h4><strong>{t("destLabel")}</strong></h4><br />
            <input
              id="destination-input"
              type="text"
              placeholder={t("destPlaceholder")}
              ref={inputRef}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />
          </div>

          <div className="date-row">
            <div className="date-options">
              <h4><strong>{t("startDateLabel")}</strong></h4>
              <div className="date-input-wrapper">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  dateFormat="dd.MM.yyyy"
                  className="input-premium"
                  placeholderText="dd.mm.yyyy"
                />
                <span className="calendar-icon">📅</span>
              </div>
            </div>
            <div className="date-options">
              <h4><strong>{t("endDateLabel")}</strong></h4>
              <div className="date-input-wrapper">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  dateFormat="dd.MM.yyyy"
                  className="input-premium"
                  placeholderText="dd.mm.yyyy"
                />
                <span className="calendar-icon">📅</span>
              </div>
            </div>
          </div>

          <div className="budget-options-container">
            <h4><strong>{t("budgetLabel")}</strong></h4>
            <div className="budget-options">
              {["cheap", "moderate", "luxury"].map((val) => (
                <div className="budget-option" key={val}>
                  <input
                    type="radio"
                    id={val}
                    name="budget"
                    value={val}
                    checked={budget === val}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                  <label htmlFor={val}>
                    <div className="budget-icon">
                      {val === "cheap" ? "💵" : val === "moderate" ? "💰" : "🤑"}
                    </div>
                    <div className="option-text">
                      <strong>
                        {val === "cheap" ? t("budgetCheap") : val === "moderate" ? t("budgetModerate") : t("budgetLuxury")}
                      </strong>
                      <span className="budget-description">
                        {val === "cheap"
                          ? t("budgetCheapDesc")
                          : val === "moderate"
                          ? t("budgetModerateDesc")
                          : t("budgetLuxuryDesc")}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="people-options-container">
            <h4><strong>{t("peopleLabel")}</strong></h4>
            <div className="people-options">
              {[
                { id: "solo", icon: "🧍", label: t("peopleSolo"), desc: t("peopleSoloDesc") },
                { id: "couple", icon: "👫", label: t("peopleCouple"), desc: t("peopleCoupleDesc") },
                { id: "family", icon: "👨‍👩‍👧", label: t("peopleFamily"), desc: t("peopleFamilyDesc") },
                { id: "friends", icon: "👥", label: t("peopleFriends"), desc: t("peopleFriendsDesc") },
              ].map((opt) => (
                <div className="people-option" key={opt.id}>
                  <input
                    type="radio"
                    id={opt.id}
                    name="people"
                    value={opt.id}
                    checked={people === opt.id}
                    onChange={(e) => setPeople(e.target.value)}
                  />
                  <label htmlFor={opt.id}>
                    <div className="people-icon">{opt.icon}</div>
                    <div className="option-text">
                      <strong>{opt.label}</strong>
                      <span className="people-description">{opt.desc}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button type="button" id="generate-btn" className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ margin: "3rem auto 0", display: "block" }}>
            {t("generateBtn")}
          </button>
        </form>
        {errorMsg && (
          <div id="status-message" style={{ display: "block" }}>
            <p><strong>❌ {errorMsg}</strong></p>
          </div>
        )}
      </div>
    </>
  );
}
