import type { CSSProperties } from "react";

type Props = {
  size?: number;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * Pixel skull — exact SVG from original-dead-air-component.jsx (SkullLogo).
 * Click opens SkiFree easter egg when `onClick` is set.
 */
export function SkullLogo({ size = 48, onClick, className, style }: Props) {
  return (
    <svg
      role={onClick ? "button" : "img"}
      aria-label={onClick ? "Open hidden game" : "Dead Air logo"}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      tabIndex={onClick ? 0 : undefined}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <rect x="8" y="4" width="16" height="2" fill="#39ff14" />
      <rect x="6" y="6" width="2" height="2" fill="#39ff14" />
      <rect x="24" y="6" width="2" height="2" fill="#39ff14" />
      <rect x="4" y="8" width="2" height="2" fill="#39ff14" />
      <rect x="26" y="8" width="2" height="2" fill="#39ff14" />
      <rect x="4" y="10" width="24" height="2" fill="#39ff14" />
      <rect x="4" y="12" width="4" height="4" fill="#39ff14" />
      <rect x="12" y="12" width="8" height="4" fill="#39ff14" />
      <rect x="24" y="12" width="4" height="4" fill="#39ff14" />
      <rect x="8" y="12" width="4" height="4" fill="#0a0a0a" />
      <rect x="20" y="12" width="4" height="4" fill="#0a0a0a" />
      <rect x="4" y="16" width="24" height="2" fill="#39ff14" />
      <rect x="6" y="18" width="20" height="2" fill="#39ff14" />
      <rect x="8" y="20" width="4" height="2" fill="#39ff14" />
      <rect x="14" y="20" width="4" height="2" fill="#39ff14" />
      <rect x="20" y="20" width="4" height="2" fill="#39ff14" />
      <rect x="10" y="22" width="2" height="2" fill="#39ff14" />
      <rect x="16" y="22" width="2" height="2" fill="#39ff14" />
      <rect x="22" y="22" width="2" height="2" fill="#39ff14" />
    </svg>
  );
}
