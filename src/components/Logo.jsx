// src/components/Logo.jsx
import React from 'react';

/**
 * Skill Share Brand Logo
 * Inline SVG: black circle with white "S", wordmark "Skill Share" in bold
 */
export function Logo({
  showSubtitle = true,
  subtitleText = "NED",
  className = "",
  size = "default", // "default" | "sm" | "lg"
}) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div className={`inline-flex items-center gap-3 select-none text-left ${className}`}>
      {/* Black circle with white "S" */}
      <svg
        width={isSm ? "28" : isLg ? "44" : "36"}
        height={isSm ? "28" : isLg ? "44" : "36"}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <circle cx="18" cy="18" r="18" fill="#0B0B0B" />
        <text
          x="18"
          y="23.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="18"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
        >
          S
        </text>
      </svg>

      <div className="flex flex-col leading-tight">
        <span
          className={`font-heading font-bold text-[var(--ink)] tracking-tight ${
            isSm ? "text-base" : isLg ? "text-2xl" : "text-xl"
          }`}
        >
          Skill Share
        </span>
        {showSubtitle && subtitleText && (
          <span className="text-[10px] uppercase tracking-widest text-[var(--gray-600)] font-semibold">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
}

