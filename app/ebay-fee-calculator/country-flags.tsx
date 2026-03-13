type FlagProps = { size?: number; className?: string; style?: React.CSSProperties };

const rx = 3;

export function FlagUS({ size = 48, className, style }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (2 / 3)} className={className} style={style}>
      <rect width="60" height="40" rx={rx} fill="#B22234" />
      {[0, 2, 4, 6, 8, 10, 12].map(i => (
        <rect key={i} y={i * (40 / 13)} width="60" height={40 / 13} fill={i % 2 === 0 ? "#B22234" : "#fff"} />
      ))}
      <rect width="24" height={7 * (40 / 13)} rx={rx} fill="#3C3B6E" />
      {[
        [4, 3], [8, 3], [12, 3], [16, 3], [20, 3],
        [6, 6], [10, 6], [14, 6], [18, 6],
        [4, 9], [8, 9], [12, 9], [16, 9], [20, 9],
        [6, 12], [10, 12], [14, 12], [18, 12],
        [4, 15], [8, 15], [12, 15], [16, 15], [20, 15],
        [6, 18], [10, 18], [14, 18], [18, 18],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={0.9} fill="#fff" />
      ))}
    </svg>
  );
}

export function FlagUK({ size = 48, className, style }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (2 / 3)} className={className} style={style}>
      <rect width="60" height="40" rx={rx} fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="3" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="8" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="5" />
    </svg>
  );
}

export function FlagDE({ size = 48, className, style }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (2 / 3)} className={className} style={style}>
      <rect width="60" height="40" rx={rx} fill="#FFCE00" />
      <rect width="60" height="13.33" rx={rx} fill="#000" />
      <rect y="13.33" width="60" height="13.34" fill="#DD0000" />
    </svg>
  );
}

export function FlagAU({ size = 48, className, style }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (2 / 3)} className={className} style={style}>
      <rect width="60" height="40" rx={rx} fill="#00008B" />
      {/* Union Jack canton */}
      <rect width="30" height="20" fill="#012169" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="3" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="4" />
      <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="2.5" />
      {/* Commonwealth Star */}
      <polygon points="15,24 16.2,27.5 20,27.5 17,29.5 18,33 15,31 12,33 13,29.5 10,27.5 13.8,27.5" fill="#fff" />
      {/* Southern Cross */}
      <polygon points="44,10 45,12.5 47.5,12.5 45.5,14 46.2,16.5 44,15 41.8,16.5 42.5,14 40.5,12.5 43,12.5" fill="#fff" />
      <polygon points="50,20 51,22 53,22 51.5,23.2 52,25 50,23.8 48,25 48.5,23.2 47,22 49,22" fill="#fff" />
      <polygon points="44,28 45,30 47,30 45.5,31.2 46,33 44,31.8 42,33 42.5,31.2 41,30 43,30" fill="#fff" />
      <polygon points="37,18 38,20 40,20 38.5,21.2 39,23 37,21.8 35,23 35.5,21.2 34,20 36,20" fill="#fff" />
    </svg>
  );
}

export function FlagCA({ size = 48, className, style }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (2 / 3)} className={className} style={style}>
      <rect width="60" height="40" rx={rx} fill="#fff" />
      <rect width="15" height="40" rx={rx} fill="#FF0000" />
      <rect x="45" width="15" height="40" fill="#FF0000" />
      {/* Maple leaf (simplified) */}
      <path d="M30,8 L31,14 L36,12 L33,16 L37,18 L32,19 L33,24 L30,21 L27,24 L28,19 L23,18 L27,16 L24,12 L29,14 Z" fill="#FF0000" />
      {/* stem */}
      <rect x="29" y="24" width="2" height="5" fill="#FF0000" />
    </svg>
  );
}

export function FlagFR({ size = 48, className, style }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (2 / 3)} className={className} style={style}>
      <rect width="60" height="40" rx={rx} fill="#fff" />
      <rect width="20" height="40" rx={rx} fill="#002395" />
      <rect x="40" width="20" height="40" fill="#ED2939" />
    </svg>
  );
}

export function FlagIT({ size = 48, className, style }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (2 / 3)} className={className} style={style}>
      <rect width="60" height="40" rx={rx} fill="#fff" />
      <rect width="20" height="40" rx={rx} fill="#009246" />
      <rect x="40" width="20" height="40" fill="#CE2B37" />
    </svg>
  );
}

const FLAG_MAP: Record<string, React.FC<FlagProps>> = {
  us: FlagUS,
  uk: FlagUK,
  de: FlagDE,
  au: FlagAU,
  ca: FlagCA,
  fr: FlagFR,
  it: FlagIT,
};

export function CountryFlag({ countryId, ...props }: FlagProps & { countryId: string }) {
  const Component = FLAG_MAP[countryId];
  if (!Component) return null;
  return <Component {...props} />;
}
