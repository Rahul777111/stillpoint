interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="16" cy="16" r="13" stroke="#E7B563" strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="16" cy="16" r="9.5" stroke="#E7B563" strokeOpacity="0.32" strokeWidth="1" />
      <circle cx="16" cy="16" r="6" stroke="#E7B563" strokeWidth="2.1" />
      <circle cx="16" cy="16" r="1.4" fill="#F3CC82" />
    </svg>
  );
}

export function Logo({ size = 28, withWordmark = true, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="font-display text-[1.18rem] font-semibold tracking-tightest text-mist">
          Stillpoint
        </span>
      )}
    </span>
  );
}
