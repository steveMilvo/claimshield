"use client";

import type { PipTiers } from "@/lib/game";

const EYE_R = [3.2, 7, 10, 12, 14];
const PUPIL_R = [3.2, 4, 6, 7, 8];

export default function Pip({
  tiers,
  color = "#7C6BE0",
  size = 240,
  className = "",
}: {
  tiers: PipTiers;
  color?: string;
  size?: number;
  className?: string;
}) {
  const { eyes, mouth, body, source, glow } = tiers;
  const eyeR = EYE_R[eyes];
  const pupilR = PUPIL_R[eyes];

  return (
    <svg
      viewBox="0 0 220 220"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={pipDescription(tiers)}
    >
      <defs>
        <radialGradient id="pipGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE6A1" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#FFE6A1" stopOpacity={0} />
        </radialGradient>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#5746B0" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* calibration glow */}
      <ellipse
        cx="110"
        cy="124"
        rx={86}
        ry={88}
        fill="url(#pipGlow)"
        opacity={0.18 + glow * 0.55}
        style={{ transition: "opacity .6s ease" }}
      />

      {/* feet (overconfidence >= 2) */}
      {body >= 2 && (
        <g>
          <ellipse cx="90" cy="184" rx="15" ry="9" fill={shade(color, -0.18)} />
          <ellipse cx="130" cy="184" rx="15" ry="9" fill={shade(color, -0.18)} />
        </g>
      )}

      {/* arms (overconfidence >= 1) */}
      {body >= 1 && (
        <g>
          <rect x="38" y="120" width="30" height={body >= 3 ? 16 : 12} rx="8" fill={shade(color, -0.1)} />
          <rect x="152" y="120" width="30" height={body >= 3 ? 16 : 12} rx="8" fill={shade(color, -0.1)} />
        </g>
      )}

      {/* book / source held in right hand */}
      {source >= 2 && (
        <g transform="translate(150 142) rotate(-8)">
          {source >= 3 ? (
            <>
              <rect x="-2" y="-16" width="34" height="30" rx="4" fill="#FFFFFF" stroke={shade(color, -0.2)} strokeWidth="2" />
              <line x1="15" y1="-16" x2="15" y2="14" stroke="#C9C2E8" strokeWidth="2" />
              <rect x="-2" y="-16" width="34" height="30" rx="4" fill="none" stroke="#3FD3A7" strokeWidth="2.5" />
            </>
          ) : (
            <rect x="0" y="-10" width="26" height="20" rx="3" fill="#FFFFFF" stroke={shade(color, -0.2)} strokeWidth="2" />
          )}
        </g>
      )}

      {/* body */}
      <g filter="url(#soft)">
        <ellipse cx="110" cy="124" rx="58" ry="60" fill={color} />
        {/* bottom shadow */}
        <ellipse cx="110" cy="150" rx="50" ry="30" fill="#000000" opacity="0.06" />
        {/* top highlight */}
        <ellipse cx="92" cy="92" rx="34" ry="24" fill="#FFFFFF" opacity="0.32" />
      </g>

      {/* cheeks (bias >= 3) */}
      {mouth >= 3 && (
        <g opacity="0.8">
          <ellipse cx="80" cy="142" rx="9" ry="6" fill="#FF8FB6" />
          <ellipse cx="140" cy="142" rx="9" ry="6" fill="#FF8FB6" />
        </g>
      )}

      {/* eyes (factual) */}
      <g>
        {eyes >= 1 && (
          <>
            <circle cx="90" cy="114" r={eyeR} fill="#FFFFFF" />
            <circle cx="130" cy="114" r={eyeR} fill="#FFFFFF" />
          </>
        )}
        <circle cx={90 + 1} cy={114 + 1} r={pupilR} fill="#2B2540" />
        <circle cx={130 + 1} cy={114 + 1} r={pupilR} fill="#2B2540" />
        {eyes >= 2 && (
          <>
            <circle cx={88} cy={111} r={pupilR / 2.6} fill="#FFFFFF" />
            <circle cx={128} cy={111} r={pupilR / 2.6} fill="#FFFFFF" />
          </>
        )}
        {/* eyelids for sleepy-smart look */}
        {eyes >= 3 && (
          <>
            <path d={`M ${90 - eyeR} 108 A ${eyeR} ${eyeR} 0 0 1 ${90 + eyeR} 108`} fill={color} opacity="0.25" />
            <path d={`M ${130 - eyeR} 108 A ${eyeR} ${eyeR} 0 0 1 ${130 + eyeR} 108`} fill={color} opacity="0.25" />
          </>
        )}
      </g>

      {/* eyebrows (factual max) */}
      {eyes >= 4 && (
        <g stroke="#2B2540" strokeWidth="3" strokeLinecap="round">
          <line x1="80" y1="96" x2="100" y2="93" />
          <line x1="120" y1="93" x2="140" y2="96" />
        </g>
      )}

      {/* mouth (bias) */}
      <g fill="none" stroke="#2B2540" strokeWidth="3.5" strokeLinecap="round">
        {renderMouth(mouth)}
      </g>

      {/* antenna (source >= 1) */}
      {source >= 1 && (
        <g>
          <line x1="110" y1="66" x2="110" y2="52" stroke={shade(color, -0.2)} strokeWidth="4" strokeLinecap="round" />
          <circle cx="110" cy="48" r="6" fill="#FFC44D" />
        </g>
      )}

      {/* glasses (source max) */}
      {source >= 4 && (
        <g fill="none" stroke="#2B2540" strokeWidth="2.5">
          <circle cx="90" cy="114" r={eyeR + 3} />
          <circle cx="130" cy="114" r={eyeR + 3} />
          <line x1={90 + eyeR + 3} y1="114" x2={130 - eyeR - 3} y2="114" />
        </g>
      )}

      {/* sparkles when calibration is high */}
      {glow > 0.66 && (
        <g fill="#FFD56B">
          <Sparkle x={48} y={70} />
          <Sparkle x={172} y={84} />
          <Sparkle x={150} y={40} />
        </g>
      )}
    </svg>
  );
}

function renderMouth(t: number) {
  switch (t) {
    case 0:
      return <line x1="100" y1="148" x2="120" y2="148" />;
    case 1:
      return <path d="M 98 146 Q 110 154 122 146" />;
    case 2:
      return <path d="M 92 146 Q 110 160 128 146" />;
    case 3:
      return <path d="M 88 146 Q 110 166 132 146 Q 110 158 88 146 Z" fill="#FF6F91" stroke="#2B2540" />;
    default:
      return (
        <>
          <path d="M 84 145 Q 110 172 136 145 Q 110 162 84 145 Z" fill="#FF6F91" stroke="#2B2540" />
          <path d="M 98 159 Q 110 165 122 159" stroke="#FFFFFF" strokeWidth="3" fill="none" />
        </>
      );
  }
}

function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M ${x} ${y - 6} L ${x + 2} ${y - 2} L ${x + 6} ${y} L ${x + 2} ${y + 2} L ${x} ${y + 6} L ${x - 2} ${y + 2} L ${x - 6} ${y} L ${x - 2} ${y - 2} Z`}
      className="animate-sparkle"
      style={{ transformOrigin: `${x}px ${y}px` }}
    />
  );
}

function pipDescription(t: PipTiers): string {
  const bits: string[] = ["Pip, a friendly robot"];
  bits.push(t.eyes >= 3 ? "with bright sharp eyes" : t.eyes >= 1 ? "with round eyes" : "with tiny dot eyes");
  bits.push(t.mouth >= 3 ? "and a big warm smile" : t.mouth >= 1 ? "and a smile" : "and a small mouth");
  if (t.body >= 1) bits.push("with little arms");
  if (t.source >= 1) bits.push("with a learning antenna");
  if (t.source >= 3) bits.push("holding a book");
  return bits.join(" ");
}

// nudge a hex colour lighter/darker
function shade(hex: string, amt: number): string {
  const c = hex.replace("#", "");
  const n = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.round(Math.min(255, Math.max(0, r + 255 * amt)));
  g = Math.round(Math.min(255, Math.max(0, g + 255 * amt)));
  b = Math.round(Math.min(255, Math.max(0, b + 255 * amt)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
