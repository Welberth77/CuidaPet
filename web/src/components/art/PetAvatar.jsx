import { useState } from "react";
import Lightbox from "../ui/Lightbox.jsx";

export default function PetAvatar({ especie = "cachorro", className = "", size = 40, fotoUrl, ampliavel = false }) {
  const [aberto, setAberto] = useState(false);
  if (fotoUrl) {
    return (
      <>
        <img
          src={fotoUrl}
          alt=""
          width={size}
          height={size}
          onClick={ampliavel ? (e) => { e.stopPropagation(); e.preventDefault(); setAberto(true); } : undefined}
          className={"shrink-0 rounded-full object-cover ring-1 ring-black/5 " + (ampliavel ? "cursor-zoom-in " : "") + className}
          style={{ width: size, height: size }}
          loading="lazy"
        />
        {ampliavel && aberto && <Lightbox src={fotoUrl} onFechar={() => setAberto(false)} />}
      </>
    );
  }

  const gato = especie === "gato";
  const bg = gato ? "#EDE7F6" : "#FDE9D4";
  const cor = gato ? "#6D5BA6" : "#C77D3C";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={"shrink-0 " + className} aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill={bg} />
      {gato ? (
        <g fill={cor}>
          <path d="M14 16l4 6-6 1zM34 16l-4 6 6 1z" />
          <circle cx="24" cy="27" r="11" />
          <g fill="#fff"><circle cx="20" cy="25" r="1.7" /><circle cx="28" cy="25" r="1.7" /></g>
          <path d="M23 29h2l-1 1.5z" fill="#3b2b55" />
          <path d="M24 31c2 0 3-1 3-1M24 31c-2 0-3-1-3-1" stroke="#3b2b55" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </g>
      ) : (
        <g fill={cor}>
          <ellipse cx="13" cy="20" rx="5" ry="8" />
          <ellipse cx="35" cy="20" rx="5" ry="8" />
          <circle cx="24" cy="26" r="12" />
          <g fill="#fff"><circle cx="20" cy="24" r="1.8" /><circle cx="28" cy="24" r="1.8" /></g>
          <ellipse cx="24" cy="29" rx="2.4" ry="1.8" fill="#4a3217" />
        </g>
      )}
    </svg>
  );
}
