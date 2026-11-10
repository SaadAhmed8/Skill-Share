// src/components/AnimatedText.jsx
import React from 'react';

/**
 * Interpolates between Green (#1F9D55) and Pink (#EC4899)
 * across the total number of characters in the phrase.
 */
function getGreenPinkGradientColor(index, total) {
  if (total <= 1) return '#1F9D55';
  const t = index / (total - 1);

  // Start: Green #1F9D55 -> RGB(31, 157, 85)
  // End: Pink #EC4899   -> RGB(236, 72, 153)
  const r = Math.round(31 + (236 - 31) * t);
  const g = Math.round(157 + (72 - 157) * t);
  const b = Math.round(85 + (153 - 85) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * AnimatedText
 * Animates the Home page hero phrase ("who've been there.") character-by-character.
 * Each letter smoothly transitions along a green-to-pink gradient shade.
 * No underline is rendered.
 */
export function AnimatedText({ text, className = '' }) {
  const words = String(text).split(' ');
  // Calculate total letters excluding spaces so the gradient spans edge-to-edge
  const totalLetters = words.reduce((acc, word) => acc + word.length, 0);
  let globalCharIndex = 0;

  return (
    <span
      className={`anim-unique-text ${className}`.trim()}
      aria-label={text}
    >
      {words.map((word, wIdx) => {
        return (
          <React.Fragment key={`w-${wIdx}`}>
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((ch, cIdx) => {
                const idx = globalCharIndex++;
                const color = getGreenPinkGradientColor(idx, totalLetters);
                return (
                  <span key={`c-${cIdx}`} className="anim-char-mask">
                    <span
                      className="anim-gradient-char anim-char"
                      style={{
                        '--char-index': idx,
                        '--char-color': color,
                      }}
                      aria-hidden="true"
                    >
                      {ch}
                    </span>
                  </span>
                );
              })}
            </span>
            {wIdx < words.length - 1 ? '\u00A0' : ''}
          </React.Fragment>
        );
      })}
    </span>
  );
}
