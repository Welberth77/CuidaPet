export default function EmptyArt({ className = "" }) {
  return (
    <svg viewBox="0 0 220 160" className={className} role="img" aria-label="Vazio">
      <ellipse cx="110" cy="138" rx="78" ry="12" fill="#053451" opacity="0.06" />
      <rect x="40" y="36" width="140" height="92" rx="16" fill="#EAF4FB" stroke="#0B7ABF" strokeOpacity="0.3" strokeDasharray="6 7" strokeWidth="2" />
      <g transform="translate(110 84)">
        <g fill="#0B7ABF" opacity="0.85">
          <circle cx="-22" cy="-10" r="7" /><circle cx="-7" cy="-20" r="7" />
          <circle cx="8" cy="-20" r="7" /><circle cx="23" cy="-10" r="7" />
          <path d="M0 -6c11 0 20 8 20 18 0 7-6 10-11 10-3.5 0-5-1.5-9-1.5S-5 22-8.5 22c-5 0-11-3-11-10C-19.5 2-11-6 0-6z" />
        </g>
      </g>
    </svg>
  );
}
