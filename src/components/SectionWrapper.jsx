// src/components/SectionWrapper.jsx
import React from 'react';
import { cn } from '../lib/utils';

/**
 * Editorial full-width alternating bands:
 * - variant="dark": band-dark (black background, white text, green-400 accents)
 * - variant="green": band-green (green-900 background, white text)
 * - variant="light": band-light (pure white, ink text)
 * - variant="light-alt": band-light-alt (snow alternate surface)
 * - inner container: max-w-6xl mx-auto
 */
export function SectionWrapper({
  children,
  variant = 'light', // 'light' | 'light-alt' | 'dark' | 'green' | 'white'
  className = '',
  id = '',
  containerClassName = '',
  noBorder = false,
}) {
  let bandClass = 'band-light';
  if (variant === 'dark') {
    bandClass = 'band-dark';
  } else if (variant === 'green') {
    bandClass = 'band-green';
  } else if (variant === 'light-alt') {
    bandClass = 'band-light-alt';
  } else {
    bandClass = 'band-light';
  }

  return (
    <section
      id={id}
      className={cn(
        'w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8',
        !noBorder && 'border-b border-[var(--border)]',
        bandClass,
        containerClassName
      )}
    >
      <div className={cn('mx-auto max-w-6xl', className)}>
        {children}
      </div>
    </section>
  );
}
