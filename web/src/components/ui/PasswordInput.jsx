import { useState } from "react";

export default function PasswordInput({ id, value, onChange, placeholder, erro, autoComplete = "current-password" }) {
  const [ver, setVer] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={ver ? "text" : "password"}
        className={"campo pr-11 " + (erro ? "campo-erro" : "")}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setVer((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-marca-500"
        aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
        tabIndex={-1}
      >
        {ver ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
            <path d="M9.4 5.1A9.3 9.3 0 0112 5c6 0 10 7 10 7a15.9 15.9 0 01-3.6 4.2M6.1 6.1A15.9 15.9 0 002 12s4 7 10 7a9.3 9.3 0 003.5-.7" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
