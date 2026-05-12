"use client";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function HeaderControls() {
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginRight: "15px" }}>
      <button 
        onClick={toggleTheme} 
        style={{
          background: "var(--glass)",
          border: "1px solid var(--border)",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--text)",
          fontSize: "1.1rem",
          transition: "all 0.3s ease"
        }}
        title="Toggle Theme"
      >
        {isDark ? "🌙" : "☀️"}
      </button>

      <select 
        value={lang} 
        onChange={(e) => setLang(e.target.value)}
        style={{
          background: "var(--glass)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "6px 12px",
          color: "var(--text)",
          fontWeight: "600",
          fontSize: "0.9rem",
          cursor: "pointer",
          outline: "none"
        }}
      >
        <option value="bg">🇧🇬 BG</option>
        <option value="en">🇬🇧 EN</option>
        <option value="de">🇩🇪 DE</option>
        <option value="ru">🇷🇺 RU</option>
      </select>
    </div>
  );
}
