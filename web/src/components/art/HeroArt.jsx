export default function HeroArt({ className = "" }) {
  return (
    <svg viewBox="0 0 400 340" className={className} role="img" aria-label="Pets e cuidado">
      <defs>
        <linearGradient id="hg" x1="120" y1="90" x2="300" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B7ABF" />
          <stop offset="1" stopColor="#053451" />
        </linearGradient>
      </defs>

      {/* blobs de fundo */}
      <circle cx="320" cy="70" r="54" fill="#ffffff" opacity="0.10" />
      <circle cx="70" cy="250" r="70" fill="#ffffff" opacity="0.08" />
      <circle cx="330" cy="260" r="26" fill="#FFB59A" opacity="0.7" />
      <circle cx="60" cy="90" r="16" fill="#FFB59A" opacity="0.6" />

      {/* coracao */}
      <path
        d="M200 282 C 110 214, 78 156, 112 120 C 142 88, 188 100, 200 136 C 212 100, 258 88, 288 120 C 322 156, 290 214, 200 282 Z"
        fill="url(#hg)"
      />

      {/* pata branca no centro do coracao */}
      <g fill="#ffffff" transform="translate(200 182)">
        <circle cx="-26" cy="-14" r="10" />
        <circle cx="-9" cy="-26" r="10" />
        <circle cx="9" cy="-26" r="10" />
        <circle cx="26" cy="-14" r="10" />
        <path d="M0 -10c14 0 25 10 25 22 0 9-7.5 13-15 13-4.5 0-6.8-2-10-2s-5.5 2-10 2c-7.5 0-15-4-15-13C-25 0-14-10 0-10z" />
      </g>

      {/* patinhas flutuantes */}
      <g fill="#ffffff" opacity="0.85">
        <g transform="translate(300 150) scale(0.5)">
          <circle cx="-16" cy="-8" r="5" /><circle cx="-5" cy="-15" r="5" />
          <circle cx="6" cy="-15" r="5" /><circle cx="16" cy="-8" r="5" />
          <path d="M0 -6c8 0 14 6 14 13 0 5-4 7-8 7-3 0-4-1-6-1s-3 1-6 1c-4 0-8-2-8-7C-14 0-8-6 0-6z" />
        </g>
      </g>
      <g fill="#FFB59A">
        <g transform="translate(95 170) scale(0.45)">
          <circle cx="-16" cy="-8" r="5" /><circle cx="-5" cy="-15" r="5" />
          <circle cx="6" cy="-15" r="5" /><circle cx="16" cy="-8" r="5" />
          <path d="M0 -6c8 0 14 6 14 13 0 5-4 7-8 7-3 0-4-1-6-1s-3 1-6 1c-4 0-8-2-8-7C-14 0-8-6 0-6z" />
        </g>
      </g>
    </svg>
  );
}
