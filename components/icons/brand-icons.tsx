import * as React from "react";

/**
 * Lucide v1 dropped third-party brand glyphs to stay icon-neutral. We need a
 * Twitter/X, LinkedIn, and Instagram mark for the share row + footer, so keep
 * them small and stroke-styled to match the rest of the lucide set.
 */
type IconProps = React.SVGAttributes<SVGSVGElement>;

const baseProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function TwitterXIcon({ className, ...props }: IconProps) {
  return (
    <svg {...baseProps} className={className} {...props}>
      <path d="M4 4l7.4 9.8L4.5 20H7l5.5-5.7L17 20h3l-7.7-10.3L19.5 4H17l-5 5.3L8 4H4z" />
    </svg>
  );
}

export function LinkedInIcon({ className, ...props }: IconProps) {
  return (
    <svg {...baseProps} className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v8" />
      <circle cx="8" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <path d="M12 18v-5a2 2 0 0 1 4 0v5" />
      <path d="M12 13.5V10" />
    </svg>
  );
}

export function InstagramGlyphIcon({ className, ...props }: IconProps) {
  return (
    <svg {...baseProps} className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
