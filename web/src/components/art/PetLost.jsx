export default function PetLost({ className = "" }) {
  return (
    <svg viewBox="0 0 300 260" className={className} role="img" aria-label="Pet procurando">
      <ellipse cx="150" cy="226" rx="92" ry="14" fill="#053451" opacity="0.08" />

      {/* interrogacoes */}
      <text x="214" y="70" fontSize="40" fontWeight="800" fill="#0B7ABF" opacity="0.9">?</text>
      <text x="246" y="46" fontSize="26" fontWeight="800" fill="#FF7A59" opacity="0.9">?</text>

      {/* cachorro sentado olhando para cima */}
      <g>
        {/* rabo */}
        <path d="M96 198 q-30 -4 -34 -30 q16 8 26 16 q8 6 12 14z" fill="#C77D3C" />
        {/* corpo */}
        <ellipse cx="138" cy="186" rx="44" ry="48" fill="#E6A45E" />
        <ellipse cx="138" cy="202" rx="26" ry="32" fill="#F6D9B4" />
        {/* patas */}
        <rect x="118" y="204" width="16" height="40" rx="8" fill="#E6A45E" />
        <rect x="142" y="204" width="16" height="40" rx="8" fill="#E6A45E" />
        <ellipse cx="126" cy="242" rx="10" ry="6" fill="#F6D9B4" />
        <ellipse cx="150" cy="242" rx="10" ry="6" fill="#F6D9B4" />
        {/* orelhas caidas */}
        <ellipse cx="100" cy="118" rx="15" ry="32" fill="#C77D3C" transform="rotate(-24 100 118)" />
        <ellipse cx="176" cy="118" rx="15" ry="32" fill="#C77D3C" transform="rotate(24 176 118)" />
        {/* cabeca levemente inclinada */}
        <g transform="rotate(-8 138 112)">
          <circle cx="138" cy="112" r="44" fill="#E6A45E" />
          <ellipse cx="138" cy="130" rx="26" ry="20" fill="#F6D9B4" />
          {/* olhos olhando para cima */}
          <circle cx="123" cy="102" r="6" fill="#3a2a1a" />
          <circle cx="153" cy="102" r="6" fill="#3a2a1a" />
          <circle cx="124" cy="99" r="2" fill="#fff" />
          <circle cx="154" cy="99" r="2" fill="#fff" />
          {/* focinho */}
          <ellipse cx="138" cy="120" rx="7" ry="5" fill="#3a2a1a" />
          <path d="M138 125 v6 M138 131 q-7 4 -11 0 M138 131 q7 4 11 0" stroke="#8a6a44" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
