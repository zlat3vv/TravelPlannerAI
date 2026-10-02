"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import HeaderControls from "../components/HeaderControls";
import "../styles/auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError(t("errorRequired"));
      return;
    }

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(t("errorInvalidLogin"));
      } else {
        router.push("/create");
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
        <h2>{t("loginTitle")}</h2>
        {error && <div className="error">{error}</div>}
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
          <button type="submit" className="login-button">{t("loginButton")}</button>
          <p className="link">
            {t("noAccount")} <Link href="/register">{t("registerLink")}</Link>
          </p>
        </form>
      </div>
    </>
  );
}
