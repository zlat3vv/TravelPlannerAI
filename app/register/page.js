"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import HeaderControls from "../components/HeaderControls";
import "../styles/auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password) {
      setError(t("errorRequired"));
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(t("successRegister"));
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.message || t("errorUnexpected"));
      }
    } catch (err) {
      setError(t("errorUnexpected"));
    }
  };

  return (
    <>
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <HeaderControls />
      </div>
      <div className="auth-container">
        <h2>{t("registerTitle")}</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">{t("usernameLabel")}</label>
            <input
              type="text"
              id="username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">{t("emailLabel")}</label>
            <input
              type="email"
              id="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">{t("passwordLabel")}</label>
            <input
              type="password"
              id="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">{t("registerButton")}</button>
          <p className="link">
            {t("haveAccount")} <Link href="/login">{t("loginLink")}</Link>
          </p>
        </form>
      </div>
    </>
  );
}
