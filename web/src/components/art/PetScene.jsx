export default function PetScene({ className = "" }) {
  return (
    <svg viewBox="0 0 360 300" className={className} role="img" aria-label="Um cachorro e um gato">
      {/* fundo */}
      <circle cx="180" cy="150" r="138" fill="#FFF6EE" />
      <circle cx="300" cy="60" r="10" fill="#F6A877" opacity="0.8" />
      <circle cx="58" cy="90" r="7" fill="#F6A877" opacity="0.7" />
      <ellipse cx="180" cy="248" rx="120" ry="16" fill="#053451" opacity="0.08" />

      {/* ===== CACHORRO ===== */}
      <g>
        {/* rabo */}
        <path d="M86 210 q-34 -6 -40 -34 q18 8 30 18 q10 8 16 20z" fill="#C77D3C" />
        {/* corpo */}
        <ellipse cx="124" cy="196" rx="46" ry="50" fill="#E6A45E" />
        <ellipse cx="124" cy="214" rx="28" ry="34" fill="#F6D9B4" />
        {/* patas */}
        <rect x="104" y="214" width="16" height="42" rx="8" fill="#E6A45E" />
        <rect x="128" y="214" width="16" height="42" rx="8" fill="#E6A45E" />
        <ellipse cx="112" cy="254" rx="10" ry="6" fill="#F6D9B4" />
        <ellipse cx="136" cy="254" rx="10" ry="6" fill="#F6D9B4" />
        {/* orelhas */}
        <ellipse cx="86" cy="118" rx="16" ry="34" fill="#C77D3C" transform="rotate(-12 86 118)" />
        <ellipse cx="162" cy="118" rx="16" ry="34" fill="#C77D3C" transform="rotate(12 162 118)" />
        {/* cabeca */}
        <circle cx="124" cy="120" r="46" fill="#E6A45E" />
        <ellipse cx="124" cy="138" rx="27" ry="21" fill="#F6D9B4" />
        {/* olhos */}
        <circle cx="108" cy="112" r="6" fill="#3a2a1a" />
        <circle cx="140" cy="112" r="6" fill="#3a2a1a" />
        <circle cx="110" cy="110" r="2" fill="#fff" />
        <circle cx="142" cy="110" r="2" fill="#fff" />
        {/* focinho */}
        <ellipse cx="124" cy="128" rx="7" ry="5" fill="#3a2a1a" />
        <path d="M124 133 v7 M124 140 q-7 4 -12 0 M124 140 q7 4 12 0" stroke="#8a6a44" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* ===== GATO ===== */}
      <g>
        {/* rabo curvo */}
        <path d="M284 222 q40 2 34 -40 q-4 24 -22 28 q-12 2 -12 12z" fill="#9FB0C4" />
        {/* corpo */}
        <ellipse cx="244" cy="202" rx="38" ry="46" fill="#B4C2D4" />
        <ellipse cx="244" cy="216" rx="24" ry="30" fill="#E7EDF4" />
        {/* patas */}
        <ellipse cx="232" cy="248" rx="10" ry="6" fill="#E7EDF4" />
        <ellipse cx="256" cy="248" rx="10" ry="6" fill="#E7EDF4" />
        {/* orelhas */}
        <path d="M218 108 l8 -30 l20 18z" fill="#B4C2D4" />
        <path d="M270 108 l-8 -30 l-20 18z" fill="#B4C2D4" />
        <path d="M224 104 l5 -17 l11 11z" fill="#F6A877" />
        <path d="M264 104 l-5 -17 l-11 11z" fill="#F6A877" />
        {/* cabeca */}
        <circle cx="244" cy="128" r="38" fill="#B4C2D4" />
        {/* olhos */}
        <circle cx="231" cy="124" r="5.5" fill="#2e3b4a" />
        <circle cx="257" cy="124" r="5.5" fill="#2e3b4a" />
        <circle cx="233" cy="122" r="1.8" fill="#fff" />
        <circle cx="259" cy="122" r="1.8" fill="#fff" />
        {/* nariz + boca */}
        <path d="M241 134 h6 l-3 4z" fill="#F2762E" />
        <path d="M244 138 q-5 4 -9 1 M244 138 q5 4 9 1" stroke="#2e3b4a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* bigodes */}
        <path d="M232 132 l-20 -4 M232 136 l-20 2 M256 132 l20 -4 M256 136 l20 2" stroke="#8795a6" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
