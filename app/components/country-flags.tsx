import {
  US, GB, DE, JP, CA, IT, ES, AU, AE, BR, SG, MX, NL, BE, SE, PL, TR, CH, EU,
  FR, ID, TH, MY, VN, PH, RU,
} from "country-flag-icons/react/3x2";

const FLAGS: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  US, GB, DE, JP, CA, IT, ES, AU, AE, BR, SG, MX, NL, BE, SE, PL, TR, CH, EU,
  FR, ID, TH, MY, VN, PH, RU,
  UK: GB,
};

export function FlagIcon({
  code,
  size = 20,
  style,
}: {
  code: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const Flag = FLAGS[code.toUpperCase()];
  if (!Flag) return null;
  return (
    <Flag
      style={{
        width: size,
        height: Math.round(size * 0.7),
        borderRadius: 2,
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
        ...style,
      }}
    />
  );
}
