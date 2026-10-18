export default function Logo({ className = "", withText = true, tone = "dark", size = 32 }) {
  const cor = tone === "light" ? "#ffffff" : "#053451";
  return (
    <span className={"inline-flex items-center gap-2 " + className}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="13" fill="url(#lg)" />
        <g fill="#fff">
          <circle cx="16" cy="19" r="3.8" />
          <circle cx="24" cy="15" r="3.8" />
          <circle cx="32" cy="19" r="3.8" />
          <path d="M24 22c5 0 8.8 3.6 8.8 7.6 0 3.3-2.7 4.8-5.2 4.8-1.6 0-2.4-.7-3.6-.7s-2 .7-3.6.7c-2.5 0-5.2-1.5-5.2-4.8C15.2 25.6 19 22 24 22z" />
        </g>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B7ABF" />
            <stop offset="1" stopColor="#053451" />
          </linearGradient>
        </defs>
      </svg>
      {withText && (
        <span className="text-xl font-black tracking-tight" style={{ color: cor }}>
          Cuida<span style={{ color: tone === "light" ? "#F6A877" : "#0B7ABF" }}>Pet</span>
        </span>
      )}
    </span>
  );
}
