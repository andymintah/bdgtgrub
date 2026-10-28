// Takeaway-box mascots. The noodle pail has a face; mood swaps the smile
// for a frown (used by the empty state).

const SOY = '#2A1A12';

function Face({ mood }) {
  return (
    <g fill={SOY} stroke={SOY} strokeLinecap="round" strokeWidth="2.5">
      <circle cx="27" cy="25" r="2.2" stroke="none" />
      <circle cx="37" cy="25" r="2.2" stroke="none" />
      {mood === 'sad'
        ? <path d="M26.5 33.5 Q32 29 37.5 33.5" fill="none" />
        : <path d="M26 30 Q32 35.5 38 30" fill="none" />}
    </g>
  );
}

function PailShape({ mood }) {
  return (
    <>
      <path d="M18.5 15 Q32 -3 45.5 15" fill="none" stroke={SOY} strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M16 15 L48 15 L44 41 L20 41 Z"
        fill="#fff"
        stroke={SOY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M18.2 35 L45.8 35" stroke="#E0261D" strokeWidth="3" />
      <path d="M16 15 L22 9 L32 13 L42 9 L48 15" fill="#fff" stroke={SOY} strokeWidth="3" strokeLinejoin="round" />
      <Face mood={mood} />
    </>
  );
}

export function Pail({ mood = 'happy', className = '', style }) {
  return (
    <svg viewBox="0 0 64 44" className={className} style={style} aria-hidden="true">
      <PailShape mood={mood} />
    </svg>
  );
}

export function BoxStack({ mood = 'happy', className = '' }) {
  return (
    <svg viewBox="0 0 64 58" className={className} aria-hidden="true">
      <rect x="5" y="41" width="54" height="14" rx="3" fill="#FFC93C" stroke={SOY} strokeWidth="3" />
      <path d="M5 47 L59 47" stroke={SOY} strokeWidth="2.5" />
      <PailShape mood={mood} />
    </svg>
  );
}

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <BoxStack className="w-16 sm:w-20 h-auto -rotate-6" />
      <span className="font-display text-4xl sm:text-5xl leading-none">BudgetGrub</span>
    </div>
  );
}
