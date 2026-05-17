export function BrandLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex items-center" aria-label="Layali Beauty">
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            cx="22"
            cy="22"
            r="21"
            fill="#19372f"
            stroke="rgba(183,122,69,0.45)"
            strokeWidth="1"
          />
          {/* crescent */}
          <path
            d="M26 12 A10 10 0 1 0 26 32 A6 6 0 1 1 26 12 Z"
            fill="url(#compactGold)"
          />
          {/* sparkle top */}
          <path
            d="M30 11 L31 13.5 L33.5 14.5 L31 15.5 L30 18 L29 15.5 L26.5 14.5 L29 13.5 Z"
            fill="url(#compactGold)"
            opacity="0.9"
          />
          <defs>
            <linearGradient id="compactGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e7c083" />
              <stop offset="100%" stopColor="#b77a45" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center" aria-label="Layali Beauty">
      <svg
        width="200"
        height="80"
        viewBox="0 0 200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e7c083" />
            <stop offset="45%" stopColor="#c9922a" />
            <stop offset="100%" stopColor="#a87520" />
          </linearGradient>
          <linearGradient id="goldV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#edd070" />
            <stop offset="55%" stopColor="#c9922a" />
            <stop offset="100%" stopColor="#a0700f" />
          </linearGradient>
          <filter id="softGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Crescent moon */}
        <g transform="translate(153, 4)" filter="url(#softGlow)">
          <path
            d="M18 0 A14 14 0 1 0 18 28 A9 9 0 1 1 18 0 Z"
            fill="url(#gold)"
          />
        </g>

        {/* Star sparkle – large */}
        <g transform="translate(141, 2)" filter="url(#softGlow)">
          <path
            d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z"
            fill="url(#gold)"
          />
        </g>

        {/* Star sparkle – small */}
        <g transform="translate(154, 22)" filter="url(#softGlow)">
          <path
            d="M0,-3.5 L0.85,-0.85 L3.5,0 L0.85,0.85 L0,3.5 L-0.85,0.85 L-3.5,0 L-0.85,-0.85 Z"
            fill="url(#gold)"
            opacity="0.85"
          />
        </g>

        {/* "Layali" – script */}
        <text
          x="6"
          y="52"
          fontFamily="var(--font-script), 'Dancing Script', 'Brush Script MT', cursive"
          fontSize="56"
          fontWeight="700"
          fill="url(#goldV)"
          filter="url(#softGlow)"
        >
          Layali
        </text>

        {/* Thin separator */}
        <line
          x1="38"
          y1="60"
          x2="162"
          y2="60"
          stroke="url(#gold)"
          strokeWidth="0.6"
          opacity="0.5"
        />

        {/* "BEAUTY" – spaced caps */}
        <text
          x="100"
          y="76"
          fontFamily="var(--font-inter), 'Cormorant Garamond', Georgia, serif"
          fontSize="11"
          fontWeight="600"
          fill="url(#goldV)"
          letterSpacing="4.5"
          textAnchor="middle"
        >
          BEAUTY
        </text>
      </svg>
    </span>
  );
}
