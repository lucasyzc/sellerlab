interface LogoProps {
  size?: number;
  className?: string;
}

function EbayLogo({ size = 32, className }: LogoProps) {
  const h = size * 0.53;
  return (
    <svg
      viewBox="0 0 60 25"
      width={size}
      height={h}
      className={className}
      aria-label="eBay"
    >
      <text fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="26" y="22">
        <tspan fill="#E53238">e</tspan>
        <tspan fill="#0064D2">b</tspan>
        <tspan fill="#F5AF02">a</tspan>
        <tspan fill="#86B817">y</tspan>
      </text>
    </svg>
  );
}

function AmazonLogo({ size = 32, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 40 34"
      width={size}
      height={size * 0.85}
      className={className}
      aria-label="Amazon"
    >
      <text fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="14" y="16" fill="#232F3E">
        amazon
      </text>
      <path
        d="M3 22 Q20 30 37 22"
        fill="none"
        stroke="#FF9900"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M32 19 L37 22 L33 26"
        fill="none"
        stroke="#FF9900"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TikTokLogo({ size = 32, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 36"
      width={size * 0.89}
      height={size}
      className={className}
      aria-label="TikTok Shop"
    >
      {/* Red offset */}
      <path
        d="M18.5 2.5 C18.5 2.5 18.5 22 18.5 23 C18.5 27 15.5 30 11.5 30 C7.5 30 4.5 27 4.5 23 C4.5 19 7.5 16 11.5 16 C12.2 16 12.8 16.1 13.5 16.3 L13.5 11.5 C12.8 11.4 12.2 11.3 11.5 11.3 C4.9 11.3 -0.2 16.5 -0.2 23 C-0.2 29.5 4.9 34.7 11.5 34.7 C18.1 34.7 23.2 29.5 23.2 23 L23.2 11 C25.4 12.7 28.2 13.7 31.2 13.7 L31.2 8.7 C27.5 8.7 24.2 6.5 22.7 3.2 C22.2 2.2 21 2.5 18.5 2.5 Z"
        fill="#EE1D52"
        transform="translate(1.2, 0.5)"
      />
      {/* Cyan offset */}
      <path
        d="M18.5 2.5 C18.5 2.5 18.5 22 18.5 23 C18.5 27 15.5 30 11.5 30 C7.5 30 4.5 27 4.5 23 C4.5 19 7.5 16 11.5 16 C12.2 16 12.8 16.1 13.5 16.3 L13.5 11.5 C12.8 11.4 12.2 11.3 11.5 11.3 C4.9 11.3 -0.2 16.5 -0.2 23 C-0.2 29.5 4.9 34.7 11.5 34.7 C18.1 34.7 23.2 29.5 23.2 23 L23.2 11 C25.4 12.7 28.2 13.7 31.2 13.7 L31.2 8.7 C27.5 8.7 24.2 6.5 22.7 3.2 C22.2 2.2 21 2.5 18.5 2.5 Z"
        fill="#69C9D0"
        transform="translate(-1.2, -0.5)"
      />
      {/* Black main */}
      <path
        d="M18.5 2.5 C18.5 2.5 18.5 22 18.5 23 C18.5 27 15.5 30 11.5 30 C7.5 30 4.5 27 4.5 23 C4.5 19 7.5 16 11.5 16 C12.2 16 12.8 16.1 13.5 16.3 L13.5 11.5 C12.8 11.4 12.2 11.3 11.5 11.3 C4.9 11.3 -0.2 16.5 -0.2 23 C-0.2 29.5 4.9 34.7 11.5 34.7 C18.1 34.7 23.2 29.5 23.2 23 L23.2 11 C25.4 12.7 28.2 13.7 31.2 13.7 L31.2 8.7 C27.5 8.7 24.2 6.5 22.7 3.2 C22.2 2.2 21 2.5 18.5 2.5 Z"
        fill="#010101"
      />
    </svg>
  );
}

function ShopifyLogo({ size = 32, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 28 32"
      width={size * 0.875}
      height={size}
      className={className}
      aria-label="Shopify"
    >
      <path
        d="M23.4 6.2 C23.4 6.1 23.3 6 23.1 6 C23 6 22.4 5.9 22.4 5.9 C22.4 5.9 21.2 4.8 21.1 4.7 C21 4.5 20.7 4.6 20.6 4.6 C20.6 4.6 20.3 4.7 19.8 4.8 C19.7 4.4 19.4 3.9 19.1 3.5 C18.3 2.6 17.3 2.2 16.1 2.2 C16 2.2 15.8 2.2 15.7 2.2 C15.6 2.1 15.5 2 15.4 2 C14.3 2 13.4 2.6 12.7 3.7 C12.1 4.6 11.7 5.7 11.6 6.6 C10.2 7 9.3 7.3 9.2 7.3 C8.7 7.5 8.6 7.5 8.6 8 C8.6 8.4 6.5 24.2 6.5 24.2 L20.8 26.8 L27.5 25.2 C27.5 25.2 23.4 6.3 23.4 6.2 Z M18.9 5.1 C18.5 5.2 18.1 5.4 17.6 5.5 L17.6 5.2 C17.6 4.4 17.5 3.8 17.2 3.3 C17.8 3.4 18.2 4 18.5 4.4 C18.6 4.6 18.8 4.8 18.9 5.1 Z M16.3 3.4 C16.6 3.8 16.8 4.4 16.8 5.3 L16.8 5.5 C16.1 5.7 15.3 5.9 14.5 6.1 C14.8 4.9 15.4 3.9 16.1 3.3 C16.2 3.3 16.3 3.4 16.3 3.4 Z M15.3 2.8 C15.4 2.8 15.6 2.8 15.7 2.9 C14.8 3.7 14 4.9 13.6 6.5 C12.9 6.7 12.3 6.8 11.7 7 C12.1 5.2 13.5 2.9 15.3 2.8 Z"
        fill="#95BF47"
      />
      <path
        d="M23.1 6 C23 6 22.4 5.9 22.4 5.9 C22.4 5.9 21.2 4.8 21.1 4.7 C21 4.6 20.9 4.6 20.8 4.6 L20.8 26.8 L27.5 25.2 C27.5 25.2 23.4 6.3 23.4 6.2 C23.4 6.1 23.3 6 23.1 6 Z"
        fill="#5E8E3E"
      />
      <path
        d="M16.1 10.4 L15.2 13.4 C15.2 13.4 14.2 12.9 13 13 C11.3 13.1 11.3 14.2 11.3 14.4 C11.4 15.7 15.3 16.1 15.5 19.5 C15.7 22.2 14 24 11.5 24.2 C8.5 24.4 6.9 22.6 6.9 22.6 L7.5 20 C7.5 20 9.1 21.3 10.4 21.2 C11.2 21.2 11.5 20.5 11.5 20.1 C11.3 18.4 8.1 18.5 7.9 15.4 C7.8 12.8 9.5 10.1 13.4 9.9 C14.8 9.8 15.5 10.1 16.1 10.4 Z"
        fill="#FFF"
      />
    </svg>
  );
}

function WalmartLogo({ size = 32, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-label="Walmart"
    >
      {/* Walmart spark - 6 elongated shapes */}
      <g transform="translate(16 16)">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-9"
            rx="2.8"
            ry="6.5"
            fill="#FFC220"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="2.5" fill="#FFC220" />
      </g>
    </svg>
  );
}

function AliExpressLogo({ size = 32, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 40 18"
      width={size * 1.2}
      height={size * 0.54}
      className={className}
      aria-label="AliExpress"
    >
      <rect width="40" height="18" rx="3" fill="#FF4747" />
      <text
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="11"
        y="13.5"
        x="3"
        fill="#FFF"
        letterSpacing="-0.3"
      >
        AliExpress
      </text>
    </svg>
  );
}

function TemuLogo({ size = 32, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 44 18"
      width={size * 1.3}
      height={size * 0.54}
      className={className}
      aria-label="Temu"
    >
      <rect width="44" height="18" rx="3" fill="#FB7701" />
      <text
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="14"
        y="14.5"
        x="5"
        fill="#FFF"
        letterSpacing="1"
      >
        Temu
      </text>
    </svg>
  );
}

function SheinLogo({ size = 32, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 50 18"
      width={size * 1.4}
      height={size * 0.5}
      className={className}
      aria-label="SHEIN"
    >
      <text
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="16"
        y="15"
        x="1"
        fill="#000"
        letterSpacing="2"
      >
        SHEIN
      </text>
    </svg>
  );
}

const LOGO_MAP: Record<string, React.FC<LogoProps>> = {
  ebay: EbayLogo,
  amazon: AmazonLogo,
  tiktok: TikTokLogo,
  shopify: ShopifyLogo,
  walmart: WalmartLogo,
  aliexpress: AliExpressLogo,
  temu: TemuLogo,
  shein: SheinLogo,
};

export function PlatformLogo({
  platformId,
  size = 32,
  className,
}: {
  platformId: string;
  size?: number;
  className?: string;
}) {
  const LogoComponent = LOGO_MAP[platformId];
  if (!LogoComponent) return null;
  return <LogoComponent size={size} className={className} />;
}
